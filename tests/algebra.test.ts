import { describe, expect, it } from "vitest";
import { degree, equal, evaluate, factorCount, isExpanded, isFactored, isSimplified, parse, polyOf, prettyInput, toStr } from "@/lib/algebra/poly";
import { IDENTITIES } from "@/lib/content";
import { bi, checkAnswer, checkExpr } from "@/lib/content/helpers";
import type { Bi } from "@/lib/content/types";

const same = (a: string, b: string) => equal(polyOf(a), polyOf(b));

describe("đọc biểu thức", () => {
  it("nhiều cách gõ số mũ và phép nhân", () => {
    for (const s of ["x^2", "x2", "x²", "x*x", "x·x", "(x)^(2)"]) expect(toStr(polyOf(s))).toBe("x²");
    expect(toStr(polyOf("3xy"))).toBe("3xy");
    expect(toStr(polyOf("2(x+1)"))).toBe("2x + 2");
    expect(toStr(polyOf("-x^2 + 3x - 5"))).toBe("−x² + 3x − 5");
    expect(toStr(polyOf("−2x²y + 4xy³"))).toBe("4xy³ − 2x²y");
    expect(toStr(polyOf("2,5x"))).toBe("2,5x");
  });

  it("nhân, luỹ thừa, chia cho đơn thức", () => {
    expect(same("(x+2)(x-2)", "x^2-4")).toBe(true);
    expect(same("(x+y)^2", "x2 + 2xy + y2")).toBe(true);
    expect(same("(a-b)^3", "a³ − 3a²b + 3ab² − b³")).toBe(true);
    expect(same("(6x^3 - 9x^2 + 3x) : 3x", "2x^2 - 3x + 1")).toBe(true);
    expect(() => polyOf("x : y")).toThrow();
    expect(same("x - (2x - 3)", "-x + 3")).toBe(true);
  });

  it("báo lỗi khi gõ sai", () => {
    for (const s of ["", "x +", "(x+1", "x+1)", "x ^", "x @ 2"]) expect(() => parse(s)).toThrow();
  });

  it("bậc và giá trị", () => {
    expect(degree(polyOf("3x^2y^3 - x^4 + 1"))).toBe(5);
    expect(degree(polyOf("x^3 + 2x - x^3"))).toBe(1);
    expect(evaluate(polyOf("2x^2 - 3xy"), { x: -1, y: 2 })).toBe(8);
  });
});

describe("kiểm tra dạng", () => {
  it("dạng khai triển / thu gọn", () => {
    expect(isExpanded(parse("6x^2 - 10x"))).toBe(true);
    expect(isExpanded(parse("2x(3x - 5)"))).toBe(false);
    expect(isSimplified(parse("6x² − 10x"))).toBe(true);
    expect(isSimplified(parse("3x + 2x"))).toBe(false);
    expect(isSimplified(parse("x·x"))).toBe(false);
    expect(isSimplified(parse("2·3x"))).toBe(false);
    expect(isSimplified(parse("-2x^2y + 4xy^3 - 7"))).toBe(true);
  });

  it("dạng tích và phân tích triệt để", () => {
    expect(isFactored(parse("3(x+2)"))).toBe(true);
    expect(isFactored(parse("(x-1)^2"))).toBe(true);
    expect(isFactored(parse("-(x-1)(x+1)"))).toBe(true);
    expect(isFactored(parse("x^2 - 1"))).toBe(false);
    expect(isFactored(parse("2x·3"))).toBe(false);
    expect(factorCount(parse("x(x-1)(x+1)"))).toBe(3);
    expect(factorCount(parse("x(x^2-1)"))).toBe(2);
    expect(factorCount(parse("2x^2(x+3)"))).toBe(3);
    expect(factorCount(parse("(x+2)^2"))).toBe(2);
  });

  it("chấm câu gõ biểu thức: đúng giá trị nhưng sai dạng thì có lời nhắc", () => {
    const base = { id: "t", level: 2 as const, skill: "math" as const, prompt: bi("", ""), hints: [bi("", ""), bi("", ""), bi("", "")] as [Bi, Bi, Bi], explain: bi("", "") };
    const expand = { ...base, type: "expr" as const, form: "expanded" as const, answer: "x² + 6x + 8" };
    expect(checkExpr(expand, "x^2+6x+8").ok).toBe(true);
    expect(checkExpr(expand, "8 + 6x + x2").ok).toBe(true);
    expect(checkExpr(expand, "(x+2)(x+4)").note?.vi).toMatch(/phá ngoặc/);
    expect(checkExpr(expand, "x^2 + 6x + 9").ok).toBe(false);
    expect(checkExpr(expand, "x^2 +").note).toBeTruthy();
    const factor = { ...base, type: "expr" as const, form: "factored" as const, answer: "x(x − 1)(x + 1)" };
    expect(checkExpr(factor, "x(x+1)(x-1)").ok).toBe(true);
    expect(checkExpr(factor, "x(x^2-1)").note?.vi).toMatch(/phân tích tiếp/);
    expect(checkExpr(factor, "x^3 - x").note?.vi).toMatch(/dạng tích/);
    const simp = { ...base, type: "expr" as const, form: "simplified" as const, answer: "2x²y" };
    expect(checkExpr(simp, "6x^2y - 4x^2y").note?.vi).toMatch(/thu gọn/);
    expect(checkAnswer(simp, "2x2y")).toBe(true);
  });

  it("bảy hằng đẳng thức trong Góc công cụ đều đúng (kiểm bằng bộ máy)", () => {
    expect(IDENTITIES).toHaveLength(7);
    for (const h of IDENTITIES) {
      const [l, r] = h.formula.toLowerCase().split("=");
      expect(equal(polyOf(l), polyOf(r))).toBe(true);
    }
  });

  it("xem trước đẹp", () => {
    expect(prettyInput("3x^2 - 2x2y*5")).toBe("3x² − 2x²y·5");
    expect(prettyInput("x²+x−(x)")).toBe("x² + x − (x)");
  });
});
