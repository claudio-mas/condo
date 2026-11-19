import { z } from "zod";
import {
  type CalculationInput,
  type CivilDate,
  type PaybackRule,
  COST_BASES,
  DAY_CATEGORIES,
  LOSS_POLICIES,
  PARTICIPATION_BASES,
  SCENARIO_KEYS,
} from "./contracts";
import { type FieldIssue, type FieldPath, type Result, fail, inputInvalid, isIssueCode, ok } from "./errors";
import { Dec, decimalLimitIssue, isDecimalText, isMoneyText } from "./money";

/**
 * Validação das entradas do domínio em duas etapas:
 * 1. estrutura (Zod, objetos estritos, união discriminada por `model`);
 * 2. regras cruzadas (referências, sobreposição, conciliação, ordens).
 *
 * `null` é ausência declarada; campo omitido é REQUIRED; texto malformado é
 * INVALID_FORMAT. Zero explícito é valor válido quando a faixa o permite.
 */

/* ------------------------------------------------------------------ */
/* Primitivos                                                          */
/* ------------------------------------------------------------------ */

const CIVIL_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function civilDateIssue(value: string): "INVALID_FORMAT" | "INVALID_DATE" | null {
  const match = CIVIL_DATE.exec(value);
  if (!match) return "INVALID_FORMAT";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return "INVALID_DATE";
  if (day < 1 || day > daysInMonth(year, month)) return "INVALID_DATE";
  return null;
}

const id = z.string().min(1, "REQUIRED").max(64, "OUT_OF_RANGE");
const name = z.string().min(1, "REQUIRED").max(200, "OUT_OF_RANGE");

const civilDate = z.string().superRefine((value, ctx) => {
  const issue = civilDateIssue(value);
  if (issue) ctx.addIssue({ code: "custom", message: issue });
});

const money = z.string().refine(isMoneyText, "INVALID_FORMAT");

/** Decimal canônico dentro dos limites de numeric(30,12): 18 inteiros, 12 fracionários. */
const decimalText = z
  .string()
  .refine(isDecimalText, { message: "INVALID_FORMAT", abort: true })
  .superRefine((value, ctx) => {
    const issue = decimalLimitIssue(value);
    if (issue) ctx.addIssue({ code: "custom", message: issue });
  });

/** Valor de cálculo não negativo (tarifas, custos): precisão do motor, sem duas casas. */
const amount = decimalText.refine((value) => !value.startsWith("-"), "OUT_OF_RANGE");

/** Fração entre 0 e 1 inclusive. */
const rate = decimalText.refine((value) => {
  const d = new Dec(value);
  return d.gte(0) && d.lte(1);
}, "OUT_OF_RANGE");

const integer = z
  .number()
  .refine(Number.isInteger, { message: "NOT_INTEGER", abort: true });

const positiveInteger = integer.refine((value) => value > 0, "NOT_POSITIVE");

const isoWeekday = integer.refine((value) => value >= 1 && value <= 7, "OUT_OF_RANGE");

/** Peso publicado: `null` é peso desconhecido e é recusado (nunca vira zero). */
const weight = decimalText.nullable();

/* ------------------------------------------------------------------ */
/* Estrutura                                                           */
/* ------------------------------------------------------------------ */

const paybackRuleSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("SIMPLE") }),
  z.strictObject({ kind: z.literal("DEDUCTED_MONTHS"), months: positiveInteger }),
]);

const calendarSchema = z.strictObject({
  baseYear: integer.refine((year) => year >= 1900 && year <= 2200, "OUT_OF_RANGE"),
  weekendDays: z.array(isoWeekday),
  holidays: z.array(civilDate),
  specialDates: z.array(civilDate),
  seasons: z.array(z.strictObject({ id, name })).min(1, "REQUIRED"),
  periods: z.array(z.strictObject({ id, start: civilDate, end: civilDate, seasonId: id })).min(1, "REQUIRED"),
});

const scenarioSchema = z.strictObject({
  key: z.enum(SCENARIO_KEYS),
  occupancy: z.array(z.strictObject({ periodId: id, rate })),
});

const tariffSchema = z.strictObject({
  categoryId: id,
  seasonId: id,
  dayCategory: z.enum(DAY_CATEGORIES),
  dailyRate: amount,
});

const costSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    id,
    name,
    kind: z.literal("FIXED"),
    amount: amount.nullable(),
    periodIds: z.array(id).min(1, "REQUIRED"),
  }),
  z.strictObject({
    id,
    name,
    kind: z.literal("PERCENTAGE"),
    rate: rate.nullable(),
    base: z.enum(COST_BASES),
    order: positiveInteger,
    periodIds: z.array(id).min(1, "REQUIRED"),
  }),
]);

const investmentSchema = z.strictObject({
  negotiatedPrice: money.nullable(),
  acquisitionCosts: z.array(z.strictObject({ id, name, amount: money.nullable() })),
});

const baseShape = {
  rulesVersion: id,
  calendar: calendarSchema,
  horizon: z.strictObject({ includedPeriodIds: z.array(id) }),
  scenarios: z.array(scenarioSchema).min(1, "REQUIRED"),
  tariffs: z.array(tariffSchema),
  costs: z.array(costSchema),
  investment: investmentSchema,
  paybackRule: paybackRuleSchema,
};

const participationSchema = z.discriminatedUnion("mode", [
  z.strictObject({
    mode: z.literal("CONTRACTUAL_PERCENTAGES"),
    subjectParticipantId: id,
    participants: z.array(z.strictObject({ participantId: id, share: rate })).min(1, "REQUIRED"),
  }),
  z.strictObject({
    mode: z.literal("WEIGHTS"),
    basis: z.enum(PARTICIPATION_BASES),
    subjectParticipantId: id,
    participants: z.array(z.strictObject({ participantId: id, weight })).min(1, "REQUIRED"),
  }),
]);

const calculationInputSchema = z.discriminatedUnion("model", [
  z.strictObject({
    ...baseShape,
    model: z.literal("INDIVIDUAL"),
    unit: z.strictObject({ unitId: id, categoryId: id }),
    unavailableDates: z.array(civilDate),
  }),
  z.strictObject({
    ...baseShape,
    model: z.literal("POOL"),
    inventory: z.array(z.strictObject({ categoryId: id, units: positiveInteger })).min(1, "REQUIRED"),
    participation: participationSchema,
    lossPolicy: z.enum(LOSS_POLICIES),
    retentions: z.array(z.strictObject({ id, name, rate })),
    investorCosts: z.array(z.strictObject({ id, name, amount: amount.nullable(), periodIds: z.array(id).min(1, "REQUIRED") })),
  }),
]);

type StructuralInput = z.output<typeof calculationInputSchema>;

/* ------------------------------------------------------------------ */
/* Tradução de issues do Zod para códigos de domínio                   */
/* ------------------------------------------------------------------ */

function valueAt(root: unknown, path: FieldPath): unknown {
  let node: unknown = root;
  for (const key of path) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string | number, unknown>)[key];
  }
  return node;
}

function toFieldIssues(raw: unknown, issues: readonly z.core.$ZodIssue[]): FieldIssue[] {
  const result: FieldIssue[] = [];
  for (const issue of issues) {
    const path = issue.path.filter((key): key is string | number => typeof key !== "symbol");
    switch (issue.code) {
      case "unrecognized_keys":
        for (const key of issue.keys) result.push({ path: [...path, key], code: "UNEXPECTED_FIELD" });
        break;
      case "invalid_type":
        result.push({ path, code: valueAt(raw, path) === undefined ? "REQUIRED" : "INVALID_FORMAT" });
        break;
      case "invalid_union":
      case "invalid_value":
        result.push({ path, code: valueAt(raw, path) === undefined ? "REQUIRED" : "INVALID_VALUE" });
        break;
      case "custom":
        result.push({ path, code: isIssueCode(issue.message) ? issue.message : "INVALID_FORMAT" });
        break;
      case "too_small":
      case "too_big":
        result.push({ path, code: isIssueCode(issue.message) ? issue.message : "OUT_OF_RANGE" });
        break;
      default:
        result.push({ path, code: "INVALID_FORMAT" });
    }
  }
  return dedupe(result);
}

function dedupe(issues: readonly FieldIssue[]): FieldIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.path.join(".")}|${issue.code}|${JSON.stringify(issue.params ?? {})}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Regras cruzadas                                                     */
/* ------------------------------------------------------------------ */

function checkUnique<T>(
  items: readonly T[],
  key: (item: T) => string,
  pathOf: (index: number) => FieldPath,
  issues: FieldIssue[],
): void {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    const value = key(item);
    if (seen.has(value)) issues.push({ path: pathOf(index), code: "DUPLICATE" });
    seen.add(value);
  });
}

function checkReferences(
  ids: readonly string[],
  known: ReadonlySet<string>,
  pathOf: (index: number) => FieldPath,
  issues: FieldIssue[],
): void {
  ids.forEach((value, index) => {
    if (!known.has(value)) issues.push({ path: pathOf(index), code: "UNKNOWN_REFERENCE" });
  });
  checkUnique(ids, (value) => value, pathOf, issues);
}

/**
 * Cobertura estática das tarifas necessárias (sem classificar data a data, o que
 * pertence ao calendário do P02). Para cada categoria em uso e cada temporada com
 * período incluído no horizonte, exige:
 * - WEEKDAY, salvo se todos os sete dias forem final de semana;
 * - WEEKEND, se houver dias de final de semana configurados;
 * - HOLIDAY, se algum feriado que não seja data especial cair em período incluído da temporada;
 * - SPECIAL, se alguma data especial cair em período incluído da temporada.
 * Tarifa zero explícita satisfaz a cobertura.
 */
function missingTariffIssues(input: StructuralInput, categoryIds: readonly string[]): FieldIssue[] {
  const { calendar } = input;
  const included = new Set(input.horizon.includedPeriodIds);
  const specialDates = new Set(calendar.specialDates);
  const holidays = calendar.holidays.filter((date) => !specialDates.has(date));
  const weekendDays = new Set(calendar.weekendDays);
  const available = new Set(input.tariffs.map((t) => `${t.categoryId}|${t.seasonId}|${t.dayCategory}`));

  const required: { seasonId: string; dayCategory: (typeof DAY_CATEGORIES)[number] }[] = [];
  for (const season of calendar.seasons) {
    const periods = calendar.periods.filter((p) => p.seasonId === season.id && included.has(p.id));
    if (periods.length === 0) continue;
    const within = (date: string) => periods.some((p) => p.start <= date && date <= p.end);
    if (weekendDays.size < 7) required.push({ seasonId: season.id, dayCategory: "WEEKDAY" });
    if (weekendDays.size > 0) required.push({ seasonId: season.id, dayCategory: "WEEKEND" });
    if (holidays.some(within)) required.push({ seasonId: season.id, dayCategory: "HOLIDAY" });
    if (calendar.specialDates.some(within)) required.push({ seasonId: season.id, dayCategory: "SPECIAL" });
  }

  const issues: FieldIssue[] = [];
  for (const categoryId of new Set(categoryIds)) {
    for (const { seasonId, dayCategory } of required) {
      if (!available.has(`${categoryId}|${seasonId}|${dayCategory}`)) {
        issues.push({ path: ["tariffs"], code: "MISSING_TARIFF", params: { categoryId, seasonId, dayCategory } });
      }
    }
  }
  return issues;
}

function semanticIssues(input: StructuralInput): FieldIssue[] {
  const issues: FieldIssue[] = [];
  const { calendar } = input;

  // Calendário
  checkUnique(calendar.weekendDays, String, (i) => ["calendar", "weekendDays", i], issues);
  checkUnique(calendar.holidays, String, (i) => ["calendar", "holidays", i], issues);
  checkUnique(calendar.specialDates, String, (i) => ["calendar", "specialDates", i], issues);
  checkUnique(calendar.seasons, (s) => s.id, (i) => ["calendar", "seasons", i, "id"], issues);
  checkUnique(calendar.periods, (p) => p.id, (i) => ["calendar", "periods", i, "id"], issues);

  const seasonIds = new Set(calendar.seasons.map((season) => season.id));
  const year = String(calendar.baseYear);
  const wellFormed: { index: number; start: string; end: string }[] = [];
  calendar.periods.forEach((period, index) => {
    const at = ["calendar", "periods", index];
    let valid = true;
    if (!period.start.startsWith(`${year}-`)) {
      issues.push({ path: [...at, "start"], code: "OUT_OF_RANGE" });
      valid = false;
    }
    if (!period.end.startsWith(`${year}-`) || period.end < period.start) {
      issues.push({ path: [...at, "end"], code: "OUT_OF_RANGE" });
      valid = false;
    }
    if (!seasonIds.has(period.seasonId)) issues.push({ path: [...at, "seasonId"], code: "UNKNOWN_REFERENCE" });
    if (valid) wellFormed.push({ index, start: period.start, end: period.end });
  });
  const ordered = [...wellFormed].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : a.index - b.index));
  for (let i = 1; i < ordered.length; i += 1) {
    const previous = ordered[i - 1]!;
    const current = ordered[i]!;
    if (current.start <= previous.end) {
      issues.push({ path: ["calendar", "periods", Math.max(previous.index, current.index)], code: "OVERLAP" });
    }
  }
  const periodIds = new Set(calendar.periods.map((period) => period.id));

  // Horizonte
  const included = input.horizon.includedPeriodIds;
  if (included.length === 0) issues.push({ path: ["horizon", "includedPeriodIds"], code: "REQUIRED" });
  checkReferences(included, periodIds, (i) => ["horizon", "includedPeriodIds", i], issues);

  // Cenários: ocupação obrigatória para cada período incluído
  checkUnique(input.scenarios, (s) => s.key, (i) => ["scenarios", i, "key"], issues);
  input.scenarios.forEach((scenario, s) => {
    const ids = scenario.occupancy.map((entry) => entry.periodId);
    checkReferences(ids, periodIds, (i) => ["scenarios", s, "occupancy", i, "periodId"], issues);
    const covered = new Set(ids);
    if (included.some((periodId) => periodIds.has(periodId) && !covered.has(periodId))) {
      issues.push({ path: ["scenarios", s, "occupancy"], code: "REQUIRED" });
    }
  });

  // Tarifas
  input.tariffs.forEach((tariff, i) => {
    if (!seasonIds.has(tariff.seasonId)) issues.push({ path: ["tariffs", i, "seasonId"], code: "UNKNOWN_REFERENCE" });
  });
  checkUnique(
    input.tariffs,
    (t) => `${t.categoryId}|${t.seasonId}|${t.dayCategory}`,
    (i) => ["tariffs", i],
    issues,
  );

  // Custos: vigência conhecida e ordem única entre custos sobre saldo
  checkUnique(input.costs, (c) => c.id, (i) => ["costs", i, "id"], issues);
  input.costs.forEach((cost, c) => {
    checkReferences(cost.periodIds, periodIds, (i) => ["costs", c, "periodIds", i], issues);
  });
  const balanceOrders = new Set<number>();
  input.costs.forEach((cost, c) => {
    if (cost.kind !== "PERCENTAGE" || cost.base !== "POSITIVE_BALANCE_AFTER_OPERATING_COSTS") return;
    if (balanceOrders.has(cost.order)) issues.push({ path: ["costs", c, "order"], code: "DUPLICATE" });
    balanceOrders.add(cost.order);
  });

  // Investimento
  checkUnique(
    input.investment.acquisitionCosts,
    (cost) => cost.id,
    (i) => ["investment", "acquisitionCosts", i, "id"],
    issues,
  );

  const categoryIds =
    input.model === "INDIVIDUAL" ? [input.unit.categoryId] : input.inventory.map((item) => item.categoryId);
  issues.push(...missingTariffIssues(input, categoryIds));

  if (input.model === "INDIVIDUAL") {
    checkUnique(input.unavailableDates, String, (i) => ["unavailableDates", i], issues);
    return dedupe(issues);
  }

  // Pool
  checkUnique(input.inventory, (item) => item.categoryId, (i) => ["inventory", i, "categoryId"], issues);
  checkUnique(input.retentions, (r) => r.id, (i) => ["retentions", i, "id"], issues);
  checkUnique(input.investorCosts, (c) => c.id, (i) => ["investorCosts", i, "id"], issues);
  input.investorCosts.forEach((cost, c) => {
    checkReferences(cost.periodIds, periodIds, (i) => ["investorCosts", c, "periodIds", i], issues);
  });

  const { participation } = input;
  const participantIds = participation.participants.map((p) => p.participantId);
  checkUnique(participantIds, (value) => value, (i) => ["participation", "participants", i, "participantId"], issues);
  if (!participantIds.includes(participation.subjectParticipantId)) {
    issues.push({ path: ["participation", "subjectParticipantId"], code: "UNKNOWN_REFERENCE" });
  }

  if (participation.mode === "CONTRACTUAL_PERCENTAGES") {
    // Conciliação exata com o total do pool; nada é normalizado automaticamente.
    const total = participation.participants.reduce((sum, p) => sum.plus(p.share), new Dec(0));
    if (!total.eq(1)) issues.push({ path: ["participation", "participants"], code: "NOT_RECONCILED" });
  } else {
    participation.participants.forEach((participant, i) => {
      const at = ["participation", "participants", i, "weight"];
      if (participant.weight === null) issues.push({ path: at, code: "UNKNOWN_WEIGHT" });
      else if (!new Dec(participant.weight).gt(0)) issues.push({ path: at, code: "NOT_POSITIVE" });
    });
  }

  return dedupe(issues);
}

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

export function validateCalculationInput(raw: unknown): Result<CalculationInput> {
  const parsed = calculationInputSchema.safeParse(raw);
  if (!parsed.success) return fail(inputInvalid(toFieldIssues(raw, parsed.error.issues)));
  const issues = semanticIssues(parsed.data);
  if (issues.length > 0) return fail(inputInvalid(issues));
  return ok(parsed.data as unknown as CalculationInput);
}

export function validatePaybackRule(raw: unknown): Result<PaybackRule> {
  const parsed = paybackRuleSchema.safeParse(raw);
  if (!parsed.success) return fail(inputInvalid(toFieldIssues(raw, parsed.error.issues)));
  return ok(parsed.data);
}

export function validateCivilDate(raw: unknown): Result<CivilDate> {
  const parsed = civilDate.safeParse(raw);
  if (!parsed.success) return fail(inputInvalid(toFieldIssues(raw, parsed.error.issues)));
  return ok(parsed.data as CivilDate);
}
