// Bộ máy đa thức: đọc biểu thức em gõ → cây biểu thức → đa thức thu gọn; so sánh, in đẹp, kiểm tra dạng.
// Hàm thuần, có test trong tests/algebra.test.ts.
// Cách gõ được chấp nhận: x^2, x2 (chữ số ngay sau biến = số mũ), x², 3xy, 2(x+1), (x-1)(x+1), dấu − / ·, số thập phân "2,5".

/** Số mũ từng biến của một đơn thức, ví dụ { x: 2, y: 1 } */
export type Exps = Record<string, number>;
export interface Term {
  c: number;
  e: Exps;
}
/** Đa thức thu gọn: khoá = phần biến ("x2y1"), giá trị = hạng tử */
export type Poly = Map<string, Term>;

export type Node =
  | { k: "num"; v: number }
  | { k: "var"; n: string }
  | { k: "add" | "sub" | "mul" | "div"; a: Node; b: Node }
  | { k: "neg"; a: Node }
  | { k: "pow"; a: Node; n: number }
  | { k: "group"; a: Node };

export class ParseError extends Error {}

const EPS = 1e-9;
const SUP: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
const TO_SUP: Record<string, string> = Object.fromEntries(Object.entries(SUP).map(([s, d]) => [d, s]));

// ===== Đọc chuỗi =====
type Tok = { t: "num"; v: number } | { t: "var"; n: string } | { t: "pow"; n: number } | { t: "op"; o: string };

function tokenize(src: string): Tok[] {
  const s = src.replace(/[−–—]/g, "-").replace(/[×·∙⋅]/g, "*").replace(/[÷:]/g, "/").replace(/\s+/g, "");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\d/.test(ch)) {
      let j = i;
      while (j < s.length && /\d/.test(s[j])) j++;
      // "2,5" / "2.5" là số thập phân
      if ((s[j] === "," || s[j] === ".") && /\d/.test(s[j + 1] ?? "")) {
        j++;
        while (j < s.length && /\d/.test(s[j])) j++;
      }
      out.push({ t: "num", v: Number(s.slice(i, j).replace(",", ".")) });
      i = j;
    } else if (/[a-zA-Z]/.test(ch)) {
      out.push({ t: "var", n: ch.toLowerCase() });
      i++;
      // Chữ số ngay sau biến là số mũ: x2 = x²
      let j = i;
      while (j < s.length && /\d/.test(s[j])) j++;
      if (j > i) {
        out.push({ t: "pow", n: Number(s.slice(i, j)) });
        i = j;
      }
    } else if (SUP[ch]) {
      let d = "";
      while (i < s.length && SUP[s[i]]) d += SUP[s[i++]];
      out.push({ t: "pow", n: Number(d) });
    } else if (ch === "^") {
      let j = i + 1;
      // cho phép x^(2)
      const paren = s[j] === "(";
      if (paren) j++;
      const k = j;
      while (j < s.length && /\d/.test(s[j])) j++;
      if (j === k) throw new ParseError("Sau dấu ^ cần một số mũ");
      if (paren) {
        if (s[j] !== ")") throw new ParseError("Thiếu dấu )");
        out.push({ t: "pow", n: Number(s.slice(k, j)) });
        j++;
      } else out.push({ t: "pow", n: Number(s.slice(k, j)) });
      i = j;
    } else if ("+-*/()".includes(ch)) {
      out.push({ t: "op", o: ch });
      i++;
    } else if (ch === "[" || ch === "{") {
      out.push({ t: "op", o: "(" });
      i++;
    } else if (ch === "]" || ch === "}") {
      out.push({ t: "op", o: ")" });
      i++;
    } else throw new ParseError(`Kí tự “${ch}” chưa đọc được`);
  }
  return out;
}

export function parse(src: string): Node {
  const toks = tokenize(src);
  if (!toks.length) throw new ParseError("Chưa có biểu thức");
  let p = 0;
  const peek = () => toks[p];
  const isOp = (o: string) => peek()?.t === "op" && (peek() as { o: string }).o === o;

  function expr(): Node {
    let n = term();
    while (isOp("+") || isOp("-")) {
      const o = (toks[p++] as { o: string }).o;
      n = { k: o === "+" ? "add" : "sub", a: n, b: term() };
    }
    return n;
  }
  function term(): Node {
    let n = unary();
    for (;;) {
      if (isOp("*")) {
        p++;
        n = { k: "mul", a: n, b: unary() };
      } else if (isOp("/")) {
        p++;
        // "A : 3x" nghĩa là chia cho cả đơn thức 3x (không phải (A : 3)·x)
        let d = unary();
        while (peek() && (peek().t === "num" || peek().t === "var")) d = { k: "mul", a: d, b: unary() };
        n = { k: "div", a: n, b: d };
      } else if (peek() && (peek().t === "num" || peek().t === "var" || isOp("("))) {
        // Nhân ngầm: 3x, 2(x+1), (x+1)(x-1)
        n = { k: "mul", a: n, b: unary() };
      } else return n;
    }
  }
  function unary(): Node {
    if (isOp("-")) {
      p++;
      return { k: "neg", a: unary() };
    }
    if (isOp("+")) {
      p++;
      return unary();
    }
    return power();
  }
  function power(): Node {
    let n = primary();
    while (peek()?.t === "pow") {
      const e = (toks[p++] as { n: number }).n;
      if (e > 12) throw new ParseError("Số mũ quá lớn");
      n = { k: "pow", a: n, n: e };
    }
    return n;
  }
  function primary(): Node {
    const t = toks[p++];
    if (!t) throw new ParseError("Biểu thức còn thiếu");
    if (t.t === "num") return { k: "num", v: t.v };
    if (t.t === "var") return { k: "var", n: t.n };
    if (t.t === "op" && t.o === "(") {
      const n = expr();
      if (!isOp(")")) throw new ParseError("Thiếu dấu )");
      p++;
      return { k: "group", a: n };
    }
    throw new ParseError("Biểu thức chưa đúng cách viết");
  }

  const n = expr();
  if (p < toks.length) throw new ParseError(isOp(")") ? "Thừa dấu )" : "Biểu thức chưa đúng cách viết");
  return n;
}

// ===== Phép toán trên đa thức =====
const keyOf = (e: Exps) =>
  Object.keys(e)
    .filter((v) => e[v] > 0)
    .sort()
    .map((v) => v + e[v])
    .join("");

const clean = (e: Exps): Exps => Object.fromEntries(Object.entries(e).filter(([, n]) => n > 0));

function addTerm(p: Poly, t: Term) {
  const k = keyOf(t.e);
  const c = (p.get(k)?.c ?? 0) + t.c;
  if (Math.abs(c) < EPS) p.delete(k);
  else p.set(k, { c, e: clean(t.e) });
}

export const constPoly = (v: number): Poly => {
  const p: Poly = new Map();
  if (Math.abs(v) > EPS) p.set("", { c: v, e: {} });
  return p;
};

export function add(a: Poly, b: Poly, sign = 1): Poly {
  const p: Poly = new Map(a);
  b.forEach((t) => addTerm(p, { c: sign * t.c, e: t.e }));
  return p;
}

export function mul(a: Poly, b: Poly): Poly {
  const p: Poly = new Map();
  a.forEach((s) =>
    b.forEach((t) => {
      const e: Exps = { ...s.e };
      for (const [v, n] of Object.entries(t.e)) e[v] = (e[v] ?? 0) + n;
      addTerm(p, { c: s.c * t.c, e });
    }),
  );
  return p;
}

export function pow(a: Poly, n: number): Poly {
  let p = constPoly(1);
  for (let i = 0; i < n; i++) p = mul(p, a);
  return p;
}

/** Chia đa thức cho đơn thức (chỉ khi chia hết) */
export function divMono(a: Poly, m: Poly): Poly {
  if (m.size !== 1) throw new ParseError("Chỉ chia được cho một đơn thức");
  const d = [...m.values()][0];
  const p: Poly = new Map();
  a.forEach((t) => {
    const e: Exps = { ...t.e };
    for (const [v, n] of Object.entries(d.e)) {
      e[v] = (e[v] ?? 0) - n;
      if (e[v] < 0) throw new ParseError("Phép chia này không chia hết");
    }
    addTerm(p, { c: t.c / d.c, e });
  });
  return p;
}

export function toPoly(n: Node): Poly {
  switch (n.k) {
    case "num":
      return constPoly(n.v);
    case "var":
      return new Map([[n.n + "1", { c: 1, e: { [n.n]: 1 } }]]);
    case "add":
      return add(toPoly(n.a), toPoly(n.b));
    case "sub":
      return add(toPoly(n.a), toPoly(n.b), -1);
    case "mul":
      return mul(toPoly(n.a), toPoly(n.b));
    case "div":
      return divMono(toPoly(n.a), toPoly(n.b));
    case "neg":
      return add(new Map(), toPoly(n.a), -1);
    case "pow":
      return pow(toPoly(n.a), n.n);
    case "group":
      return toPoly(n.a);
  }
}

export const polyOf = (src: string) => toPoly(parse(src));

export function equal(a: Poly, b: Poly): boolean {
  const d = add(a, b, -1);
  return [...d.values()].every((t) => Math.abs(t.c) < 1e-7);
}

export const degreeOf = (t: Term) => Object.values(t.e).reduce((s, n) => s + n, 0);
/** Bậc của đa thức thu gọn (đa thức 0: −1) */
export const degree = (p: Poly) => (p.size ? Math.max(...[...p.values()].map(degreeOf)) : -1);

/** Giá trị đa thức khi thay giá trị các biến */
export function evaluate(p: Poly, vals: Record<string, number>): number {
  let s = 0;
  p.forEach((t) => (s += t.c * Object.entries(t.e).reduce((m, [v, n]) => m * (vals[v] ?? 0) ** n, 1)));
  return Math.round(s * 1e9) / 1e9;
}

// ===== In đẹp =====
const sup = (n: number) => (n === 1 ? "" : String(n).replace(/\d/g, (d) => TO_SUP[d]));
const numStr = (v: number) => String(+v.toFixed(6)).replace(".", ",");

export function monoStr(t: Term, lead: boolean): string {
  const vars = Object.keys(t.e)
    .sort()
    .map((v) => v + sup(t.e[v]))
    .join("");
  const a = Math.abs(t.c);
  const coef = vars && Math.abs(a - 1) < EPS ? "" : numStr(a);
  const sign = t.c < 0 ? (lead ? "−" : " − ") : lead ? "" : " + ";
  return sign + coef + vars;
}

/** Thứ tự hạng tử: bậc giảm dần, rồi số mũ của biến đứng trước (x trước y) giảm dần */
export function terms(p: Poly): Term[] {
  return [...p.values()].sort((a, b) => {
    const d = degreeOf(b) - degreeOf(a);
    if (d) return d;
    for (const v of ["x", "y", "z", "a", "b", "c"]) {
      const e = (b.e[v] ?? 0) - (a.e[v] ?? 0);
      if (e) return e;
    }
    return 0;
  });
}

export function toStr(p: Poly): string {
  const ts = terms(p);
  return ts.length ? ts.map((t, i) => monoStr(t, i === 0)).join("") : "0";
}

/** Làm đẹp chuỗi em đang gõ (xem trước): x^2 → x², * → ·, - → − */
export function prettyInput(src: string): string {
  return src
    .replace(/[−–]/g, "-")
    .replace(/\^\(?(\d+)\)?/g, (_, d: string) => sup(Number(d)))
    .replace(/([a-zA-Z])(\d+)/g, (_, v: string, d: string) => v + sup(Number(d)))
    .replace(/\*/g, "·")
    .replace(/(\S)\s*-\s*/g, "$1 − ")
    .replace(/^-/, "−")
    .replace(/(\S)\s*\+\s*/g, "$1 + ");
}

// ===== Kiểm tra dạng =====
const flat = (n: Node, k: "mul" | "add"): Node[] => {
  if (k === "mul" && n.k === "mul") return [...flat(n.a, k), ...flat(n.b, k)];
  if (k === "add" && (n.k === "add" || n.k === "sub")) return [...flat(n.a, k), ...(n.k === "sub" ? [{ k: "neg", a: n.b } as Node] : flat(n.b, k))];
  return [n];
};
const stripNeg = (n: Node): Node => (n.k === "neg" ? stripNeg(n.a) : n.k === "group" && n.a.k === "neg" ? stripNeg(n.a.a) : n);

/** Có ngoặc chứa tổng/hiệu (tức là chưa nhân phá ngoặc) không */
function hasSumGroup(n: Node): boolean {
  if (n.k === "group") return n.a.k === "add" || n.a.k === "sub" || hasSumGroup(n.a);
  if (n.k === "num" || n.k === "var") return false;
  if (n.k === "neg" || n.k === "pow") return hasSumGroup(n.a);
  return hasSumGroup(n.a) || hasSumGroup(n.b);
}

/** Dạng khai triển: không còn ngoặc chứa tổng */
export const isExpanded = (n: Node) => !hasSumGroup(n);

/** Dạng thu gọn: khai triển, mỗi hạng tử là đơn thức thu gọn, không có hai hạng tử đồng dạng */
export function isSimplified(n: Node): boolean {
  if (!isExpanded(n)) return false;
  const seen = new Set<string>();
  for (const t of flat(n, "add")) {
    const factors = flat(stripNeg(t), "mul");
    let nums = 0;
    const vars = new Set<string>();
    for (const f0 of factors) {
      const f = stripNeg(f0);
      const g = f.k === "pow" ? f.a : f;
      if (g.k === "num") {
        if (f.k === "pow" || ++nums > 1) return false;
      } else if (g.k === "var") {
        if (vars.has(g.n)) return false;
        vars.add(g.n);
      } else return false;
    }
    const p = toPoly(t);
    // Hạng tử bằng 0 (ví dụ 0x) là chưa thu gọn
    if (!p.size) return false;
    const k = keyOf([...p.values()][0].e);
    if (seen.has(k)) return false;
    seen.add(k);
  }
  return true;
}

/**
 * Số "nhân tử" của dạng tích: mỗi thừa số nhiều hạng tử tính 1 (nhân với số mũ),
 * đơn thức tính theo bậc (x² = x·x tính 2). Hằng số không tính.
 * Dùng để biết em đã phân tích triệt để chưa.
 */
export function factorCount(n: Node): number {
  const base = stripNeg(n);
  if (base.k === "pow") return factorCount(base.a) * base.n;
  if (base.k === "group") return factorCount(base.a);
  if (base.k === "mul") return flat(base, "mul").reduce((s, f) => s + factorCount(f), 0);
  const p = toPoly(base);
  if (p.size <= 1) return p.size ? degreeOf([...p.values()][0]) : 0;
  return 1;
}

/** Dạng tích: biểu thức là một tích (hoặc luỹ thừa) có ít nhất một thừa số nhiều hạng tử */
export function isFactored(n: Node): boolean {
  const base = stripNeg(n);
  const multi = (f: Node) => toPoly(f).size >= 2;
  if (base.k === "pow") return multi(base.a);
  if (base.k === "group") return isFactored(base.a);
  if (base.k !== "mul") return false;
  const fs = flat(base, "mul");
  return fs.length >= 2 && fs.some(multi);
}
