import Decimal from "decimal.js";
import type { DecimalText, MoneyText, RateText } from "./contracts";
import { type FieldIssue, type IssueCode, type Result, fail, inputInvalid, ok } from "./errors";

/**
 * Precisão monetária do domínio.
 *
 * - Cálculo interno: decimal.js com 40 dígitos significativos.
 * - Moeda: 2 casas, ROUND_HALF_UP.
 * - Retorno: percentual com 4 casas.
 * - Prazo: 2 casas (a unidade "meses" vem do catálogo de mensagens).
 *
 * Nenhuma função aceita `number` como valor monetário.
 */
export const Dec = Decimal.clone({
  precision: 40,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -9e15,
  toExpPos: 9e15,
});
export type Dec = Decimal;

export const MONEY_DECIMALS = 2;
export const RETURN_PERCENT_DECIMALS = 4;
export const MONTHS_DECIMALS = 2;
export const MONEY_MAX_INTEGER_DIGITS = 16;
export const DECIMAL_MAX_INTEGER_DIGITS = 18;
export const DECIMAL_MAX_FRACTION_DIGITS = 12;

const DECIMAL_TEXT = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;
const MONEY_TEXT = new RegExp(`^(0|[1-9][0-9]{0,${MONEY_MAX_INTEGER_DIGITS - 1}})\\.[0-9]{2}$`);

export function isDecimalText(value: unknown): value is DecimalText {
  return typeof value === "string" && DECIMAL_TEXT.test(value);
}

export function isMoneyText(value: unknown): value is MoneyText {
  return typeof value === "string" && MONEY_TEXT.test(value);
}

/** Fração canônica entre 0 e 1 inclusive, com até 12 casas. */
export function isRateText(value: unknown): value is RateText {
  if (!isDecimalText(value)) return false;
  const fraction = value.split(".")[1] ?? "";
  if (fraction.length > DECIMAL_MAX_FRACTION_DIGITS) return false;
  const d = new Dec(value);
  return d.gte(0) && d.lte(1);
}

function invalid(code: IssueCode): Result<never> {
  const issue: FieldIssue = { path: [], code };
  return fail(inputInvalid([issue]));
}

/** Constrói um decimal somente a partir de texto canônico (ou de outro decimal). */
export function decimal(value: DecimalText | string | Dec): Dec {
  if (value instanceof Dec) return value;
  if (!isDecimalText(value)) throw inputInvalid([{ path: [], code: "INVALID_FORMAT" }]);
  return new Dec(value);
}

function noNegativeZero(text: string): string {
  return /^-0(\.0+)?$/.test(text) ? text.slice(1) : text;
}

/** Texto canônico mínimo (sem zeros à direita, sem expoente, sem `-0`). */
export function toDecimalText(value: Dec | DecimalText | string): DecimalText {
  return noNegativeZero(decimal(value).toFixed()) as DecimalText;
}

function fixed(value: Dec | DecimalText | string, places: number): DecimalText {
  return noNegativeZero(decimal(value).toFixed(places, Decimal.ROUND_HALF_UP)) as DecimalText;
}

/** Moeda apresentada: duas casas, ROUND_HALF_UP (metade para longe de zero). */
export function roundMoney(value: Dec | DecimalText | string): DecimalText {
  return fixed(value, MONEY_DECIMALS);
}

/** Retorno apresentado: fração convertida em percentual com quatro casas. */
export function roundReturnPercent(fraction: Dec | DecimalText | string): DecimalText {
  return fixed(decimal(fraction).times(100), RETURN_PERCENT_DECIMALS);
}

/** Prazo apresentado em meses com duas casas. */
export function roundMonths(value: Dec | DecimalText | string): DecimalText {
  return fixed(value, MONTHS_DECIMALS);
}

/* ------------------------------------------------------------------ */
/* Entrada pt-BR                                                       */
/* ------------------------------------------------------------------ */

// "1234" | "1234,56"
const BR_PLAIN = /^(-?)(0|[1-9][0-9]*)(?:,([0-9]+))?$/;
// "1.234" | "1.234.567,89"
const BR_GROUPED = /^(-?)([1-9][0-9]{0,2}(?:\.[0-9]{3})+)(?:,([0-9]+))?$/;
// Formatos com ponto decimal (en-US ou canônico) não são aceitos como entrada pt-BR.
const DOT_DECIMAL = /^-?[0-9]+\.[0-9]+$/;
const US_GROUPED = /^-?[0-9]{1,3}(?:,[0-9]{3})+\.[0-9]+$/;

interface ParsedNumber {
  readonly negative: boolean;
  readonly integer: string;
  readonly fraction: string;
}

function parseBrNumber(input: unknown): Result<ParsedNumber> {
  if (typeof input !== "string") return invalid("INVALID_FORMAT");
  const text = input.trim();
  if (text === "") return invalid("INVALID_FORMAT");

  const grouped = BR_GROUPED.exec(text);
  if (grouped) {
    const [, sign = "", integer = "", fraction] = grouped;
    // "1.234" sem vírgula pode ser lido como 1,234 (en-US) ou 1234 (pt-BR).
    if (fraction === undefined && integer.split(".").length === 2) return invalid("AMBIGUOUS");
    return ok({ negative: sign === "-", integer: integer.replaceAll(".", ""), fraction: fraction ?? "" });
  }

  const plain = BR_PLAIN.exec(text);
  if (plain) {
    const [, sign = "", integer = "", fraction] = plain;
    return ok({ negative: sign === "-", integer, fraction: fraction ?? "" });
  }

  if (DOT_DECIMAL.test(text) || US_GROUPED.test(text)) return invalid("AMBIGUOUS");
  return invalid("INVALID_FORMAT");
}

/** Decimal genérico em pt-BR → texto canônico mínimo. */
export function parseBrDecimal(input: string): Result<DecimalText> {
  const parsed = parseBrNumber(input);
  if (!parsed.ok) return parsed;
  const { negative, integer, fraction } = parsed.value;
  if (integer.length > DECIMAL_MAX_INTEGER_DIGITS) return invalid("OUT_OF_RANGE");
  if (fraction.length > DECIMAL_MAX_FRACTION_DIGITS) return invalid("TOO_MANY_DECIMALS");
  const trimmed = fraction.replace(/0+$/, "");
  const body = trimmed ? `${integer}.${trimmed}` : integer;
  return ok(noNegativeZero(`${negative ? "-" : ""}${body}`) as DecimalText);
}

/** Valor monetário em pt-BR (BRL, não negativo, até duas casas) → `MoneyText`. */
export function parseBrMoney(input: string): Result<MoneyText> {
  const parsed = parseBrNumber(input);
  if (!parsed.ok) return parsed;
  const { negative, integer, fraction } = parsed.value;
  if (fraction.length > MONEY_DECIMALS) return invalid("TOO_MANY_DECIMALS");
  if (integer.length > MONEY_MAX_INTEGER_DIGITS) return invalid("OUT_OF_RANGE");
  const isZero = /^0+$/.test(integer) && /^0*$/.test(fraction);
  if (negative && !isZero) return invalid("OUT_OF_RANGE");
  return ok(`${integer}.${fraction.padEnd(MONEY_DECIMALS, "0")}` as MoneyText);
}

/* ------------------------------------------------------------------ */
/* Formatação numérica pt-BR (sem textos de interface)                 */
/* ------------------------------------------------------------------ */

/** Agrupa milhares com ponto e usa vírgula decimal, preservando as casas do texto. */
export function formatDecimalBr(value: DecimalText | string): string {
  if (!isDecimalText(value)) throw inputInvalid([{ path: [], code: "INVALID_FORMAT" }]);
  const negative = value.startsWith("-");
  const [integer = "", fraction] = (negative ? value.slice(1) : value).split(".");
  const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}${groupedInteger}${fraction === undefined ? "" : `,${fraction}`}`;
}
