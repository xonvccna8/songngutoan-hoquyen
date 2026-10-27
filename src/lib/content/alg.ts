// Tiện ích soạn bài Đại số: đáp án luôn do bộ máy đa thức tính (không gõ tay) để không thể sai
import { degree, evaluate, polyOf, prettyInput, toStr } from "@/lib/algebra/poly";
import { int } from "@/lib/content/helpers";

/** Rút gọn rồi in đẹp: "2x*3x" → "6x²" */
export const S = (src: string) => toStr(polyOf(src));
/** In đẹp nguyên dạng (không rút gọn): "(2x^2y)*(-3xy^3)" → "(2x²y)·(−3xy³)" */
export const P = (src: string) => prettyInput(src);
export const deg = (src: string) => degree(polyOf(src));
export const val = (src: string, vals: Record<string, number>) => evaluate(polyOf(src), vals);

/** Số nguyên ngẫu nhiên khác 0 trong [lo, hi] */
export function nz(r: () => number, lo: number, hi: number) {
  for (;;) {
    const n = int(r, lo, hi);
    if (n !== 0) return n;
  }
}

/** Chuỗi đơn thức để đưa vào bộ máy: c·x^a·y^b */
export const mono = (c: number, a: number, b = 0) => `${c}${a ? `x${a > 1 ? `^${a}` : ""}` : ""}${b ? `y${b > 1 ? `^${b}` : ""}` : ""}`;

const SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
/** Luỹ thừa của một số khi thay vào: (−2)³ */
export const powSub = (n: number, e: number) => (e === 1 ? sub(n) : sub(n) + String(e).replace(/\d/g, (d) => SUPS[+d]));

/** Viết số khi thay vào biểu thức: −2 → (−2) */
export const sub = (n: number) => (n < 0 ? `(−${-n})` : String(n));

/** Chọn ngẫu nhiên một phần tử */
export const pick = <T,>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length)];
