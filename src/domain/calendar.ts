import {
  type CalendarInput,
  type CivilDate,
  type DayCategory,
  type HorizonInput,
  type IsoWeekday,
  type UnavailableReason,
  DAY_CATEGORIES,
} from "./contracts";
import { type FieldIssue, type Result, fail, inputInvalid, ok } from "./errors";

/**
 * Calendário do ano-base (P02).
 *
 * - Datas civis manipuladas por aritmética de ano/mês/dia: sem `Date`, sem
 *   milissegundos e sem horário local.
 * - Cada data do ano-base é classificada uma única vez, com precedência
 *   SPECIAL > HOLIDAY > WEEKEND > WEEKDAY.
 * - O ano-base concilia com 365 ou 366 dias. Períodos excluídos do horizonte ou
 *   datas sem período tornam o horizonte parcial (indicadores anuais indisponíveis).
 * - Indisponibilidade de noites reduz noites disponíveis, nunca a duração do ano.
 * - Não usa contagens legadas da planilha: tudo é derivado das datas.
 */

export const MIN_BASE_YEAR = 1900;
export const MAX_BASE_YEAR = 2200;

export type CategoryCounts = Readonly<Record<DayCategory, number>>;

export interface CalendarDay {
  readonly date: CivilDate;
  readonly isoWeekday: IsoWeekday;
  readonly category: DayCategory;
  /** Período que contém a data; `null` quando a data é uma lacuna do calendário. */
  readonly periodId: string | null;
  readonly seasonId: string | null;
  /** Data marcada como sem noite disponível (não altera a duração do ano-base). */
  readonly unavailable: boolean;
}

export interface PeriodCalendar {
  readonly periodId: string;
  readonly seasonId: string;
  readonly start: CivilDate;
  readonly end: CivilDate;
  readonly included: boolean;
  /** Dias (= noites) do período. */
  readonly days: number;
  readonly counts: CategoryCounts;
  /** Noites disponíveis após indisponibilidades. */
  readonly availableNights: number;
  readonly availableCounts: CategoryCounts;
}

/** Motivos pelos quais o horizonte não representa o ano-base completo. */
export type PartialHorizonReason = "EXCLUDED_PERIODS" | "UNCOVERED_DATES";

export interface CalendarHorizon {
  /** Períodos incluídos, em ordem cronológica. */
  readonly periodIds: readonly string[];
  readonly start: CivilDate;
  readonly end: CivilDate;
  /** Soma dos dias dos períodos incluídos (não é a distância entre início e fim). */
  readonly days: number;
  readonly counts: CategoryCounts;
  readonly availableNights: number;
  readonly availableCounts: CategoryCounts;
  /** Verdadeiro somente se os períodos incluídos cobrem todas as datas do ano-base. */
  readonly fullYear: boolean;
  readonly partialReasons: readonly PartialHorizonReason[];
}

export interface BuiltCalendar {
  readonly baseYear: number;
  /** 365 ou 366. */
  readonly yearDays: number;
  /** Todas as datas do ano-base, em ordem. */
  readonly days: readonly CalendarDay[];
  /** Contagem por categoria de todas as datas do ano-base (soma = `yearDays`). */
  readonly yearCounts: CategoryCounts;
  /** Períodos na ordem de entrada. */
  readonly periods: readonly PeriodCalendar[];
  /** Datas do ano-base sem período (lacunas). */
  readonly uncoveredDates: readonly CivilDate[];
  readonly horizon: CalendarHorizon;
}

export interface BuildCalendarOptions {
  /** Padrão: todos os períodos. */
  readonly horizon?: HorizonInput;
  readonly unavailableDates?: readonly CivilDate[];
}

/* ------------------------------------------------------------------ */
/* Aritmética de datas civis                                           */
/* ------------------------------------------------------------------ */

const CIVIL_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInYear(year: number): 365 | 366 {
  return isLeapYear(year) ? 366 : 365;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

interface Ymd {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

function parseYmd(date: string): Ymd | null {
  const match = CIVIL_DATE.exec(date);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

function formatYmd({ year, month, day }: Ymd): CivilDate {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` as CivilDate;
}

export function isCivilDate(value: unknown): value is CivilDate {
  return typeof value === "string" && parseYmd(value) !== null;
}

/** Dia seguinte de uma data civil válida. */
export function nextCivilDate(date: CivilDate): CivilDate {
  const ymd = parseYmd(date);
  if (!ymd) throw inputInvalid([{ path: [], code: "INVALID_DATE" }]);
  let { year, month, day } = ymd;
  day += 1;
  if (day > daysInMonth(year, month)) {
    day = 1;
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return formatYmd({ year, month, day });
}

/** Dia da semana ISO (1 = segunda … 7 = domingo), algoritmo de Sakamoto. */
export function isoWeekdayOf(date: CivilDate): IsoWeekday {
  const ymd = parseYmd(date);
  if (!ymd) throw inputInvalid([{ path: [], code: "INVALID_DATE" }]);
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4] as const;
  const year = ymd.month < 3 ? ymd.year - 1 : ymd.year;
  const sunday0 =
    (year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + offsets[ymd.month - 1]! + ymd.day) %
    7;
  return (sunday0 === 0 ? 7 : sunday0) as IsoWeekday;
}

/** Datas civis de `start` a `end`, inclusive. */
export function civilDatesBetween(start: CivilDate, end: CivilDate): CivilDate[] {
  const dates: CivilDate[] = [];
  for (let date = start; date <= end; date = nextCivilDate(date)) dates.push(date);
  return dates;
}

export interface DayClassificationRules {
  readonly weekendDays: ReadonlySet<number>;
  readonly holidays: ReadonlySet<string>;
  readonly specialDates: ReadonlySet<string>;
}

/** Classificação única de uma data: SPECIAL > HOLIDAY > WEEKEND > WEEKDAY. */
export function classifyDate(date: CivilDate, rules: DayClassificationRules): DayCategory {
  if (rules.specialDates.has(date)) return "SPECIAL";
  if (rules.holidays.has(date)) return "HOLIDAY";
  if (rules.weekendDays.has(isoWeekdayOf(date))) return "WEEKEND";
  return "WEEKDAY";
}

/* ------------------------------------------------------------------ */
/* Validação                                                           */
/* ------------------------------------------------------------------ */

function checkDates(dates: readonly string[], path: string, issues: FieldIssue[]): void {
  const seen = new Set<string>();
  dates.forEach((date, index) => {
    if (!isCivilDate(date)) issues.push({ path: ["calendar", path, index], code: "INVALID_DATE" });
    else if (seen.has(date)) issues.push({ path: ["calendar", path, index], code: "DUPLICATE" });
    seen.add(date);
  });
}

function validate(calendar: CalendarInput, options: BuildCalendarOptions): FieldIssue[] {
  const issues: FieldIssue[] = [];
  const { baseYear } = calendar;
  if (!Number.isInteger(baseYear)) issues.push({ path: ["calendar", "baseYear"], code: "NOT_INTEGER" });
  else if (baseYear < MIN_BASE_YEAR || baseYear > MAX_BASE_YEAR) {
    issues.push({ path: ["calendar", "baseYear"], code: "OUT_OF_RANGE" });
  }

  const weekend = new Set<number>();
  calendar.weekendDays.forEach((day, index) => {
    if (!Number.isInteger(day) || day < 1 || day > 7) issues.push({ path: ["calendar", "weekendDays", index], code: "OUT_OF_RANGE" });
    else if (weekend.has(day)) issues.push({ path: ["calendar", "weekendDays", index], code: "DUPLICATE" });
    weekend.add(day);
  });
  checkDates(calendar.holidays, "holidays", issues);
  checkDates(calendar.specialDates, "specialDates", issues);

  const seasonIds = new Set<string>();
  calendar.seasons.forEach((season, index) => {
    if (seasonIds.has(season.id)) issues.push({ path: ["calendar", "seasons", index, "id"], code: "DUPLICATE" });
    seasonIds.add(season.id);
  });

  if (calendar.periods.length === 0) issues.push({ path: ["calendar", "periods"], code: "REQUIRED" });
  const prefix = `${String(baseYear).padStart(4, "0")}-`;
  const periodIds = new Set<string>();
  const wellFormed: { index: number; start: string; end: string }[] = [];
  calendar.periods.forEach((period, index) => {
    const at = ["calendar", "periods", index] as const;
    if (periodIds.has(period.id)) issues.push({ path: [...at, "id"], code: "DUPLICATE" });
    periodIds.add(period.id);
    if (!seasonIds.has(period.seasonId)) issues.push({ path: [...at, "seasonId"], code: "UNKNOWN_REFERENCE" });
    let valid = true;
    if (!isCivilDate(period.start)) {
      issues.push({ path: [...at, "start"], code: "INVALID_DATE" });
      valid = false;
    } else if (!period.start.startsWith(prefix)) {
      issues.push({ path: [...at, "start"], code: "OUT_OF_RANGE" });
      valid = false;
    }
    if (!isCivilDate(period.end)) {
      issues.push({ path: [...at, "end"], code: "INVALID_DATE" });
      valid = false;
    } else if (!period.end.startsWith(prefix) || period.end < period.start) {
      issues.push({ path: [...at, "end"], code: "OUT_OF_RANGE" });
      valid = false;
    }
    if (valid) wellFormed.push({ index, start: period.start, end: period.end });
  });

  // Sobreposição: cada data pertence a no máximo um período.
  const ordered = [...wellFormed].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : a.index - b.index));
  for (let i = 1; i < ordered.length; i += 1) {
    const previous = ordered[i - 1]!;
    const current = ordered[i]!;
    if (current.start <= previous.end) {
      issues.push({ path: ["calendar", "periods", Math.max(previous.index, current.index)], code: "OVERLAP" });
    }
  }

  if (options.horizon) {
    const included = options.horizon.includedPeriodIds;
    if (included.length === 0) issues.push({ path: ["horizon", "includedPeriodIds"], code: "REQUIRED" });
    const seen = new Set<string>();
    included.forEach((periodId, index) => {
      if (!periodIds.has(periodId)) issues.push({ path: ["horizon", "includedPeriodIds", index], code: "UNKNOWN_REFERENCE" });
      else if (seen.has(periodId)) issues.push({ path: ["horizon", "includedPeriodIds", index], code: "DUPLICATE" });
      seen.add(periodId);
    });
  }

  (options.unavailableDates ?? []).forEach((date, index) => {
    if (!isCivilDate(date)) issues.push({ path: ["unavailableDates", index], code: "INVALID_DATE" });
  });

  return issues;
}

/* ------------------------------------------------------------------ */
/* Construção                                                          */
/* ------------------------------------------------------------------ */

function emptyCounts(): Record<DayCategory, number> {
  return { SPECIAL: 0, HOLIDAY: 0, WEEKEND: 0, WEEKDAY: 0 };
}

function addCounts(target: Record<DayCategory, number>, source: CategoryCounts): void {
  for (const category of DAY_CATEGORIES) target[category] += source[category];
}

/**
 * Constrói o calendário do ano-base. Recusa com `INPUT_INVALID` (códigos
 * existentes) configurações que impediriam a classificação única das datas:
 * datas inválidas, períodos fora do ano-base, invertidos ou sobrepostos,
 * temporadas/períodos desconhecidos e duplicidades. Lacunas são aceitas e
 * tornam o horizonte parcial (`UNCOVERED_DATES`).
 */
export function buildCalendar(calendar: CalendarInput, options: BuildCalendarOptions = {}): Result<BuiltCalendar> {
  const issues = validate(calendar, options);
  if (issues.length > 0) return fail(inputInvalid(issues));

  const rules: DayClassificationRules = {
    weekendDays: new Set(calendar.weekendDays),
    holidays: new Set(calendar.holidays),
    specialDates: new Set(calendar.specialDates),
  };
  const unavailable = new Set<string>(options.unavailableDates ?? []);
  const includedIds = new Set(options.horizon?.includedPeriodIds ?? calendar.periods.map((period) => period.id));

  const periodOf = new Map<string, { periodId: string; seasonId: string }>();
  const periods: PeriodCalendar[] = calendar.periods.map((period) => {
    const counts = emptyCounts();
    const availableCounts = emptyCounts();
    let days = 0;
    let availableNights = 0;
    for (const date of civilDatesBetween(period.start, period.end)) {
      const category = classifyDate(date, rules);
      counts[category] += 1;
      days += 1;
      if (!unavailable.has(date)) {
        availableCounts[category] += 1;
        availableNights += 1;
      }
      periodOf.set(date, { periodId: period.id, seasonId: period.seasonId });
    }
    return {
      periodId: period.id,
      seasonId: period.seasonId,
      start: period.start,
      end: period.end,
      included: includedIds.has(period.id),
      days,
      counts,
      availableNights,
      availableCounts,
    };
  });

  const yearStart = formatYmd({ year: calendar.baseYear, month: 1, day: 1 });
  const yearEnd = formatYmd({ year: calendar.baseYear, month: 12, day: 31 });
  const days: CalendarDay[] = [];
  const yearCounts = emptyCounts();
  const uncoveredDates: CivilDate[] = [];
  for (const date of civilDatesBetween(yearStart, yearEnd)) {
    const category = classifyDate(date, rules);
    const owner = periodOf.get(date) ?? null;
    yearCounts[category] += 1;
    if (!owner) uncoveredDates.push(date);
    days.push({
      date,
      isoWeekday: isoWeekdayOf(date),
      category,
      periodId: owner?.periodId ?? null,
      seasonId: owner?.seasonId ?? null,
      unavailable: unavailable.has(date),
    });
  }

  const includedPeriods = periods.filter((period) => period.included).sort((a, b) => (a.start < b.start ? -1 : 1));
  const horizonCounts = emptyCounts();
  const horizonAvailable = emptyCounts();
  let horizonDays = 0;
  let horizonNights = 0;
  for (const period of includedPeriods) {
    addCounts(horizonCounts, period.counts);
    addCounts(horizonAvailable, period.availableCounts);
    horizonDays += period.days;
    horizonNights += period.availableNights;
  }

  const partialReasons: PartialHorizonReason[] = [];
  if (includedPeriods.length < periods.length) partialReasons.push("EXCLUDED_PERIODS");
  if (uncoveredDates.length > 0) partialReasons.push("UNCOVERED_DATES");
  const yearDays = daysInYear(calendar.baseYear);

  return ok({
    baseYear: calendar.baseYear,
    yearDays,
    days,
    yearCounts,
    periods,
    uncoveredDates,
    horizon: {
      periodIds: includedPeriods.map((period) => period.periodId),
      start: includedPeriods[0]!.start,
      end: includedPeriods.at(-1)!.end,
      days: horizonDays,
      counts: horizonCounts,
      availableNights: horizonNights,
      availableCounts: horizonAvailable,
      fullYear: partialReasons.length === 0 && horizonDays === yearDays,
      partialReasons,
    },
  });
}

/** Indicadores anuais exigem ano-base completo; caso contrário, `PARTIAL_YEAR`. */
export function annualIndicatorUnavailability(calendar: BuiltCalendar): Extract<UnavailableReason, "PARTIAL_YEAR"> | null {
  return calendar.horizon.fullYear ? null : "PARTIAL_YEAR";
}
