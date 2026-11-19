import { describe, expect, it } from "vitest";
import type { CalculationInput, IndividualCalculationInput, PoolCalculationInput } from "@/domain/contracts";
import type { IssueCode } from "@/domain/errors";
import {
  validateCalculationInput,
  validateCivilDate,
  validatePaybackRule,
} from "@/domain/schemas";

type Json = Record<string, unknown>;

function baseInput(): Json {
  return {
    rulesVersion: "rules-2026.1",
    calendar: {
      baseYear: 2026,
      weekendDays: [5, 6, 7],
      holidays: ["2026-01-01", "2026-12-25"],
      specialDates: ["2026-12-31"],
      seasons: [
        { id: "high", name: "Alta" },
        { id: "low", name: "Baixa" },
      ],
      periods: [
        { id: "p1", start: "2026-01-01", end: "2026-03-15", seasonId: "high" },
        { id: "p2", start: "2026-03-16", end: "2026-11-30", seasonId: "low" },
        { id: "p3", start: "2026-12-01", end: "2026-12-31", seasonId: "high" },
      ],
    },
    horizon: { includedPeriodIds: ["p1", "p2", "p3"] },
    scenarios: [
      {
        key: "REALISTIC",
        occupancy: [
          { periodId: "p1", rate: "0.75" },
          { periodId: "p2", rate: "0" },
          { periodId: "p3", rate: "1" },
        ],
      },
    ],
    tariffs: [
      { categoryId: "std", seasonId: "high", dayCategory: "WEEKDAY", dailyRate: "450.00" },
      { categoryId: "std", seasonId: "low", dayCategory: "WEEKDAY", dailyRate: "0.00" },
    ],
    costs: [
      { id: "c1", name: "Condomínio", kind: "FIXED", amount: "800.00", periodIds: ["p1", "p2", "p3"] },
      { id: "c2", name: "Taxa", kind: "PERCENTAGE", rate: "0.2", base: "GROSS_REVENUE", order: 1, periodIds: ["p1"] },
      { id: "c3", name: "Pendente", kind: "FIXED", amount: null, periodIds: ["p2"] },
    ],
    investment: {
      negotiatedPrice: "500000.00",
      acquisitionCosts: [
        { id: "itbi", name: "ITBI", amount: "0.00" },
        { id: "cartorio", name: "Cartório", amount: null },
      ],
    },
    paybackRule: { kind: "DEDUCTED_MONTHS", months: 24 },
  };
}

function individualInput(): Json {
  return {
    ...baseInput(),
    model: "INDIVIDUAL",
    unit: { unitId: "u-101", categoryId: "std" },
    unavailableDates: [],
  };
}

function poolInput(): Json {
  return {
    ...baseInput(),
    model: "POOL",
    inventory: [{ categoryId: "std", units: 40 }],
    participation: {
      mode: "WEIGHTS",
      basis: "LIST_PRICE",
      subjectParticipantId: "u-101",
      participants: [
        { participantId: "u-101", weight: "500000.00" },
        { participantId: "u-102", weight: "450000.00" },
      ],
    },
    lossPolicy: "PROPORTIONAL_PASS_THROUGH",
    retentions: [{ id: "r1", name: "Fundo de reserva", rate: "0.05" }],
    investorCosts: [{ id: "ic1", name: "IPTU", amount: "1200.00", periodIds: ["p1"] }],
  };
}

function set(target: Json, path: (string | number)[], value: unknown): Json {
  let node: unknown = target;
  for (const key of path.slice(0, -1)) node = (node as Record<string | number, unknown>)[key];
  const last = path.at(-1)!;
  if (value === undefined) delete (node as Record<string | number, unknown>)[last];
  else (node as Record<string | number, unknown>)[last] = value;
  return target;
}

function issuesOf(raw: unknown): { path: string; code: IssueCode }[] {
  const result = validateCalculationInput(raw);
  if (result.ok) return [];
  return result.error.issues.map((issue) => ({ path: issue.path.join("."), code: issue.code }));
}

describe("CalculationInput — validação discriminada por modelo", () => {
  it("aceita individual válido sem campos de pool", () => {
    const result = validateCalculationInput(individualInput());
    expect(result.ok).toBe(true);
    if (result.ok) {
      const input: CalculationInput = result.value;
      expect(input.model).toBe("INDIVIDUAL");
      expect((input as IndividualCalculationInput).unit.unitId).toBe("u-101");
    }
  });

  it("aceita pool por pesos sem percentuais contratuais", () => {
    const result = validateCalculationInput(poolInput());
    expect(result.ok).toBe(true);
    if (result.ok) expect((result.value as PoolCalculationInput).participation.mode).toBe("WEIGHTS");
  });

  it("aceita pool por percentuais contratuais conciliados sem pesos", () => {
    const raw = set(poolInput(), ["participation"], {
      mode: "CONTRACTUAL_PERCENTAGES",
      subjectParticipantId: "u-101",
      participants: [
        { participantId: "u-101", share: "0.025" },
        { participantId: "outros", share: "0.975" },
      ],
    });
    expect(validateCalculationInput(raw).ok).toBe(true);
  });

  it("recusa modelo desconhecido ou ausente", () => {
    expect(issuesOf(set(individualInput(), ["model"], "HYBRID"))).toContainEqual({ path: "model", code: "INVALID_VALUE" });
    expect(issuesOf(set(individualInput(), ["model"], undefined))).toContainEqual({ path: "model", code: "REQUIRED" });
  });

  it("exige campos de pool apenas no pool", () => {
    const issues = issuesOf(set(poolInput(), ["lossPolicy"], undefined));
    expect(issues).toContainEqual({ path: "lossPolicy", code: "REQUIRED" });
    expect(issuesOf(set(individualInput(), ["unit"], undefined))).toContainEqual({ path: "unit", code: "REQUIRED" });
  });

  it("recusa campos que não pertencem ao modelo", () => {
    const raw = { ...individualInput(), lossPolicy: "ABSORBED_BY_OPERATION" };
    expect(issuesOf(raw)).toContainEqual({ path: "lossPolicy", code: "UNEXPECTED_FIELD" });
  });

  it("exige PaybackRule", () => {
    expect(issuesOf(set(individualInput(), ["paybackRule"], undefined))).toContainEqual({
      path: "paybackRule",
      code: "REQUIRED",
    });
  });
});

describe("ocupação — fração entre zero e um", () => {
  const path = ["scenarios", 0, "occupancy", 0, "rate"];

  it.each(["0", "1", "0.5", "1.000", "0.123456789012"])("aceita %j", (rate) => {
    expect(issuesOf(set(individualInput(), path, rate))).toEqual([]);
  });

  it.each(["1.01", "1.0000000001", "-0.1", "2"])("recusa ocupação fora da faixa %j", (rate) => {
    expect(issuesOf(set(individualInput(), path, rate))).toContainEqual({
      path: "scenarios.0.occupancy.0.rate",
      code: "OUT_OF_RANGE",
    });
  });

  it("recusa texto inválido, número e ausência com motivos distintos", () => {
    const at = "scenarios.0.occupancy.0.rate";
    expect(issuesOf(set(individualInput(), path, "abc"))).toContainEqual({ path: at, code: "INVALID_FORMAT" });
    expect(issuesOf(set(individualInput(), path, "75%"))).toContainEqual({ path: at, code: "INVALID_FORMAT" });
    expect(issuesOf(set(individualInput(), path, 0.5))).toContainEqual({ path: at, code: "INVALID_FORMAT" });
    expect(issuesOf(set(individualInput(), path, undefined))).toContainEqual({ path: at, code: "REQUIRED" });
  });

  it("recusa ocupação de período inexistente ou duplicada", () => {
    const raw = set(individualInput(), ["scenarios", 0, "occupancy", 1, "periodId"], "p1");
    expect(issuesOf(raw)).toContainEqual({ path: "scenarios.0.occupancy.1.periodId", code: "DUPLICATE" });
    const ghost = set(individualInput(), ["scenarios", 0, "occupancy", 1, "periodId"], "pX");
    expect(issuesOf(ghost)).toContainEqual({ path: "scenarios.0.occupancy.1.periodId", code: "UNKNOWN_REFERENCE" });
  });
});

describe("PaybackRule — meses descontados", () => {
  it("aceita SIMPLE e DEDUCTED_MONTHS com inteiro positivo", () => {
    expect(validatePaybackRule({ kind: "SIMPLE" })).toEqual({ ok: true, value: { kind: "SIMPLE" } });
    expect(validatePaybackRule({ kind: "DEDUCTED_MONTHS", months: 24 })).toEqual({
      ok: true,
      value: { kind: "DEDUCTED_MONTHS", months: 24 },
    });
  });

  it.each<[unknown, IssueCode]>([
    [1.5, "NOT_INTEGER"],
    [0, "NOT_POSITIVE"],
    [-24, "NOT_POSITIVE"],
    ["24", "INVALID_FORMAT"],
    [Number.NaN, "INVALID_FORMAT"],
    [Number.POSITIVE_INFINITY, "INVALID_FORMAT"],
    [undefined, "REQUIRED"],
  ])("recusa meses %j com %s", (months, code) => {
    const result = validatePaybackRule({ kind: "DEDUCTED_MONTHS", months });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues).toContainEqual({ path: ["months"], code });
  });

  it("recusa tipo de regra desconhecido", () => {
    const result = validatePaybackRule({ kind: "DISCOUNTED" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues).toContainEqual({ path: ["kind"], code: "INVALID_VALUE" });
  });
});

describe("zero, ausência e valor inválido são distintos", () => {
  const costPath = ["investment", "acquisitionCosts", 0, "amount"];
  const at = "investment.acquisitionCosts.0.amount";

  it("zero explícito é um valor conhecido", () => {
    const result = validateCalculationInput(set(individualInput(), costPath, "0.00"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.investment.acquisitionCosts[0]?.amount).toBe("0.00");
  });

  it("ausência declarada (null) é preservada como pendência, não como zero", () => {
    const result = validateCalculationInput(set(individualInput(), costPath, null));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.investment.acquisitionCosts[0]?.amount).toBeNull();
      expect(result.value.investment.acquisitionCosts[1]?.amount).toBeNull();
    }
  });

  it("valor inválido é recusado e campo omitido é obrigatório", () => {
    expect(issuesOf(set(individualInput(), costPath, "abc"))).toContainEqual({ path: at, code: "INVALID_FORMAT" });
    expect(issuesOf(set(individualInput(), costPath, "10.005"))).toContainEqual({ path: at, code: "INVALID_FORMAT" });
    expect(issuesOf(set(individualInput(), costPath, 0))).toContainEqual({ path: at, code: "INVALID_FORMAT" });
    expect(issuesOf(set(individualInput(), costPath, undefined))).toContainEqual({ path: at, code: "REQUIRED" });
  });

  it("custo fixo pendente (null) permanece distinto de custo zero", () => {
    const result = validateCalculationInput(individualInput());
    expect(result.ok).toBe(true);
    if (result.ok) {
      const pending = result.value.costs.find((cost) => cost.id === "c3");
      expect(pending).toMatchObject({ kind: "FIXED", amount: null });
    }
  });

  it("tarifa zero é aceita; tarifa nula não é", () => {
    const path = ["tariffs", 1, "dailyRate"];
    expect(issuesOf(set(individualInput(), path, "0.00"))).toEqual([]);
    expect(issuesOf(set(individualInput(), path, null))).toContainEqual({ path: "tariffs.1.dailyRate", code: "INVALID_FORMAT" });
  });

  it("peso desconhecido no pool não vira zero", () => {
    const raw = set(poolInput(), ["participation", "participants", 1, "weight"], null);
    expect(issuesOf(raw)).toContainEqual({ path: "participation.participants.1.weight", code: "UNKNOWN_WEIGHT" });
    const zero = set(poolInput(), ["participation", "participants", 1, "weight"], "0");
    expect(issuesOf(zero)).toContainEqual({ path: "participation.participants.1.weight", code: "NOT_POSITIVE" });
  });

  it("preço negociado ausente é aceito para gerar indisponibilidade; negativo é recusado", () => {
    expect(validateCalculationInput(set(individualInput(), ["investment", "negotiatedPrice"], null)).ok).toBe(true);
    expect(issuesOf(set(individualInput(), ["investment", "negotiatedPrice"], "-1.00"))).toContainEqual({
      path: "investment.negotiatedPrice",
      code: "INVALID_FORMAT",
    });
  });
});

describe("participação contratual e custos", () => {
  it("recusa percentuais que não conciliam com o total", () => {
    const raw = set(poolInput(), ["participation"], {
      mode: "CONTRACTUAL_PERCENTAGES",
      subjectParticipantId: "u-101",
      participants: [
        { participantId: "u-101", share: "0.025" },
        { participantId: "outros", share: "0.97" },
      ],
    });
    expect(issuesOf(raw)).toContainEqual({ path: "participation.participants", code: "NOT_RECONCILED" });
  });

  it("recusa participante-alvo inexistente e base de pesos desconhecida", () => {
    const raw = set(poolInput(), ["participation", "subjectParticipantId"], "u-999");
    expect(issuesOf(raw)).toContainEqual({ path: "participation.subjectParticipantId", code: "UNKNOWN_REFERENCE" });
    const basis = set(poolInput(), ["participation", "basis"], "PRICE");
    expect(issuesOf(basis)).toContainEqual({ path: "participation.basis", code: "INVALID_VALUE" });
  });

  it("recusa custos percentuais sobre saldo com ordem repetida ou inválida", () => {
    const raw = individualInput();
    (raw.costs as unknown[]).push(
      { id: "c4", name: "Gestão", kind: "PERCENTAGE", rate: "0.1", base: "POSITIVE_BALANCE_AFTER_OPERATING_COSTS", order: 2, periodIds: ["p1"] },
      { id: "c5", name: "Outro", kind: "PERCENTAGE", rate: "0.1", base: "POSITIVE_BALANCE_AFTER_OPERATING_COSTS", order: 2, periodIds: ["p1"] },
    );
    expect(issuesOf(raw)).toContainEqual({ path: "costs.4.order", code: "DUPLICATE" });
    const zero = set(individualInput(), ["costs", 1, "order"], 0);
    expect(issuesOf(zero)).toContainEqual({ path: "costs.1.order", code: "NOT_POSITIVE" });
    const badBase = set(individualInput(), ["costs", 1, "base"], "NET_REVENUE");
    expect(issuesOf(badBase)).toContainEqual({ path: "costs.1.base", code: "INVALID_VALUE" });
  });
});

describe("calendário — datas civis e períodos", () => {
  it("valida datas gregorianas existentes", () => {
    expect(validateCivilDate("2024-02-29")).toEqual({ ok: true, value: "2024-02-29" });
    for (const text of ["2027-02-29", "2026-13-01", "2026-04-31", "26-01-01", "2026-1-1", "2026-01-01T00:00:00Z"]) {
      const result = validateCivilDate(text);
      expect(result.ok, text).toBe(false);
    }
  });

  it("recusa períodos sobrepostos ou invertidos", () => {
    const overlap = set(individualInput(), ["calendar", "periods", 1, "start"], "2026-03-15");
    expect(issuesOf(overlap)).toContainEqual({ path: "calendar.periods.1", code: "OVERLAP" });
    const inverted = set(individualInput(), ["calendar", "periods", 0, "end"], "2025-12-31");
    expect(issuesOf(inverted)).toContainEqual({ path: "calendar.periods.0.end", code: "OUT_OF_RANGE" });
  });

  it("recusa período fora do ano-base e temporada inexistente", () => {
    const outside = set(individualInput(), ["calendar", "periods", 2, "end"], "2027-01-05");
    expect(issuesOf(outside)).toContainEqual({ path: "calendar.periods.2.end", code: "OUT_OF_RANGE" });
    const season = set(individualInput(), ["calendar", "periods", 0, "seasonId"], "mid");
    expect(issuesOf(season)).toContainEqual({ path: "calendar.periods.0.seasonId", code: "UNKNOWN_REFERENCE" });
  });

  it("recusa dia de final de semana fora de 1–7", () => {
    const raw = set(individualInput(), ["calendar", "weekendDays", 0], 0);
    expect(issuesOf(raw)).toContainEqual({ path: "calendar.weekendDays.0", code: "OUT_OF_RANGE" });
  });

  it("recusa horizonte com período desconhecido ou vazio", () => {
    expect(issuesOf(set(individualInput(), ["horizon", "includedPeriodIds"], ["p9"]))).toContainEqual({
      path: "horizon.includedPeriodIds.0",
      code: "UNKNOWN_REFERENCE",
    });
    expect(issuesOf(set(individualInput(), ["horizon", "includedPeriodIds"], []))).toContainEqual({
      path: "horizon.includedPeriodIds",
      code: "REQUIRED",
    });
  });
});
