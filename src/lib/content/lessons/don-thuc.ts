// Bài 1. Đơn thức — Monomials (Toán 8 Kết nối tri thức, Chương I)
import { mono, nz, P, pick, powSub, S, sub, val } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

/** Bậc của đơn thức */
function genDegree(r: () => number): Question {
  const c = nz(r, -9, 9);
  const a = int(r, 1, 5);
  const b = int(r, 0, 4);
  const m = S(mono(c, a, b));
  return {
    id: `g-mdeg-${c}-${a}-${b}`,
    type: "number",
    level: 1,
    skill: "math",
    answer: a + b,
    prompt: bi(`Find the degree of the monomial ${m}.`, `Tìm bậc của đơn thức ${m}.`),
    hints: [
      bi("degree = bậc; exponent = số mũ", "Bậc của đơn thức (degree) = tổng số mũ của các biến."),
      bi("Add the exponents of x and y. (x means x¹)", "Cộng số mũ của x và của y (x không ghi số mũ nghĩa là x¹)."),
      bi(`${a}${b ? ` + ${b}` : ""} = ${a + b}`, `${a}${b ? ` + ${b}` : ""} = ${a + b}`),
    ],
    explain: bi(`The degree of ${m} is ${a + b}. The coefficient does not count.`, `Bậc của ${m} là ${a + b}. Hệ số không ảnh hưởng tới bậc.`),
  };
}

/** Hệ số của đơn thức thu gọn */
function genCoef(r: () => number): Question {
  const c = pick(r, [-1, 1, ...[2, 3, 4, 5, 6, 7, 8, 9].flatMap((n) => [n, -n])]);
  const a = int(r, 1, 3);
  const b = int(r, 0, 3);
  const m = S(mono(c, a, b));
  return {
    id: `g-mcoef-${c}-${a}-${b}`,
    type: "number",
    level: 1,
    skill: "lang",
    answer: c,
    prompt: bi(`What is the coefficient of the monomial ${m}?`, `Hệ số của đơn thức ${m} là bao nhiêu?`),
    hints: [
      bi("coefficient = hệ số (the number part)", "Hệ số (coefficient) là phần số đứng trước phần biến."),
      bi("x alone means 1·x; −x means (−1)·x. Use the ± button for negative numbers.", "x nghĩa là 1·x; −x nghĩa là (−1)·x. Số âm thì bấm nút ±."),
      bi(`The coefficient is ${c}.`, `Hệ số là ${c}.`),
    ],
    explain: bi(`${m} = ${c}·${S(mono(1, a, b))}, so the coefficient is ${c}.`, `${m} = ${c}·${S(mono(1, a, b))} nên hệ số là ${c}.`),
  };
}

/** Chọn đơn thức đồng dạng */
function genLike(r: () => number): Question {
  const [a, b] = pick(r, [[2, 1], [1, 2], [3, 1], [2, 2], [1, 3]]);
  const target = S(mono(nz(r, 2, 9), a, b));
  const right = S(mono(nz(r, -7, -2), a, b));
  const wrongs = shuffle([S(mono(nz(r, 2, 9), b, a)), S(mono(nz(r, 2, 9), a + 1, b)), S(mono(nz(r, 2, 9), a, b + 1)), S(mono(nz(r, 2, 9), a, 0))], r)
    .filter((w) => w.replace(/^−?\d*/, "") !== right.replace(/^−?\d*/, ""))
    .slice(0, 3);
  const opts = shuffle([right, ...wrongs], r);
  return {
    id: `g-mlike-${a}-${b}-${right}`,
    type: "mcq",
    level: 1,
    skill: "math",
    answer: opts.indexOf(right),
    options: opts.map((o) => bi(o, o)),
    prompt: bi(`Which monomial is like ${target}?`, `Đơn thức nào đồng dạng với ${target}?`),
    hints: [
      bi("like monomials = đơn thức đồng dạng", "Đơn thức đồng dạng có cùng phần biến (hệ số khác 0)."),
      bi(`Look for the same variable part: ${S(mono(1, a, b))}.`, `Tìm đơn thức có đúng phần biến ${S(mono(1, a, b))}.`),
      bi(`Answer: ${right}`, `Đáp án: ${right}`),
    ],
    explain: bi(`${right} has the same variable part as ${target}. The coefficient can be different (even negative).`, `${right} có cùng phần biến với ${target}. Hệ số có thể khác (kể cả âm).`),
  };
}

/** Thu gọn tích hai đơn thức */
function genProduct(r: () => number): Question {
  const [c1, a1, b1] = [nz(r, -6, 6), int(r, 1, 3), int(r, 0, 2)];
  const [c2, a2, b2] = [nz(r, -6, 6), int(r, 0, 3), int(r, 1, 3)];
  const src = `(${mono(c1, a1, b1)})*(${mono(c2, a2, b2)})`;
  const ans = S(src);
  return {
    id: `g-mprod-${c1}${a1}${b1}-${c2}${a2}${b2}`,
    type: "expr",
    form: "simplified",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Simplify: (${S(mono(c1, a1, b1))})·(${S(mono(c2, a2, b2))})`, `Thu gọn: (${S(mono(c1, a1, b1))})·(${S(mono(c2, a2, b2))})`),
    hints: [
      bi("simplify = thu gọn", "Nhân các hệ số với nhau, nhân các luỹ thừa cùng biến với nhau."),
      bi("xᵐ · xⁿ = xᵐ⁺ⁿ (add the exponents)", "xᵐ · xⁿ = xᵐ⁺ⁿ (cộng số mũ)."),
      bi(`Coefficient ${c1}·${sub(c2)} = ${c1 * c2}; result ${ans}`, `Hệ số ${c1}·${sub(c2)} = ${c1 * c2}; kết quả ${ans}`),
    ],
    explain: bi(`(${S(mono(c1, a1, b1))})·(${S(mono(c2, a2, b2))}) = ${ans}`, `(${S(mono(c1, a1, b1))})·(${S(mono(c2, a2, b2))}) = ${ans}`),
  };
}

/** Cộng, trừ đơn thức đồng dạng */
function genAddLike(r: () => number): Question {
  const [a, b] = pick(r, [[2, 1], [1, 2], [1, 1], [3, 0], [2, 0]]);
  const cs = [nz(r, 2, 9), nz(r, -9, 9), nz(r, -9, 9)];
  let total = cs.reduce((s, c) => s + c, 0);
  if (total === 0) {
    cs[0] += 1;
    total = 1;
  }
  const src = cs.map((c) => mono(c, a, b)).join(" + ").replace(/\+ -/g, "- ");
  return {
    id: `g-madd-${cs.join("_")}-${a}${b}`,
    type: "expr",
    form: "simplified",
    level: 2,
    skill: "math",
    answer: S(src),
    prompt: bi(`Calculate: ${P(src)}`, `Tính: ${P(src)}`),
    hints: [
      bi("like monomials = đơn thức đồng dạng", "Đây là các đơn thức đồng dạng."),
      bi("Add the coefficients, keep the variable part.", "Cộng (trừ) các hệ số, giữ nguyên phần biến."),
      bi(`${cs.join(" + ").replace(/\+ -/g, "− ")} = ${total} → ${S(src)}`, `${cs.join(" + ").replace(/\+ -/g, "− ")} = ${total} → ${S(src)}`),
    ],
    explain: bi(`(${cs.join(" + ").replace(/\+ -/g, "− ")})·${S(mono(1, a, b))} = ${S(src)}`, `(${cs.join(" + ").replace(/\+ -/g, "− ")})·${S(mono(1, a, b))} = ${S(src)}`),
  };
}

/** Giá trị của đơn thức */
function genValue(r: () => number): Question {
  const c = nz(r, -5, 5);
  const a = int(r, 1, 3);
  const b = int(r, 1, 2);
  const x = nz(r, -3, 3);
  const y = nz(r, -3, 3);
  const m = S(mono(c, a, b));
  const v = val(mono(c, a, b), { x, y });
  return {
    id: `g-mval-${c}${a}${b}-${x}_${y}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: v,
    prompt: bi(`Find the value of ${m} at x = ${x}, y = ${y}.`, `Tính giá trị của đơn thức ${m} tại x = ${x}, y = ${y}.`),
    hints: [
      bi("value = giá trị; substitute = thay số", "Thay x, y bằng các số đã cho (số âm nhớ để trong ngoặc)."),
      bi("Work out the powers first, then multiply.", "Tính luỹ thừa trước, rồi nhân."),
      bi(`${c}·${powSub(x, a)}·${powSub(y, b)} = ${v}`, `${c}·${powSub(x, a)}·${powSub(y, b)} = ${v}`),
    ],
    explain: bi(`At x = ${x}, y = ${y}: ${m} = ${v}.`, `Tại x = ${x}, y = ${y}: ${m} = ${v}.`),
  };
}

/** Nhân rồi gộp đơn thức đồng dạng */
function genMixed(r: () => number): Question {
  const p = nz(r, 2, 5);
  const q = nz(r, 2, 5);
  let k = nz(r, 2, 9);
  if (k === p * q) k++; // tránh kết quả bằng 0
  const src = `${p}x*${q}xy - ${k}x^2y`;
  const ans = S(src);
  return {
    id: `g-mmix-${p}-${q}-${k}`,
    type: "expr",
    form: "simplified",
    level: 3,
    skill: "math",
    answer: ans,
    prompt: bi(`Simplify: ${P(src)}`, `Thu gọn: ${P(src)}`),
    hints: [
      bi("First multiply, then collect like terms.", "Nhân hai đơn thức trước, sau đó cộng trừ đơn thức đồng dạng."),
      bi(`${p}x·${q}xy = ${p * q}x²y`, `${p}x·${q}xy = ${p * q}x²y`),
      bi(`${p * q}x²y − ${k}x²y = ${ans}`, `${p * q}x²y − ${k}x²y = ${ans}`),
    ],
    explain: bi(`${p * q}x²y − ${k}x²y = ${ans}`, `${p * q}x²y − ${k}x²y = ${ans}`),
  };
}

export const DON_THUC: LessonContent = {
  id: "k8-1",
  slug: "don-thuc",
  title: bi("Monomials", "Đơn thức"),
  intro: bi(
    "Algebra uses letters for numbers. The simplest algebraic expressions are monomials, like 5, x or −3x²y. Let's learn their parts: coefficient, variable part and degree.",
    "Đại số dùng chữ thay cho số. Biểu thức đại số đơn giản nhất là đơn thức, như 5, x hay −3x²y. Cùng tìm hiểu các phần của nó: hệ số, phần biến và bậc.",
  ),
  goals: [
    bi("Recognise monomials and simplified monomials.", "Nhận biết đơn thức, đơn thức thu gọn."),
    bi("Find the coefficient, variable part and degree.", "Chỉ ra hệ số, phần biến và bậc của đơn thức."),
    bi("Add and subtract like monomials.", "Cộng, trừ các đơn thức đồng dạng."),
  ],
  terms: [
    { id: "monomial", en: "monomial", ipa: "/mɒˈnəʊmiəl/", vi: "đơn thức", example: bi("−3x²y is a monomial.", "−3x²y là một đơn thức.") },
    { id: "coefficient", en: "coefficient", ipa: "/ˌkəʊɪˈfɪʃnt/", vi: "hệ số", example: bi("The coefficient of −3x²y is −3.", "Hệ số của −3x²y là −3.") },
    { id: "variable", en: "variable", ipa: "/ˈveəriəbl/", vi: "biến", example: bi("x and y are variables.", "x và y là các biến.") },
    { id: "variable-part", en: "variable part", ipa: "/ˈveəriəbl pɑːt/", vi: "phần biến", example: bi("The variable part of −3x²y is x²y.", "Phần biến của −3x²y là x²y.") },
    { id: "degree-mono", en: "degree of a monomial", ipa: "/dɪˈɡriː əv ə mɒˈnəʊmiəl/", vi: "bậc của đơn thức", example: bi("The degree of −3x²y is 3.", "Bậc của −3x²y là 3.") },
    { id: "exponent", en: "exponent", ipa: "/ɪkˈspəʊnənt/", vi: "số mũ", example: bi("In x², the exponent is 2.", "Trong x², số mũ là 2.") },
    { id: "simplified", en: "simplified", ipa: "/ˈsɪmplɪfaɪd/", vi: "thu gọn", example: bi("6x³y is a simplified monomial.", "6x³y là đơn thức thu gọn.") },
    { id: "like-monomials", en: "like monomials", ipa: "/laɪk mɒˈnəʊmiəlz/", vi: "đơn thức đồng dạng", example: bi("3x²y and −5x²y are like monomials.", "3x²y và −5x²y là hai đơn thức đồng dạng.") },
    { id: "algebraic-expression", en: "algebraic expression", ipa: "/ˌældʒɪˈbreɪɪk ɪkˈspreʃn/", vi: "biểu thức đại số", example: bi("2x + 3 is an algebraic expression.", "2x + 3 là một biểu thức đại số.") },
    { id: "constant", en: "constant", ipa: "/ˈkɒnstənt/", vi: "hằng số", example: bi("A non-zero constant has degree 0.", "Một số khác 0 là đơn thức bậc 0.") },
  ],
  sections: [
    {
      id: "don-thuc",
      title: bi("What is a monomial?", "Đơn thức là gì?"),
      blocks: [
        {
          kind: "key",
          tag: bi("Definition", "Định nghĩa"),
          text: bi("A monomial is an algebraic expression made of one number, one variable, or a product of numbers and variables.", "Đơn thức là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến."),
        },
        {
          kind: "list",
          tag: bi("Examples", "Ví dụ"),
          items: [
            bi("Monomials: 5;  x;  −3x²y;  ½xy³;  2x·3y", "Là đơn thức: 5;  x;  −3x²y;  ½xy³;  2x·3y"),
            bi("Not monomials: x + y;  2x − 1  (they contain + or −)", "Không phải đơn thức: x + y;  2x − 1  (có phép cộng, trừ)"),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "mcq",
            level: 1,
            skill: "math",
            answer: 3,
            prompt: bi("Which expression is NOT a monomial?", "Biểu thức nào KHÔNG phải là đơn thức?"),
            options: ["5", "x", "−2x²y", "x + y"].map((t) => bi(t, t)),
            hints: [bi("monomial = đơn thức", "Đơn thức chỉ có số, biến và phép nhân."), bi("Look for a + or − between parts.", "Tìm biểu thức có dấu cộng/trừ giữa các phần."), bi("x + y is a sum.", "x + y là một tổng.")],
            explain: bi("x + y is a sum of two monomials, not a monomial.", "x + y là tổng của hai đơn thức, không phải đơn thức."),
          },
        },
      ],
    },
    {
      id: "thu-gon",
      title: bi("Simplified monomials, coefficient and degree", "Đơn thức thu gọn, hệ số, bậc"),
      blocks: [
        {
          kind: "key",
          tag: bi("Simplified monomial", "Đơn thức thu gọn"),
          text: bi(
            "A simplified monomial is a number, or a product of one number and variables, where each variable appears only once with a positive exponent.",
            "Đơn thức thu gọn là đơn thức chỉ gồm một số, hoặc có dạng tích của một số với những biến, mỗi biến chỉ xuất hiện một lần và đã được nâng lên luỹ thừa với số mũ nguyên dương.",
          ),
        },
        {
          kind: "list",
          tag: bi("In the simplified monomial −3x²y³:", "Trong đơn thức thu gọn −3x²y³:"),
          items: [
            bi("the coefficient is −3;", "hệ số là −3;"),
            bi("the variable part is x²y³;", "phần biến là x²y³;"),
            bi("the degree is 2 + 3 = 5 (sum of the exponents).", "bậc là 2 + 3 = 5 (tổng số mũ của các biến)."),
          ],
        },
        { kind: "key", tag: bi("Note", "Chú ý"), tone: "teal", text: bi("A non-zero number is a monomial of degree 0. The number 0 is a monomial with no degree.", "Số khác 0 là đơn thức bậc 0. Số 0 là đơn thức không có bậc.") },
        {
          kind: "example",
          problem: bi("Simplify the monomial 2x·(−3)x²y.", "Thu gọn đơn thức 2x·(−3)x²y."),
          steps: [
            bi("Multiply the numbers: 2·(−3) = −6.", "Nhân các số: 2·(−3) = −6."),
            bi("Multiply the powers of x: x·x² = x³.", "Nhân các luỹ thừa của x: x·x² = x³."),
            bi("Result: −6x³y (coefficient −6, degree 4).", "Kết quả: −6x³y (hệ số −6, bậc 4)."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "number",
            level: 1,
            skill: "math",
            answer: 6,
            prompt: bi("Find the degree of the monomial 7x³y²z.", "Tìm bậc của đơn thức 7x³y²z."),
            hints: [bi("degree = bậc", "Bậc = tổng số mũ các biến."), bi("z means z¹.", "z nghĩa là z¹."), bi("3 + 2 + 1 = 6", "3 + 2 + 1 = 6")],
            explain: bi("3 + 2 + 1 = 6.", "3 + 2 + 1 = 6."),
          },
        },
      ],
    },
    {
      id: "dong-dang",
      title: bi("Like monomials", "Đơn thức đồng dạng"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("Like monomials have non-zero coefficients and the same variable part.", "Hai đơn thức đồng dạng là hai đơn thức có hệ số khác 0 và có cùng phần biến.") },
        { kind: "key", tag: bi("Rule", "Quy tắc"), tone: "sun", text: bi("To add (or subtract) like monomials, add (or subtract) the coefficients and keep the variable part.", "Để cộng (hay trừ) các đơn thức đồng dạng, ta cộng (hay trừ) các hệ số với nhau và giữ nguyên phần biến.") },
        {
          kind: "example",
          problem: bi("Calculate 3x²y + 5x²y − 2x²y.", "Tính 3x²y + 5x²y − 2x²y."),
          steps: [bi("They are like monomials (variable part x²y).", "Đây là các đơn thức đồng dạng (phần biến x²y)."), bi("3 + 5 − 2 = 6.", "3 + 5 − 2 = 6."), bi("Result: 6x²y.", "Kết quả: 6x²y.")],
        },
        {
          kind: "check",
          question: {
            id: "c3",
            type: "expr",
            form: "simplified",
            level: 2,
            skill: "math",
            answer: "−3xy²",
            prompt: bi("Calculate: 4xy² − 7xy²", "Tính: 4xy² − 7xy²"),
            hints: [bi("like monomials = đơn thức đồng dạng", "Hai đơn thức cùng phần biến xy²."), bi("4 − 7 = ?", "4 − 7 = ?"), bi("−3xy²", "−3xy²")],
            explain: bi("(4 − 7)xy² = −3xy².", "(4 − 7)xy² = −3xy²."),
          },
        },
      ],
    },
  ],
  practice: [
    {
      id: "p1",
      type: "term",
      level: 1,
      skill: "lang",
      accept: ["monomial", "a monomial"],
      prompt: bi("Type the English word for “đơn thức”.", "Gõ từ tiếng Anh của “đơn thức”."),
      hints: [bi("mono- = one", "“mono-” nghĩa là một."), bi("mono + mial", "mono + mial"), bi("monomial", "monomial")],
      explain: bi("monomial /mɒˈnəʊmiəl/ = đơn thức", "monomial /mɒˈnəʊmiəl/ = đơn thức"),
    },
    {
      id: "p2",
      type: "tf",
      level: 2,
      skill: "math",
      answer: false,
      prompt: bi("True or false: The number 0 is a monomial of degree 0.", "Đúng hay sai: Số 0 là đơn thức bậc 0."),
      hints: [bi("degree = bậc", "Nhớ lại phần “Chú ý” trong bài."), bi("Non-zero numbers have degree 0. What about 0?", "Số khác 0 có bậc 0. Còn số 0?"), bi("0 has no degree.", "Số 0 không có bậc.")],
      explain: bi("False: 0 is a monomial with no degree.", "Sai: số 0 là đơn thức không có bậc."),
    },
  ],
  generators: [
    { level: 1, make: genDegree },
    { level: 1, make: genCoef },
    { level: 1, make: genLike },
    { level: 2, make: genProduct },
    { level: 2, make: genAddLike },
    { level: 3, make: genValue },
    { level: 3, make: genMixed },
  ],
  speak: [
    { en: "A monomial has a coefficient and a variable part.", vi: "Đơn thức có hệ số và phần biến." },
    { en: "The degree is the sum of the exponents.", vi: "Bậc là tổng các số mũ." },
    { en: "Like monomials have the same variable part.", vi: "Đơn thức đồng dạng có cùng phần biến." },
    { en: "We add the coefficients and keep the variable part.", vi: "Ta cộng các hệ số và giữ nguyên phần biến." },
    { en: "The number zero has no degree.", vi: "Số không không có bậc." },
  ],
  summary: [
    bi("Monomial: a number, a variable, or a product of numbers and variables.", "Đơn thức: một số, một biến, hoặc tích giữa các số và các biến."),
    bi("In −3x²y³: coefficient −3, variable part x²y³, degree 5.", "Trong −3x²y³: hệ số −3, phần biến x²y³, bậc 5."),
    bi("Like monomials: same variable part. axⁿ + bxⁿ = (a + b)xⁿ.", "Đơn thức đồng dạng: cùng phần biến. axⁿ + bxⁿ = (a + b)xⁿ."),
    bi("xᵐ · xⁿ = xᵐ⁺ⁿ", "xᵐ · xⁿ = xᵐ⁺ⁿ"),
  ],
};
