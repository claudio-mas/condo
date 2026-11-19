/**
 * Calendários controlados para testes do domínio (P02).
 *
 * Dados sintéticos: feriados e temporadas escolhidos para exercitar a
 * classificação; não são contagens legadas da planilha nem dados homologados.
 */
import type { CalendarInput, CivilDate, IsoWeekday, Period } from "../../src/domain/contracts";

const d = (text: string) => text as CivilDate;

function monthlyPeriods(year: number): Period[] {
  const y = String(year);
  const feb = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? "29" : "28";
  return [
    { id: "jan", start: d(`${y}-01-01`), end: d(`${y}-01-31`), seasonId: "high" },
    { id: "feb", start: d(`${y}-02-01`), end: d(`${y}-02-${feb}`), seasonId: "high" },
    // Março dividido em dois períodos comerciais.
    { id: "mar-1", start: d(`${y}-03-01`), end: d(`${y}-03-15`), seasonId: "high" },
    { id: "mar-2", start: d(`${y}-03-16`), end: d(`${y}-03-31`), seasonId: "low" },
    { id: "apr", start: d(`${y}-04-01`), end: d(`${y}-04-30`), seasonId: "low" },
    { id: "may", start: d(`${y}-05-01`), end: d(`${y}-05-31`), seasonId: "low" },
    { id: "jun", start: d(`${y}-06-01`), end: d(`${y}-06-30`), seasonId: "low" },
    { id: "jul", start: d(`${y}-07-01`), end: d(`${y}-07-31`), seasonId: "low" },
    { id: "aug", start: d(`${y}-08-01`), end: d(`${y}-08-31`), seasonId: "low" },
    { id: "sep", start: d(`${y}-09-01`), end: d(`${y}-09-30`), seasonId: "low" },
    { id: "oct", start: d(`${y}-10-01`), end: d(`${y}-10-31`), seasonId: "low" },
    { id: "nov", start: d(`${y}-11-01`), end: d(`${y}-11-30`), seasonId: "low" },
    // Dezembro dividido: baixa até o dia 20, alta a partir do dia 21.
    { id: "dec-1", start: d(`${y}-12-01`), end: d(`${y}-12-20`), seasonId: "low" },
    { id: "dec-2", start: d(`${y}-12-21`), end: d(`${y}-12-31`), seasonId: "high" },
  ];
}

function controlledCalendar(year: number, weekendDays: readonly IsoWeekday[]): CalendarInput {
  const y = String(year);
  return {
    baseYear: year,
    weekendDays,
    holidays: [
      d(`${y}-01-01`),
      d(`${y}-04-21`),
      d(`${y}-05-01`),
      d(`${y}-09-07`),
      d(`${y}-10-12`),
      d(`${y}-11-02`),
      d(`${y}-11-15`),
      d(`${y}-12-25`),
    ],
    // 25/12 é feriado e data especial: a data especial prevalece.
    specialDates: [d(`${y}-12-24`), d(`${y}-12-25`), d(`${y}-12-31`)],
    seasons: [
      { id: "high", name: "Alta" },
      { id: "low", name: "Baixa" },
    ],
    periods: monthlyPeriods(year),
  };
}

/** Ano comum, fim de semana sábado e domingo. 2026-01-01 é quinta-feira. */
export const common2026 = controlledCalendar(2026, [6, 7]);

/** Ano comum, fim de semana de sexta a domingo (configuração por empreendimento). */
export const common2026FriToSun = controlledCalendar(2026, [5, 6, 7]);

/** Ano bissexto, fim de semana sábado e domingo. 2024-01-01 é segunda-feira. */
export const leap2024 = controlledCalendar(2024, [6, 7]);

/** IDs de todos os períodos, na ordem do calendário. */
export const allPeriodIds = (calendar: CalendarInput) => calendar.periods.map((period) => period.id);
