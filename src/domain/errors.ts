/**
 * Erros de domínio. Devolvem códigos estáveis e caminhos de campo; os textos
 * apresentados ao usuário vêm do catálogo de mensagens (src/i18n), nunca daqui.
 */

export type IssueCode =
  | "REQUIRED"
  | "INVALID_FORMAT"
  | "INVALID_VALUE"
  | "AMBIGUOUS"
  | "TOO_MANY_DECIMALS"
  | "OUT_OF_RANGE"
  | "NOT_INTEGER"
  | "NOT_POSITIVE"
  | "INVALID_DATE"
  | "OVERLAP"
  | "DUPLICATE"
  | "UNKNOWN_REFERENCE"
  | "NOT_RECONCILED"
  | "UNKNOWN_WEIGHT"
  | "UNEXPECTED_FIELD"
  | "MISSING_TARIFF";

export const ISSUE_CODES: readonly IssueCode[] = [
  "REQUIRED",
  "INVALID_FORMAT",
  "INVALID_VALUE",
  "AMBIGUOUS",
  "TOO_MANY_DECIMALS",
  "OUT_OF_RANGE",
  "NOT_INTEGER",
  "NOT_POSITIVE",
  "INVALID_DATE",
  "OVERLAP",
  "DUPLICATE",
  "UNKNOWN_REFERENCE",
  "NOT_RECONCILED",
  "UNKNOWN_WEIGHT",
  "UNEXPECTED_FIELD",
  "MISSING_TARIFF",
];

export type FieldPath = readonly (string | number)[];

export interface FieldIssue {
  readonly path: FieldPath;
  readonly code: IssueCode;
  /** Identificadores que localizam a pendência (ex.: categoria, temporada e tipo de dia). */
  readonly params?: Readonly<Record<string, string>>;
}

export type DomainErrorCode = "INPUT_INVALID";

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly issues: readonly FieldIssue[];

  constructor(code: DomainErrorCode, issues: readonly FieldIssue[]) {
    super(`${code}: ${issues.map((issue) => `${issue.path.join(".") || "<root>"}=${issue.code}`).join(", ")}`);
    this.name = "DomainError";
    this.code = code;
    this.issues = issues;
  }
}

export function inputInvalid(issues: readonly FieldIssue[]): DomainError {
  return new DomainError("INPUT_INVALID", issues);
}

export type Result<T, E = DomainError> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function fail<E = DomainError>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isIssueCode(value: unknown): value is IssueCode {
  return typeof value === "string" && (ISSUE_CODES as readonly string[]).includes(value);
}
