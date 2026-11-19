import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  type BuiltCalendar,
  annualIndicatorUnavailability,
  buildCalendar,
  civilDatesBetween,
  daysInYear,
  isoWeekdayOf,
  nextCivilDate,
} from "@/domain/calendar";
import type { CalendarInput, CivilDate, DayCategory } from "@/domain/contracts";
import { validateCalculationInput } from "@/domain/schemas";
import { allPeriodIds, common2026, common2026FriToSun, leap2024 } from "../../fixtures/reference/calendar";

const d = (text: string) => text as CivilDate;

function build(calendar: CalendarInput, options?: Parameters<typeof buildCalendar>[1]): BuiltCalendar {
  const result = buildCalendar(calendar, options);
  if (!result.ok) throw result.error;
  return result.value;
}

function issues(calendar: CalendarInput, options?: Parameters<typeof buildCalendar>[1]) {
  const result = buildCalendar(calendar, options);
  if (result.ok) return [];
  return result.error.issues.map((issue) => ({ path: issue.path.join("."), code: issue.code }));
}

function period(calendar: BuiltCalendar, id: string) {
  const found = calendar.periods.find((p) => p.periodId === id);
  if (!found) throw new Error(`período ${id} ausente`);
  return found;
}

const sum = (counts: Readonly<Record<DayCategory, number>>) =>
  counts.SPECIAL + counts.HOLIDAY + counts.WEEKEND + counts.WEEKDAY;

/** Oráculo independente, somente nos testes: dia da semana em UTC (sem horário local). */
function utcIsoWeekday(date: string): number {
  const [y, m, day] = date.split("-").map(Number) as [number, number, number];
  const weekday = new Date(Date.UTC(y, m - 1, day)).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

describe("datas civis", () => {
  it("avança datas atravessando mês, ano e 29 de fevereiro", () => {
    expect(nextCivilDate(d("2026-01-31"))).toBe("2026-02-01");
    expect(nextCivilDate(d("2026-02-28"))).toBe("2026-03-01");
    expect(nextCivilDate(d("2024-02-28"))).toBe("2024-02-29");
    expect(nextCivilDate(d("2024-02-29"))).toBe("2024-03-01");
    expect(nextCivilDate(d("2026-12-31"))).toBe("2027-01-01");
    expect(nextCivilDate(d("1900-02-28"))).toBe("1900-03-01");
    expect(nextCivilDate(d("2000-02-28"))).toBe("2000-02-29");
  });

  it("dia da semana ISO concorda com o oráculo UTC de 1900 a 2200", () => {
    let date = d("1900-01-01");
    let checked = 0;
    while (date <= "2200-12-31") {
      if (isoWeekdayOf(date) !== utcIsoWeekday(date)) throw new Error(`divergência em ${date}`);
      date = nextCivilDate(date);
      checked += 1;
    }
    // 301 anos × 365 + 73 bissextos (1900, 2100 e 2200 não são bissextos)
    expect(checked).toBe(109_938);
  });

  it("intervalo inclusivo de datas e duração do ano", () => {
    expect(civilDatesBetween(d("2026-03-30"), d("2026-04-02"))).toEqual([
      "2026-03-30",
      "2026-03-31",
      "2026-04-01",
      "2026-04-02",
    ]);
    expect(daysInYear(2026)).toBe(365);
    expect(daysInYear(2024)).toBe(366);
    expect(daysInYear(1900)).toBe(365);
    expect(daysInYear(2000)).toBe(366);
  });

  it("calendar.ts não usa Date nem milissegundos", () => {
    const source = readFileSync(new URL("../../src/domain/calendar.ts", import.meta.url), "utf8");
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(code).not.toMatch(/\bDate\b|getTime|setDate|86_?400_?000|toISOString/);
  });
});

describe("ano-base e reconciliação das contagens", () => {
  it("2026 totaliza 365 dias", () => {
    const calendar = build(common2026);
    expect(calendar.yearDays).toBe(365);
    expect(calendar.days).toHaveLength(365);
    expect(sum(calendar.yearCounts)).toBe(365);
    expect(calendar.periods.reduce((total, p) => total + p.days, 0)).toBe(365);
    expect(calendar.horizon.days).toBe(365);
    expect(calendar.horizon.fullYear).toBe(true);
    expect(calendar.uncoveredDates).toEqual([]);
  });

  it("2024 totaliza 366 dias, com fevereiro de 29", () => {
    const calendar = build(leap2024);
    expect(calendar.yearDays).toBe(366);
    expect(calendar.days).toHaveLength(366);
    expect(sum(calendar.yearCounts)).toBe(366);
    expect(period(calendar, "feb").days).toBe(29);
    expect(calendar.horizon.fullYear).toBe(true);
  });

  it("cada data pertence a uma única categoria e a no máximo um período", () => {
    const calendar = build(common2026);
    const dates = calendar.days.map((day) => day.date);
    expect(new Set(dates).size).toBe(365);
    for (const p of calendar.periods) expect(sum(p.counts)).toBe(p.days);
    const fromDays = { SPECIAL: 0, HOLIDAY: 0, WEEKEND: 0, WEEKDAY: 0 };
    for (const day of calendar.days) fromDays[day.category] += 1;
    expect(fromDays).toEqual(calendar.yearCounts);
    expect(calendar.horizon.counts).toEqual(calendar.yearCounts);
  });

  it("contagens de janeiro de 2026 (1º de janeiro é quinta e feriado)", () => {
    expect(period(build(common2026), "jan").counts).toEqual({ SPECIAL: 0, HOLIDAY: 1, WEEKEND: 9, WEEKDAY: 21 });
  });

  it("março dividido em dois períodos concilia com os 31 dias do mês", () => {
    const calendar = build(common2026);
    const first = period(calendar, "mar-1");
    const second = period(calendar, "mar-2");
    expect(first).toMatchObject({ days: 15, seasonId: "high", counts: { SPECIAL: 0, HOLIDAY: 0, WEEKEND: 5, WEEKDAY: 10 } });
    expect(second).toMatchObject({ days: 16, seasonId: "low", counts: { SPECIAL: 0, HOLIDAY: 0, WEEKEND: 4, WEEKDAY: 12 } });
    expect(first.days + second.days).toBe(31);
    const march = calendar.days.filter((day) => day.date.startsWith("2026-03-"));
    expect(march.filter((day) => day.periodId === "mar-1")).toHaveLength(15);
    expect(march.filter((day) => day.periodId === "mar-2")).toHaveLength(16);
  });
});

describe("precedência de classificação", () => {
  it("data especial prevalece sobre feriado (25/12) e sobre fim de semana", () => {
    const calendar = build(common2026);
    const christmas = calendar.days.find((day) => day.date === "2026-12-25")!;
    expect(christmas).toMatchObject({ category: "SPECIAL", isoWeekday: 5, periodId: "dec-2", seasonId: "high" });
    expect(period(calendar, "dec-2").counts).toEqual({ SPECIAL: 3, HOLIDAY: 0, WEEKEND: 2, WEEKDAY: 6 });
  });

  it("feriado prevalece sobre fim de semana", () => {
    const calendar = build({ ...common2026, holidays: [d("2026-01-03")], specialDates: [] });
    expect(calendar.days.find((day) => day.date === "2026-01-03")?.category).toBe("HOLIDAY");
  });

  it("fim de semana é configurável por empreendimento", () => {
    const satSun = period(build(common2026), "jan");
    const friToSun = period(build(common2026FriToSun), "jan");
    expect(satSun.counts).toEqual({ SPECIAL: 0, HOLIDAY: 1, WEEKEND: 9, WEEKDAY: 21 });
    expect(friToSun.counts).toEqual({ SPECIAL: 0, HOLIDAY: 1, WEEKEND: 14, WEEKDAY: 16 });
    const noWeekend = build({ ...common2026, weekendDays: [] });
    expect(noWeekend.yearCounts.WEEKEND).toBe(0);
    expect(sum(noWeekend.yearCounts)).toBe(365);
  });
});

describe("horizonte e ano completo", () => {
  it("o padrão é o ano-base completo", () => {
    const calendar = build(common2026);
    expect(calendar.horizon).toMatchObject({ start: "2026-01-01", end: "2026-12-31", fullYear: true, partialReasons: [] });
    expect(calendar.horizon.periodIds).toEqual(allPeriodIds(common2026));
    expect(annualIndicatorUnavailability(calendar)).toBeNull();
  });

  it("período excluído torna o horizonte parcial e impede indicadores anuais", () => {
    const included = allPeriodIds(common2026).filter((id) => id !== "mar-2");
    const calendar = build(common2026, { horizon: { includedPeriodIds: included } });
    expect(calendar.yearDays).toBe(365);
    expect(calendar.horizon.days).toBe(349);
    expect(calendar.horizon.fullYear).toBe(false);
    expect(calendar.horizon.partialReasons).toEqual(["EXCLUDED_PERIODS"]);
    expect(period(calendar, "mar-2").included).toBe(false);
    expect(annualIndicatorUnavailability(calendar)).toBe("PARTIAL_YEAR");
  });

  it("horizonte de um único período informa datas e dias explícitos", () => {
    const calendar = build(common2026, { horizon: { includedPeriodIds: ["dec-2"] } });
    expect(calendar.horizon).toMatchObject({ periodIds: ["dec-2"], start: "2026-12-21", end: "2026-12-31", days: 11, fullYear: false });
  });

  it("horizonte é ordenado cronologicamente independentemente da ordem informada", () => {
    const calendar = build(common2026, { horizon: { includedPeriodIds: ["dec-2", "jan"] } });
    expect(calendar.horizon.periodIds).toEqual(["jan", "dec-2"]);
    expect(calendar.horizon.days).toBe(31 + 11);
  });

  it("indisponibilidade de noites não altera a duração do ano-base nem o ano completo", () => {
    const unavailableDates = [d("2026-01-10"), d("2026-01-11"), d("2026-07-15")];
    const calendar = build(common2026, { unavailableDates });
    expect(calendar.yearDays).toBe(365);
    expect(calendar.horizon.days).toBe(365);
    expect(calendar.horizon.fullYear).toBe(true);
    expect(calendar.horizon.availableNights).toBe(362);
    const jan = period(calendar, "jan");
    expect(jan.days).toBe(31);
    expect(jan.availableNights).toBe(29);
    expect(jan.availableCounts).toEqual({ SPECIAL: 0, HOLIDAY: 1, WEEKEND: 7, WEEKDAY: 21 });
    expect(calendar.days.find((day) => day.date === "2026-01-10")?.unavailable).toBe(true);
  });
});

describe("lacunas e sobreposições", () => {
  it("lacuna é aceita, listada e torna o horizonte parcial", () => {
    const withGap = { ...common2026, periods: common2026.periods.filter((p) => p.id !== "feb") };
    const calendar = build(withGap);
    expect(calendar.yearDays).toBe(365);
    expect(calendar.uncoveredDates).toHaveLength(28);
    expect(calendar.uncoveredDates[0]).toBe("2026-02-01");
    expect(calendar.horizon.days).toBe(337);
    expect(calendar.horizon.fullYear).toBe(false);
    expect(calendar.horizon.partialReasons).toEqual(["UNCOVERED_DATES"]);
    expect(calendar.days.find((day) => day.date === "2026-02-10")).toMatchObject({ periodId: null, seasonId: null });
    expect(sum(calendar.yearCounts)).toBe(365);
    expect(annualIndicatorUnavailability(calendar)).toBe("PARTIAL_YEAR");
  });

  it("lacuna e exclusão acumulam os dois motivos", () => {
    const withGap = { ...common2026, periods: common2026.periods.filter((p) => p.id !== "feb") };
    const calendar = build(withGap, { horizon: { includedPeriodIds: ["jan"] } });
    expect(calendar.horizon.partialReasons).toEqual(["EXCLUDED_PERIODS", "UNCOVERED_DATES"]);
  });

  it("sobreposição é recusada com OVERLAP", () => {
    const periods = common2026.periods.map((p) => (p.id === "mar-2" ? { ...p, start: d("2026-03-15") } : p));
    expect(issues({ ...common2026, periods })).toContainEqual({ path: "calendar.periods.3", code: "OVERLAP" });
  });

  it("período contido em outro é recusado com OVERLAP", () => {
    const periods = [...common2026.periods, { id: "carnaval", start: d("2026-02-14"), end: d("2026-02-17"), seasonId: "high" }];
    expect(issues({ ...common2026, periods })).toContainEqual({ path: "calendar.periods.14", code: "OVERLAP" });
  });

  it("recusa configurações que impedem a classificação única", () => {
    const outside = common2026.periods.map((p) => (p.id === "dec-2" ? { ...p, end: d("2027-01-05") } : p));
    expect(issues({ ...common2026, periods: outside })).toContainEqual({ path: "calendar.periods.13.end", code: "OUT_OF_RANGE" });
    const inverted = common2026.periods.map((p) => (p.id === "jan" ? { ...p, end: d("2025-12-31") } : p));
    expect(issues({ ...common2026, periods: inverted })).toContainEqual({ path: "calendar.periods.0.end", code: "OUT_OF_RANGE" });
    const badDate = common2026.periods.map((p) => (p.id === "feb" ? { ...p, end: d("2026-02-29") } : p));
    expect(issues({ ...common2026, periods: badDate })).toContainEqual({ path: "calendar.periods.1.end", code: "INVALID_DATE" });
    const season = common2026.periods.map((p) => (p.id === "jan" ? { ...p, seasonId: "mid" } : p));
    expect(issues({ ...common2026, periods: season })).toContainEqual({ path: "calendar.periods.0.seasonId", code: "UNKNOWN_REFERENCE" });
    const dup = common2026.periods.map((p) => (p.id === "feb" ? { ...p, id: "jan" } : p));
    expect(issues({ ...common2026, periods: dup })).toContainEqual({ path: "calendar.periods.1.id", code: "DUPLICATE" });
    expect(issues({ ...common2026, periods: [] })).toContainEqual({ path: "calendar.periods", code: "REQUIRED" });
    expect(issues({ ...common2026, holidays: [d("2026-02-30")] })).toContainEqual({ path: "calendar.holidays.0", code: "INVALID_DATE" });
    expect(issues({ ...common2026, baseYear: 1899 })).toContainEqual({ path: "calendar.baseYear", code: "OUT_OF_RANGE" });
  });

  it("recusa horizonte vazio, desconhecido ou repetido", () => {
    expect(issues(common2026, { horizon: { includedPeriodIds: [] } })).toContainEqual({ path: "horizon.includedPeriodIds", code: "REQUIRED" });
    expect(issues(common2026, { horizon: { includedPeriodIds: ["xyz"] } })).toContainEqual({
      path: "horizon.includedPeriodIds.0",
      code: "UNKNOWN_REFERENCE",
    });
    expect(issues(common2026, { horizon: { includedPeriodIds: ["jan", "jan"] } })).toContainEqual({
      path: "horizon.includedPeriodIds.1",
      code: "DUPLICATE",
    });
  });
});

describe("concordância com a validação de tarifas necessárias (schemas.ts)", () => {
  it("as categorias exigidas por temporada são as presentes no buildCalendar, nas quatro categorias", () => {
    const included = allPeriodIds(common2026).filter((id) => id !== "dec-1");
    const calendar = build(common2026, { horizon: { includedPeriodIds: included } });

    const expected = new Set<string>();
    for (const p of calendar.periods.filter((item) => item.included)) {
      for (const category of ["SPECIAL", "HOLIDAY", "WEEKEND", "WEEKDAY"] as const) {
        if (p.counts[category] > 0) expected.add(`${p.seasonId}|${category}`);
      }
    }
    // As quatro categorias ocorrem na fixture (alta tem SPECIAL; baixa tem HOLIDAY).
    expect([...expected].sort()).toEqual([
      "high|HOLIDAY",
      "high|SPECIAL",
      "high|WEEKDAY",
      "high|WEEKEND",
      "low|HOLIDAY",
      "low|WEEKDAY",
      "low|WEEKEND",
    ]);

    const result = validateCalculationInput({
      model: "INDIVIDUAL",
      rulesVersion: "rules-test",
      calendar: common2026,
      horizon: { includedPeriodIds: included },
      scenarios: [{ key: "REALISTIC", occupancy: included.map((periodId) => ({ periodId, rate: "0.5" })) }],
      tariffs: [],
      costs: [],
      investment: { negotiatedPrice: "100000.00", acquisitionCosts: [] },
      paybackRule: { kind: "SIMPLE" },
      unit: { unitId: "u1", categoryId: "std" },
      unavailableDates: [],
    });
    expect(result.ok).toBe(false);
    const required = result.ok
      ? []
      : result.error.issues
          .filter((issue) => issue.code === "MISSING_TARIFF")
          .map((issue) => `${issue.params?.seasonId}|${issue.params?.dayCategory}`);
    expect(new Set(required)).toEqual(expected);
  });
});

/* ------------------------------------------------------------------ */
/* Verificação independente (Testador). Valores esperados calculados   */
/* com script Python descartável (datetime/calendar), sem calendar.ts. */
/* Ordem das contagens: [SPECIAL, HOLIDAY, WEEKEND, WEEKDAY].          */
/* ------------------------------------------------------------------ */

const tuple = (counts: Readonly<Record<DayCategory, number>>) => [counts.SPECIAL, counts.HOLIDAY, counts.WEEKEND, counts.WEEKDAY];
const periodTable = (calendar: BuiltCalendar) => Object.fromEntries(calendar.periods.map((p) => [p.periodId, tuple(p.counts)]));
const dayOf = (calendar: BuiltCalendar, date: string) => calendar.days.find((day) => day.date === date);

describe("contagens por período conferidas com oráculo independente", () => {
  it("2026, sábado e domingo", () => {
    const calendar = build(common2026);
    expect(periodTable(calendar)).toEqual({
      jan: [0, 1, 9, 21], feb: [0, 0, 8, 20], "mar-1": [0, 0, 5, 10], "mar-2": [0, 0, 4, 12],
      apr: [0, 1, 8, 21], may: [0, 1, 10, 20], jun: [0, 0, 8, 22], jul: [0, 0, 8, 23],
      aug: [0, 0, 10, 21], sep: [0, 1, 8, 21], oct: [0, 1, 9, 21], nov: [0, 2, 8, 20],
      "dec-1": [0, 0, 6, 14], "dec-2": [3, 0, 2, 6],
    });
    expect(tuple(calendar.yearCounts)).toEqual([3, 7, 103, 252]);
  });

  it("2026, sexta a domingo", () => {
    const calendar = build(common2026FriToSun);
    expect(periodTable(calendar)).toEqual({
      jan: [0, 1, 14, 16], feb: [0, 0, 12, 16], "mar-1": [0, 0, 7, 8], "mar-2": [0, 0, 6, 10],
      apr: [0, 1, 12, 17], may: [0, 1, 14, 16], jun: [0, 0, 12, 18], jul: [0, 0, 13, 18],
      aug: [0, 0, 14, 17], sep: [0, 1, 12, 17], oct: [0, 1, 14, 16], nov: [0, 2, 12, 16],
      "dec-1": [0, 0, 9, 11], "dec-2": [3, 0, 2, 6],
    });
    expect(tuple(calendar.yearCounts)).toEqual([3, 7, 153, 202]);
  });

  it("2024 bissexto, sábado e domingo; 29/02 é quinta e dia útil", () => {
    const calendar = build(leap2024);
    expect(periodTable(calendar)).toEqual({
      jan: [0, 1, 8, 22], feb: [0, 0, 8, 21], "mar-1": [0, 0, 4, 11], "mar-2": [0, 0, 6, 10],
      apr: [0, 1, 7, 22], may: [0, 1, 8, 22], jun: [0, 0, 10, 20], jul: [0, 0, 8, 23],
      aug: [0, 0, 9, 22], sep: [0, 1, 8, 21], oct: [0, 1, 7, 23], nov: [0, 2, 8, 20],
      "dec-1": [0, 0, 5, 15], "dec-2": [3, 0, 4, 4],
    });
    expect(tuple(calendar.yearCounts)).toEqual([3, 7, 100, 256]);
    expect(dayOf(calendar, "2024-02-29")).toMatchObject({ isoWeekday: 4, category: "WEEKDAY", periodId: "feb" });
  });

  it("anos seculares: 2000 tem 366 dias e 2100 tem 365", () => {
    const single = (year: number): CalendarInput => ({
      ...common2026,
      baseYear: year,
      holidays: [],
      specialDates: [],
      periods: [{ id: "all", start: d(`${year}-01-01`), end: d(`${year}-12-31`), seasonId: "high" }],
    });
    expect(build(single(2000))).toMatchObject({ yearDays: 366, horizon: { days: 366, fullYear: true } });
    expect(build(single(2100))).toMatchObject({ yearDays: 365, horizon: { days: 365, fullYear: true } });
    expect(issues({ ...single(2100), periods: [{ id: "f", start: d("2100-02-29"), end: d("2100-03-01"), seasonId: "high" }] })).toContainEqual({
      path: "calendar.periods.0.start",
      code: "INVALID_DATE",
    });
  });
});

describe("bordas de classificação", () => {
  it("feriado em fim de semana conta como feriado (15/11/2026 é domingo; 01/05/2026 é sexta)", () => {
    expect(dayOf(build(common2026), "2026-11-15")).toMatchObject({ isoWeekday: 7, category: "HOLIDAY" });
    expect(dayOf(build(common2026FriToSun), "2026-05-01")).toMatchObject({ isoWeekday: 5, category: "HOLIDAY" });
  });

  it("data especial fora de período é classificada no ano, mas não entra no horizonte", () => {
    const withGap: CalendarInput = {
      ...common2026,
      specialDates: [...common2026.specialDates, d("2026-02-14")],
      periods: common2026.periods.filter((p) => p.id !== "feb"),
    };
    const calendar = build(withGap);
    expect(dayOf(calendar, "2026-02-14")).toMatchObject({ category: "SPECIAL", periodId: null });
    expect(tuple(calendar.yearCounts)).toEqual([4, 7, 102, 252]);
    // fevereiro de 2026 (lacuna) = 8 fins de semana + 20 dias úteis
    expect(tuple(calendar.horizon.counts)).toEqual([3, 7, 95, 232]);
    expect(calendar.horizon.days).toBe(337);
  });

  it("feriados, datas especiais e indisponíveis fora do ano-base são aceitos e ignorados", () => {
    const calendar = build(
      { ...common2026, holidays: [...common2026.holidays, d("2025-12-25"), d("2027-01-01")], specialDates: [...common2026.specialDates, d("2027-01-01")] },
      { unavailableDates: [d("2025-12-31"), d("2027-01-01")] },
    );
    expect(calendar.days).toHaveLength(365);
    expect(tuple(calendar.yearCounts)).toEqual([3, 7, 103, 252]);
    expect(calendar.horizon.availableNights).toBe(365);
    expect(calendar.horizon.fullYear).toBe(true);
  });

  it("recusa duplicidades e valores fora de faixa nas regras de classificação", () => {
    expect(issues({ ...common2026, holidays: [d("2026-04-21"), d("2026-04-21")] })).toContainEqual({ path: "calendar.holidays.1", code: "DUPLICATE" });
    expect(issues({ ...common2026, specialDates: [d("2026-12-24"), d("2026-12-24")] })).toContainEqual({ path: "calendar.specialDates.1", code: "DUPLICATE" });
    expect(issues({ ...common2026, specialDates: [d("2026-13-01")] })).toContainEqual({ path: "calendar.specialDates.0", code: "INVALID_DATE" });
    const weekend = (days: number[]) => ({ ...common2026, weekendDays: days as CalendarInput["weekendDays"] });
    expect(issues(weekend([0]))).toContainEqual({ path: "calendar.weekendDays.0", code: "OUT_OF_RANGE" });
    expect(issues(weekend([6, 8]))).toContainEqual({ path: "calendar.weekendDays.1", code: "OUT_OF_RANGE" });
    expect(issues(weekend([6, 6]))).toContainEqual({ path: "calendar.weekendDays.1", code: "DUPLICATE" });
    expect(issues({ ...common2026, baseYear: 2026.5 })).toContainEqual({ path: "calendar.baseYear", code: "NOT_INTEGER" });
    expect(issues({ ...common2026, baseYear: 2201 })).toContainEqual({ path: "calendar.baseYear", code: "OUT_OF_RANGE" });
    expect(issues(common2026, { unavailableDates: [d("2026-02-30")] })).toContainEqual({ path: "unavailableDates.0", code: "INVALID_DATE" });
  });
});

describe("bordas de períodos, lacunas e sobreposição", () => {
  it("período de um dia", () => {
    const periods = [
      { id: "new-year", start: d("2026-01-01"), end: d("2026-01-01"), seasonId: "high" },
      { id: "rest", start: d("2026-01-02"), end: d("2026-12-31"), seasonId: "low" },
    ];
    const calendar = build({ ...common2026, periods });
    expect(period(calendar, "new-year")).toMatchObject({ days: 1, counts: { SPECIAL: 0, HOLIDAY: 1, WEEKEND: 0, WEEKDAY: 0 } });
    expect(period(calendar, "rest").days).toBe(364);
    expect(calendar.horizon.fullYear).toBe(true);
    const only = build({ ...common2026, periods }, { horizon: { includedPeriodIds: ["new-year"] } });
    expect(only.horizon).toMatchObject({ start: "2026-01-01", end: "2026-01-01", days: 1, fullYear: false });
  });

  it("virada de ano: o ano-base vai de 01/01 a 31/12 e período iniciado no ano anterior é recusado", () => {
    const calendar = build(common2026);
    expect(calendar.days[0]?.date).toBe("2026-01-01");
    expect(calendar.days.at(-1)?.date).toBe("2026-12-31");
    const startsBefore = common2026.periods.map((p) => (p.id === "jan" ? { ...p, start: d("2025-12-26") } : p));
    expect(issues({ ...common2026, periods: startsBefore })).toContainEqual({ path: "calendar.periods.0.start", code: "OUT_OF_RANGE" });
  });

  it("lacunas de um dia no início, no meio e no fim do ano", () => {
    const periods = common2026.periods.map((p) => {
      if (p.id === "jan") return { ...p, start: d("2026-01-02"), end: d("2026-01-30") };
      if (p.id === "dec-2") return { ...p, end: d("2026-12-30") };
      return p;
    });
    const calendar = build({ ...common2026, periods });
    expect(calendar.uncoveredDates).toEqual(["2026-01-01", "2026-01-31", "2026-12-31"]);
    expect(calendar.horizon).toMatchObject({ days: 362, fullYear: false, partialReasons: ["UNCOVERED_DATES"] });
    expect(calendar.yearDays).toBe(365);
    expect(annualIndicatorUnavailability(calendar)).toBe("PARTIAL_YEAR");
  });

  it("horizonte não contíguo: início e fim cobrem o ano, mas dias = soma dos incluídos e não é ano completo", () => {
    const calendar = build(common2026, { horizon: { includedPeriodIds: ["jan", "dec-2"] } });
    expect(calendar.horizon).toMatchObject({ start: "2026-01-01", end: "2026-12-31", days: 42, fullYear: false, partialReasons: ["EXCLUDED_PERIODS"] });
    expect(annualIndicatorUnavailability(calendar)).toBe("PARTIAL_YEAR");
  });

  it("horizonte explícito com todos os períodos, em qualquer ordem, é ano completo", () => {
    const shuffled = [...allPeriodIds(common2026)].reverse();
    const calendar = build(common2026, { horizon: { includedPeriodIds: shuffled } });
    expect(calendar.horizon).toMatchObject({ days: 365, fullYear: true, partialReasons: [] });
    expect(calendar.horizon.periodIds).toEqual(allPeriodIds(common2026));
  });

  it("todos os períodos incluídos com lacuna continuam parciais", () => {
    const withGap = { ...common2026, periods: common2026.periods.filter((p) => p.id !== "feb") };
    const calendar = build(withGap, { horizon: { includedPeriodIds: allPeriodIds(withGap) } });
    expect(calendar.horizon).toMatchObject({ days: 337, fullYear: false, partialReasons: ["UNCOVERED_DATES"] });
  });

  it("sobreposição: período idêntico, borda de um dia e entrada fora de ordem", () => {
    const twin = [...common2026.periods, { ...common2026.periods[0]!, id: "jan-twin" }];
    expect(issues({ ...common2026, periods: twin }).filter((issue) => issue.code === "OVERLAP")).not.toHaveLength(0);
    const edge = [
      { id: "a", start: d("2026-01-01"), end: d("2026-06-30"), seasonId: "high" },
      { id: "b", start: d("2026-06-30"), end: d("2026-12-31"), seasonId: "low" },
    ];
    expect(issues({ ...common2026, periods: edge })).toContainEqual({ path: "calendar.periods.1", code: "OVERLAP" });
    expect(issues({ ...common2026, periods: [...edge].reverse() })).toContainEqual({ path: "calendar.periods.1", code: "OVERLAP" });
    const adjacent = [edge[0]!, { ...edge[1]!, start: d("2026-07-01") }];
    expect(build({ ...common2026, periods: adjacent }).horizon.fullYear).toBe(true);
  });

  it("período contido em outro de período não adjacente na entrada é recusado", () => {
    const periods = [
      { id: "year", start: d("2026-01-01"), end: d("2026-12-31"), seasonId: "low" },
      { id: "x", start: d("2026-05-01"), end: d("2026-05-10"), seasonId: "high" },
      { id: "y", start: d("2026-08-01"), end: d("2026-08-10"), seasonId: "high" },
    ];
    const result = buildCalendar({ ...common2026, periods });
    expect(result.ok).toBe(false);
  });
});

describe("indisponibilidade de noites — bordas", () => {
  it("noites indisponíveis em período excluído não afetam o horizonte nem a duração do ano", () => {
    const included = allPeriodIds(common2026).filter((id) => id !== "mar-2");
    const calendar = build(common2026, {
      horizon: { includedPeriodIds: included },
      unavailableDates: [d("2026-03-20"), d("2026-03-21"), d("2026-01-10")],
    });
    expect(calendar.yearDays).toBe(365);
    expect(period(calendar, "mar-2")).toMatchObject({ days: 16, availableNights: 14, included: false });
    expect(calendar.horizon).toMatchObject({ days: 349, availableNights: 348, partialReasons: ["EXCLUDED_PERIODS"] });
    expect(tuple(calendar.horizon.counts)).toEqual([3, 7, 99, 240]);
    expect(tuple(calendar.horizon.availableCounts)).toEqual([3, 7, 98, 240]);
  });

  it("noite indisponível em lacuna é marcada e não altera as contagens do horizonte", () => {
    const withGap = { ...common2026, periods: common2026.periods.filter((p) => p.id !== "feb") };
    const calendar = build(withGap, { unavailableDates: [d("2026-02-10")] });
    expect(dayOf(calendar, "2026-02-10")).toMatchObject({ unavailable: true, periodId: null });
    expect(calendar.horizon).toMatchObject({ days: 337, availableNights: 337 });
  });

  it("data indisponível repetida reduz uma única noite; data especial indisponível reduz SPECIAL", () => {
    const calendar = build(common2026, { unavailableDates: [d("2026-07-15"), d("2026-07-15"), d("2026-12-25")] });
    expect(calendar.horizon.availableNights).toBe(363);
    expect(period(calendar, "dec-2").availableCounts).toEqual({ SPECIAL: 2, HOLIDAY: 0, WEEKEND: 2, WEEKDAY: 6 });
    expect(calendar.horizon.fullYear).toBe(true);
  });
});
