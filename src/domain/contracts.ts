/**
 * Contratos compartilhados do domínio (entradas, regras e resultados).
 *
 * - Dinheiro e decimais trafegam como texto canônico, nunca como `number`.
 * - Taxas e ocupações são frações entre 0 e 1 (texto decimal).
 * - `null` indica ausência declarada (pendência); é distinto de zero.
 * - Inteiros de contagem (ano, meses descontados, ordem, unidades) usam `number`.
 */

declare const brand: unique symbol;
/** Marcas acumuláveis: `MoneyText` também é `DecimalText`. */
type Brand<T, B extends string> = T & { readonly [brand]: { readonly [K in B]: true } };

/** Decimal canônico: `-?(0|[1-9]\d*)(\.\d+)?`, ponto como separador, sem expoente. */
export type DecimalText = Brand<string, "DecimalText">;
/** Moeda BRL não negativa com exatamente duas casas (`1234.56`). */
export type MoneyText = DecimalText & Brand<string, "MoneyText">;
/** Fração entre 0 e 1 inclusive, até 12 casas (`0.75`). */
export type RateText = DecimalText & Brand<string, "RateText">;
/** Data civil gregoriana existente, `YYYY-MM-DD`. */
export type CivilDate = Brand<string, "CivilDate">;

export type Currency = "BRL";

/* ------------------------------------------------------------------ */
/* Calendário, horizonte e cenários                                    */
/* ------------------------------------------------------------------ */

/** Dia da semana ISO-8601: 1 = segunda … 7 = domingo. */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Precedência: SPECIAL > HOLIDAY > WEEKEND > WEEKDAY. */
export type DayCategory = "SPECIAL" | "HOLIDAY" | "WEEKEND" | "WEEKDAY";
export const DAY_CATEGORIES = ["SPECIAL", "HOLIDAY", "WEEKEND", "WEEKDAY"] as const;

export interface Season {
  readonly id: string;
  readonly name: string;
}

/** Período de operação do ano-base (datas inclusivas) associado a uma temporada. */
export interface Period {
  readonly id: string;
  readonly start: CivilDate;
  readonly end: CivilDate;
  readonly seasonId: string;
}

export interface CalendarInput {
  readonly baseYear: number;
  readonly weekendDays: readonly IsoWeekday[];
  readonly holidays: readonly CivilDate[];
  readonly specialDates: readonly CivilDate[];
  readonly seasons: readonly Season[];
  readonly periods: readonly Period[];
}

/** Períodos incluídos na simulação; o padrão é o ano-base completo. */
export interface HorizonInput {
  readonly includedPeriodIds: readonly string[];
}

export type ScenarioKey = "OPTIMISTIC" | "REALISTIC" | "PESSIMISTIC" | "CUSTOM";
export const SCENARIO_KEYS = ["OPTIMISTIC", "REALISTIC", "PESSIMISTIC", "CUSTOM"] as const;

export interface PeriodOccupancy {
  readonly periodId: string;
  readonly rate: RateText;
}

export interface Scenario {
  readonly key: ScenarioKey;
  readonly occupancy: readonly PeriodOccupancy[];
}

/* ------------------------------------------------------------------ */
/* Tarifas e custos                                                    */
/* ------------------------------------------------------------------ */

export interface Tariff {
  readonly categoryId: string;
  readonly seasonId: string;
  readonly dayCategory: DayCategory;
  readonly dailyRate: MoneyText;
}

/** Bases suportadas para custos percentuais. */
export type CostBase = "GROSS_REVENUE" | "POSITIVE_BALANCE_AFTER_OPERATING_COSTS";
export const COST_BASES = ["GROSS_REVENUE", "POSITIVE_BALANCE_AFTER_OPERATING_COSTS"] as const;

/** Custo fixo aplicado em cada período de vigência; `amount: null` = pendência. */
export interface FixedCost {
  readonly id: string;
  readonly name: string;
  readonly kind: "FIXED";
  readonly amount: MoneyText | null;
  readonly periodIds: readonly string[];
}

/** Custo percentual com base e ordem explícitas; `rate: null` = pendência. */
export interface PercentageCost {
  readonly id: string;
  readonly name: string;
  readonly kind: "PERCENTAGE";
  readonly rate: RateText | null;
  readonly base: CostBase;
  /** Ordem de aplicação (inteiro positivo, única entre custos sobre saldo). */
  readonly order: number;
  readonly periodIds: readonly string[];
}

export type Cost = FixedCost | PercentageCost;

/* ------------------------------------------------------------------ */
/* Investimento e payback                                              */
/* ------------------------------------------------------------------ */

export interface AcquisitionCost {
  readonly id: string;
  readonly name: string;
  /** `null` = custo conhecido mas ainda não informado (distinto de zero). */
  readonly amount: MoneyText | null;
}

export interface InvestmentInput {
  /** `null` = investimento ausente: indicadores dependentes ficam indisponíveis. */
  readonly negotiatedPrice: MoneyText | null;
  readonly acquisitionCosts: readonly AcquisitionCost[];
}

export type PaybackRule =
  | { readonly kind: "SIMPLE" }
  | { readonly kind: "DEDUCTED_MONTHS"; readonly months: number };

export type UnavailableReason =
  | "PARTIAL_YEAR"
  | "NON_POSITIVE_RESULT"
  | "INVALID_INVESTMENT"
  | "RECOVERED_WITHIN_DEDUCTION";
export const UNAVAILABLE_REASONS = [
  "PARTIAL_YEAR",
  "NON_POSITIVE_RESULT",
  "INVALID_INVESTMENT",
  "RECOVERED_WITHIN_DEDUCTION",
] as const;

export type MetricUnavailable =
  | { readonly status: "UNAVAILABLE"; readonly reason: "PARTIAL_YEAR" | "NON_POSITIVE_RESULT" | "INVALID_INVESTMENT" }
  | { readonly status: "UNAVAILABLE"; readonly reason: "RECOVERED_WITHIN_DEDUCTION"; readonly deductedMonths: number };

/** Indicador disponível (valor com precisão interna) ou motivo de indisponibilidade. */
export type Metric<T extends DecimalText = DecimalText> =
  | { readonly status: "AVAILABLE"; readonly value: T }
  | MetricUnavailable;

/* ------------------------------------------------------------------ */
/* Participação no pool                                                */
/* ------------------------------------------------------------------ */

export type ParticipationBasis = "LIST_PRICE" | "AREA" | "IDEAL_FRACTION" | "MANUAL";
export const PARTICIPATION_BASES = ["LIST_PRICE", "AREA", "IDEAL_FRACTION", "MANUAL"] as const;

export interface ContractualShare {
  readonly participantId: string;
  readonly share: RateText;
}

export interface WeightedParticipant {
  readonly participantId: string;
  /** Peso publicado (> 0). Peso desconhecido é recusado, nunca convertido em zero. */
  readonly weight: DecimalText;
}

/**
 * Percentuais contratuais conciliados (soma exatamente 1, incluindo a parcela
 * de outros participantes) ou pesos relativos sobre todo o conjunto elegível.
 */
export type Participation =
  | {
      readonly mode: "CONTRACTUAL_PERCENTAGES";
      readonly subjectParticipantId: string;
      readonly participants: readonly ContractualShare[];
    }
  | {
      readonly mode: "WEIGHTS";
      readonly basis: ParticipationBasis;
      readonly subjectParticipantId: string;
      readonly participants: readonly WeightedParticipant[];
    };

export type LossPolicy = "PROPORTIONAL_PASS_THROUGH" | "ABSORBED_BY_OPERATION";
export const LOSS_POLICIES = ["PROPORTIONAL_PASS_THROUGH", "ABSORBED_BY_OPERATION"] as const;

export interface InventoryItem {
  readonly categoryId: string;
  readonly units: number;
}

/** Retenção explícita sobre o resultado da operação antes da distribuição. */
export interface Retention {
  readonly id: string;
  readonly name: string;
  readonly rate: RateText;
}

export interface InvestorCost {
  readonly id: string;
  readonly name: string;
  readonly amount: MoneyText | null;
  readonly periodIds: readonly string[];
}

/* ------------------------------------------------------------------ */
/* Entrada de cálculo                                                  */
/* ------------------------------------------------------------------ */

export type CalculationModel = "INDIVIDUAL" | "POOL";

interface CalculationInputBase {
  /** Versão das regras/premissas utilizadas. */
  readonly rulesVersion: string;
  readonly calendar: CalendarInput;
  readonly horizon: HorizonInput;
  readonly scenarios: readonly Scenario[];
  readonly tariffs: readonly Tariff[];
  readonly costs: readonly Cost[];
  readonly investment: InvestmentInput;
  readonly paybackRule: PaybackRule;
}

export interface IndividualCalculationInput extends CalculationInputBase {
  readonly model: "INDIVIDUAL";
  readonly unit: { readonly unitId: string; readonly categoryId: string };
  /** Datas sem noites disponíveis (não alteram a duração do ano-base). */
  readonly unavailableDates: readonly CivilDate[];
}

export interface PoolCalculationInput extends CalculationInputBase {
  readonly model: "POOL";
  readonly inventory: readonly InventoryItem[];
  readonly participation: Participation;
  readonly lossPolicy: LossPolicy;
  readonly retentions: readonly Retention[];
  readonly investorCosts: readonly InvestorCost[];
}

export type CalculationInput = IndividualCalculationInput | PoolCalculationInput;

/* ------------------------------------------------------------------ */
/* Resultado de cálculo                                                */
/* ------------------------------------------------------------------ */

export interface HorizonResult {
  readonly periodIds: readonly string[];
  readonly start: CivilDate;
  readonly end: CivilDate;
  readonly days: number;
  /** Verdadeiro somente quando o horizonte cobre o ano-base completo. */
  readonly fullYear: boolean;
}

export interface ExpenseLine {
  readonly costId: string;
  readonly kind: Cost["kind"];
  readonly amount: DecimalText;
}

export interface PeriodResult {
  readonly periodId: string;
  readonly nights: number;
  readonly grossRevenue: DecimalText;
  readonly expenses: readonly ExpenseLine[];
  readonly operatingResult: DecimalText;
}

export interface ParticipationResult {
  readonly mode: Participation["mode"];
  readonly share: DecimalText;
  readonly retentions: DecimalText;
  readonly distributable: DecimalText;
  readonly unitShare: DecimalText;
  /** Déficit absorvido pela operação (`ABSORBED_BY_OPERATION`), demonstrado à parte. */
  readonly absorbedDeficit: DecimalText;
  readonly investorCosts: DecimalText;
}

export interface InvestmentResult {
  readonly negotiatedPrice: MoneyText | null;
  readonly acquisitionCosts: DecimalText;
  readonly total: DecimalText | null;
  readonly pendingAcquisitionCostIds: readonly string[];
}

export interface ScenarioResult {
  readonly scenario: ScenarioKey;
  readonly periods: readonly PeriodResult[];
  readonly totals: {
    readonly grossRevenue: DecimalText;
    readonly expenses: DecimalText;
    readonly operatingResult: DecimalText;
    readonly investorResult: DecimalText;
  };
  readonly expenses: readonly ExpenseLine[];
  /** Presente somente no pool. */
  readonly participation: ParticipationResult | null;
  readonly annualReturn: Metric;
  readonly monthlyAverageReturn: Metric;
  readonly payback: {
    readonly rule: PaybackRule;
    readonly chosen: Metric;
    readonly simple: Metric;
  };
}

export type WarningCode =
  | "PARTIAL_HORIZON"
  | "PENDING_COST"
  | "PENDING_ACQUISITION_COST"
  | "PENDING_INVESTOR_COST";

export interface CalculationWarning {
  readonly code: WarningCode;
  readonly ref: string | null;
}

export interface CalculationResult {
  readonly engineVersion: string;
  readonly model: CalculationModel;
  readonly rulesVersion: string;
  readonly horizon: HorizonResult;
  readonly investment: InvestmentResult;
  readonly scenarios: readonly ScenarioResult[];
  readonly warnings: readonly CalculationWarning[];
}
