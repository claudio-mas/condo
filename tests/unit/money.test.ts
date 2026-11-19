import { describe, expect, it } from "vitest";
import { DomainError, type Result } from "@/domain/errors";
import {
  decimal,
  formatDecimalBr,
  isDecimalText,
  isMoneyText,
  parseBrDecimal,
  parseBrMoney,
  roundMoney,
  roundMonths,
  roundReturnPercent,
} from "@/domain/money";

function expectIssue(result: Result<string>, code: string) {
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.error).toBeInstanceOf(DomainError);
    expect(result.error.issues.map((issue) => issue.code)).toContain(code);
  }
}

describe("parseBrMoney — entrada pt-BR para texto decimal canônico", () => {
  it.each([
    ["1.234,56", "1234.56"],
    ["1234,56", "1234.56"],
    ["1234,5", "1234.50"],
    ["1234", "1234.00"],
    ["0,30", "0.30"],
    ["0", "0.00"],
    ["1.234.567,89", "1234567.89"],
    ["1.234.567", "1234567.00"],
    ["  12,00  ", "12.00"],
  ])("%j vira %j", (input, expected) => {
    expect(parseBrMoney(input)).toEqual({ ok: true, value: expected });
  });

  it.each([
    [""],
    ["   "],
    ["abc"],
    ["12,"],
    [",5"],
    ["1,2,3"],
    ["1.23,45"],
    ["1.2345,00"],
    ["1.234.56"],
    ["1 234,56"],
    ["01,00"],
    ["1e3"],
    ["R$ 10,00"],
    ["--1"],
    ["+1"],
    ["Infinity"],
    ["NaN"],
  ])("recusa texto inválido %j", (input) => {
    expectIssue(parseBrMoney(input), "INVALID_FORMAT");
  });

  it.each([["1234.56"], ["12.5"], ["1,234.56"], ["1.234"]])(
    "recusa texto ambíguo %j",
    (input) => {
      expectIssue(parseBrMoney(input), "AMBIGUOUS");
    },
  );

  it("recusa mais de duas casas em moeda", () => {
    expectIssue(parseBrMoney("1,234"), "TOO_MANY_DECIMALS");
  });

  it("recusa moeda negativa digitada", () => {
    expectIssue(parseBrMoney("-1,00"), "OUT_OF_RANGE");
  });

  it("recusa valores que não são texto (dinheiro nunca é number)", () => {
    expectIssue(parseBrMoney(1234.56 as unknown as string), "INVALID_FORMAT");
    expectIssue(parseBrMoney(null as unknown as string), "INVALID_FORMAT");
  });
});

describe("parseBrDecimal — decimal genérico pt-BR", () => {
  it("normaliza separadores e remove zeros à direita", () => {
    expect(parseBrDecimal("1.234,56")).toEqual({ ok: true, value: "1234.56" });
    expect(parseBrDecimal("1.234,50")).toEqual({ ok: true, value: "1234.5" });
    expect(parseBrDecimal("1,234")).toEqual({ ok: true, value: "1.234" });
    expect(parseBrDecimal("-0,5")).toEqual({ ok: true, value: "-0.5" });
    expect(parseBrDecimal("0,000")).toEqual({ ok: true, value: "0" });
    expect(parseBrDecimal("-0,0")).toEqual({ ok: true, value: "0" });
  });

  it("recusa texto inválido ou ambíguo", () => {
    expectIssue(parseBrDecimal("1.234"), "AMBIGUOUS");
    expectIssue(parseBrDecimal("12.5"), "AMBIGUOUS");
    expectIssue(parseBrDecimal("x"), "INVALID_FORMAT");
  });
});

describe("decimal — precisão e entrada controlada", () => {
  it("usa 40 dígitos significativos", () => {
    const third = decimal("1").div(decimal("3"));
    expect(third.toString()).toBe("0." + "3".repeat(40));
  });

  it("aceita somente texto decimal canônico", () => {
    expect(() => decimal(0.1 as unknown as string)).toThrow(DomainError);
    expect(() => decimal("1,5")).toThrow(DomainError);
    expect(() => decimal("1e3")).toThrow(DomainError);
    expect(decimal("-12.50").toString()).toBe("-12.5");
  });

  it("identifica textos canônicos", () => {
    expect(isDecimalText("1234.56")).toBe(true);
    expect(isDecimalText("-0.5")).toBe(true);
    expect(isDecimalText("01.5")).toBe(false);
    expect(isDecimalText("1.")).toBe(false);
    expect(isMoneyText("1234.56")).toBe(true);
    expect(isMoneyText("1234.5")).toBe(false);
    expect(isMoneyText("-1.00")).toBe(false);
  });
});

describe("apresentação com a política aprovada", () => {
  it("0.1 + 0.2 apresenta 0.30 (sem ponto flutuante)", () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(roundMoney(decimal("0.1").plus(decimal("0.2")))).toBe("0.30");
  });

  it("1.005 apresenta 1.01 (ROUND_HALF_UP)", () => {
    expect((1.005).toFixed(2)).toBe("1.00");
    expect(roundMoney(decimal("1.005"))).toBe("1.01");
    expect(roundMoney("1.005")).toBe("1.01");
  });

  it("arredonda moeda em duas casas, metade para longe de zero", () => {
    expect(roundMoney("2.345")).toBe("2.35");
    expect(roundMoney("2.344999")).toBe("2.34");
    expect(roundMoney("-1.005")).toBe("-1.01");
    expect(roundMoney("-0.001")).toBe("0.00");
    expect(roundMoney("10")).toBe("10.00");
  });

  it("retorno em percentual com quatro casas", () => {
    expect(roundReturnPercent("0.123456789")).toBe("12.3457");
    expect(roundReturnPercent("0.1")).toBe("10.0000");
    expect(roundReturnPercent("0.0000005")).toBe("0.0001");
  });

  it("prazo em meses com duas casas", () => {
    expect(roundMonths("25.666")).toBe("25.67");
    expect(roundMonths("24")).toBe("24.00");
  });

  it("formata números no padrão pt-BR sem textos de interface", () => {
    expect(formatDecimalBr("1234567.89")).toBe("1.234.567,89");
    expect(formatDecimalBr("0.30")).toBe("0,30");
    expect(formatDecimalBr("-1234.5")).toBe("-1.234,5");
    expect(formatDecimalBr("999")).toBe("999");
    expect(formatDecimalBr("12.3457")).toBe("12,3457");
  });
});
