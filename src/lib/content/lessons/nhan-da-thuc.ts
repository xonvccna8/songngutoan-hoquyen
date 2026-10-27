// Bài 4. Phép nhân đa thức — Multiplying polynomials (Toán 8 KNTT, Chương I)
import { mono, nz, P, S } from "@/lib/content/alg";
import { bi, int } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

const lin = (a: number, b: number, v = "x") => P(`${a === 1 ? "" : a === -1 ? "-" : a}${v} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`);

/** Đơn thức × đa thức */
function genMonoPoly(r: () => number): Question {
  const m = mono(nz(r, -5, 5), int(r, 1, 2), int(r, 0, 1));
  const a = nz(r, -6, 6);
  const b = nz(r, -6, 6);
  const c = nz(r, -9, 9);
  const poly = `${a}x^2 + ${b}x + ${c}`.replace(/\+ -/g, "- ");
  const src = `(${m})*(${poly})`;
  const ans = S(src);
  return {
    id: `g-mp-${src}`,
    type: "expr",
    form: "expanded",
    level: 1,
    skill: "math",
    answer: ans,
    prompt: bi(`Multiply: ${S(m)}·(${S(poly)})`, `Thực hiện phép nhân: ${S(m)}·(${S(poly)})`),
    hints: [
      bi("distributive property = tính chất phân phối", "Nhân đơn thức với TỪNG hạng tử của đa thức rồi cộng lại."),
      bi("Watch the signs and add the exponents: xᵐ·xⁿ = xᵐ⁺ⁿ.", "Chú ý dấu và cộng số mũ: xᵐ·xⁿ = xᵐ⁺ⁿ."),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${S(m)}·(${S(poly)}) = ${ans}`, `${S(m)}·(${S(poly)}) = ${ans}`),
  };
}

/** (x + a)(x + b) */
function genBinomial(r: () => number): Question {
  const a = nz(r, -7, 7);
  const b = nz(r, -7, 7);
  const src = `(x + ${a})(x + ${b})`.replace(/\+ -/g, "- ");
  const ans = S(src);
  return {
    id: `g-bin-${a}_${b}`,
    type: "expr",
    form: "expanded",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Expand: ${P(src)}`, `Nhân phá ngoặc: ${P(src)}`),
    hints: [
      bi("expand = nhân phá ngoặc", "Nhân mỗi hạng tử của ngoặc thứ nhất với từng hạng tử của ngoặc thứ hai."),
      bi(`x·x + x·(${b}) + ${a}·x + ${a}·(${b})`, `x·x + x·(${b}) + ${a}·x + ${a}·(${b})`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${P(src)} = ${ans}`, `${P(src)} = ${ans}`),
  };
}

/** (ax + b)(cx + d) */
function genGeneral(r: () => number): Question {
  const [a, b, c, d] = [nz(r, -4, 4), nz(r, -6, 6), nz(r, -4, 4), nz(r, -6, 6)];
  const src = `(${lin(a, b)})(${lin(c, d)})`;
  const ans = S(src);
  return {
    id: `g-gen-${a}${b}${c}${d}`,
    type: "expr",
    form: "expanded",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Expand and simplify: ${src}`, `Nhân và thu gọn: ${src}`),
    hints: [
      bi("Each term × each term: 4 products.", "Mỗi hạng tử nhân với từng hạng tử: 4 tích."),
      bi("Then collect the two x-terms.", "Rồi gộp hai hạng tử chứa x."),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Biểu thức không phụ thuộc vào biến */
function genIndependent(r: () => number): Question {
  const a = nz(r, -6, 6);
  const b = nz(r, -6, 6);
  const s = a + b;
  if (s === 0) return genIndependent(r);
  const src = `(x + ${a})(x + ${b}) - x(x + ${s})`.replace(/\+ -/g, "- ");
  return {
    id: `g-ind-${a}_${b}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: a * b,
    prompt: bi(`Show that ${P(src)} does not depend on x. What is its value?`, `Chứng tỏ ${P(src)} không phụ thuộc vào x. Giá trị của nó bằng bao nhiêu?`),
    hints: [
      bi("does not depend on x = không phụ thuộc vào x (the x-terms cancel out)", "Không phụ thuộc vào x: sau khi thu gọn, các hạng tử chứa x triệt tiêu hết."),
      bi(`(x + ${a})(x + ${b}) = ${S(`(x + ${a})(x + ${b})`)}; x(x + ${s}) = ${S(`x(x + ${s})`)}`.replace(/\+ -/g, "− "), `(x + ${a})(x + ${b}) = ${S(`(x + ${a})(x + ${b})`)}; x(x + ${s}) = ${S(`x(x + ${s})`)}`.replace(/\+ -/g, "− ")),
      bi(`Subtract: ${a * b}`, `Trừ đi: ${a * b}`),
    ],
    explain: bi(`After simplifying, only ${a * b} is left, whatever x is.`, `Thu gọn xong chỉ còn ${a * b}, với mọi giá trị của x.`),
  };
}

/** Diện tích hình chữ nhật dạng biểu thức */
function genArea(r: () => number): Question {
  const a = int(r, 1, 5);
  const b = int(r, 2, 4);
  const c = int(r, 1, 6);
  const src = `(x + ${a})(${b}x + ${c})`;
  const ans = S(src);
  return {
    id: `g-area-${a}${b}${c}`,
    type: "expr",
    form: "expanded",
    level: 3,
    skill: "math",
    answer: ans,
    prompt: bi(
      `A rectangle has length ${b}x + ${c} (cm) and width x + ${a} (cm). Write its area as a polynomial.`,
      `Một hình chữ nhật có chiều dài ${b}x + ${c} (cm) và chiều rộng x + ${a} (cm). Viết diện tích dưới dạng đa thức.`,
    ),
    hints: [
      bi("area = length × width", "Diện tích = dài × rộng."),
      bi(`S = (x + ${a})(${b}x + ${c})`, `S = (x + ${a})(${b}x + ${c})`),
      bi(`S = ${ans} (cm²)`, `S = ${ans} (cm²)`),
    ],
    explain: bi(`S = (x + ${a})(${b}x + ${c}) = ${ans}`, `S = (x + ${a})(${b}x + ${c}) = ${ans}`),
  };
}

export const NHAN_DA_THUC: LessonContent = {
  id: "k8-4",
  slug: "nhan-da-thuc",
  title: bi("Multiplying polynomials", "Phép nhân đa thức"),
  intro: bi(
    "A garden is (x + 3) metres long and (x + 2) metres wide. Its area is (x + 3)(x + 2) — but what is that as a polynomial? Multiplying polynomials answers it.",
    "Một mảnh vườn dài (x + 3) mét, rộng (x + 2) mét. Diện tích là (x + 3)(x + 2) — nhưng viết thành đa thức thì sao? Phép nhân đa thức sẽ trả lời.",
  ),
  goals: [bi("Multiply a monomial by a polynomial.", "Nhân đơn thức với đa thức."), bi("Multiply a polynomial by a polynomial.", "Nhân đa thức với đa thức."), bi("Simplify expressions with products.", "Thu gọn biểu thức có phép nhân.")],
  terms: [
    { id: "multiply", en: "multiply", ipa: "/ˈmʌltɪplaɪ/", vi: "nhân", example: bi("Multiply 2x by (3x − 5).", "Nhân 2x với (3x − 5).") },
    { id: "product-alg", en: "product", ipa: "/ˈprɒdʌkt/", vi: "tích", example: bi("(x + 1)(x − 1) is a product.", "(x + 1)(x − 1) là một tích.") },
    { id: "expand", en: "expand", ipa: "/ɪkˈspænd/", vi: "khai triển, nhân phá ngoặc", example: bi("Expand (x + 2)(x + 3).", "Khai triển (x + 2)(x + 3).") },
    { id: "distributive", en: "distributive property", ipa: "/dɪˈstrɪbjətɪv ˈprɒpəti/", vi: "tính chất phân phối", example: bi("a(b + c) = ab + ac", "a(b + c) = ab + ac") },
    { id: "each-term", en: "each term", ipa: "/iːtʃ tɜːm/", vi: "từng hạng tử", example: bi("Multiply each term by 2x.", "Nhân từng hạng tử với 2x.") },
    { id: "factor-mult", en: "factor (of a product)", ipa: "/ˈfæktə(r)/", vi: "thừa số", example: bi("x + 1 is a factor of the product.", "x + 1 là một thừa số của tích.") },
    { id: "depend", en: "depend on", ipa: "/dɪˈpend ɒn/", vi: "phụ thuộc vào", example: bi("The value does not depend on x.", "Giá trị không phụ thuộc vào x.") },
    { id: "rule-mult", en: "rule", ipa: "/ruːl/", vi: "quy tắc", example: bi("Use the rule for multiplying polynomials.", "Dùng quy tắc nhân đa thức.") },
    { id: "length-width", en: "length × width", ipa: "/leŋθ ˈtaɪmz wɪdθ/", vi: "dài × rộng", example: bi("Area = length × width", "Diện tích = dài × rộng") },
  ],
  sections: [
    {
      id: "don-x-da",
      title: bi("Monomial × polynomial", "Nhân đơn thức với đa thức"),
      blocks: [
        { kind: "key", tag: bi("Rule", "Quy tắc"), text: bi("Multiply the monomial by each term of the polynomial, then add the products.", "Muốn nhân một đơn thức với một đa thức, ta nhân đơn thức với từng hạng tử của đa thức rồi cộng các tích với nhau.") },
        { kind: "text", text: bi("A(B + C) = AB + AC", "A(B + C) = AB + AC") },
        {
          kind: "example",
          problem: bi("Multiply: 2x(3x² − 5x + 1)", "Thực hiện phép nhân: 2x(3x² − 5x + 1)"),
          steps: [bi("2x·3x² = 6x³", "2x·3x² = 6x³"), bi("2x·(−5x) = −10x²", "2x·(−5x) = −10x²"), bi("2x·1 = 2x → result 6x³ − 10x² + 2x", "2x·1 = 2x → kết quả 6x³ − 10x² + 2x")],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "expr",
            form: "expanded",
            level: 1,
            skill: "math",
            answer: "−3x² + 6x",
            prompt: bi("Multiply: −3x(x − 2)", "Thực hiện phép nhân: −3x(x − 2)"),
            hints: [bi("each term = từng hạng tử", "Nhân −3x với x và với −2."), bi("(−3x)·x = −3x²; (−3x)·(−2) = 6x", "(−3x)·x = −3x²; (−3x)·(−2) = 6x"), bi("−3x² + 6x", "−3x² + 6x")],
            explain: bi("−3x(x − 2) = −3x² + 6x.", "−3x(x − 2) = −3x² + 6x."),
          },
        },
      ],
    },
    {
      id: "da-x-da",
      title: bi("Polynomial × polynomial", "Nhân đa thức với đa thức"),
      blocks: [
        { kind: "key", tag: bi("Rule", "Quy tắc"), tone: "sun", text: bi("Multiply each term of one polynomial by each term of the other, then add the products.", "Muốn nhân một đa thức với một đa thức, ta nhân mỗi hạng tử của đa thức này với từng hạng tử của đa thức kia rồi cộng các tích với nhau.") },
        { kind: "text", text: bi("(A + B)(C + D) = AC + AD + BC + BD", "(A + B)(C + D) = AC + AD + BC + BD") },
        {
          kind: "example",
          problem: bi("Expand: (x + 3)(x − 2)", "Nhân phá ngoặc: (x + 3)(x − 2)"),
          steps: [bi("= x·x + x·(−2) + 3·x + 3·(−2)", "= x·x + x·(−2) + 3·x + 3·(−2)"), bi("= x² − 2x + 3x − 6", "= x² − 2x + 3x − 6"), bi("= x² + x − 6", "= x² + x − 6")],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "expr",
            form: "expanded",
            level: 2,
            skill: "math",
            answer: "x² + 6x + 8",
            prompt: bi("Expand: (x + 2)(x + 4)", "Nhân phá ngoặc: (x + 2)(x + 4)"),
            hints: [bi("expand = nhân phá ngoặc", "4 tích: x·x, x·4, 2·x, 2·4."), bi("x² + 4x + 2x + 8", "x² + 4x + 2x + 8"), bi("x² + 6x + 8", "x² + 6x + 8")],
            explain: bi("x² + 4x + 2x + 8 = x² + 6x + 8.", "x² + 4x + 2x + 8 = x² + 6x + 8."),
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
      accept: ["expand"],
      prompt: bi("Type the English verb for “nhân phá ngoặc / khai triển”.", "Gõ động từ tiếng Anh của “nhân phá ngoặc / khai triển”."),
      hints: [bi("It starts with “ex-”.", "Bắt đầu bằng “ex-”."), bi("ex _ _ _ d", "ex _ _ _ d"), bi("expand", "expand")],
      explain: bi("expand /ɪkˈspænd/ = khai triển, nhân phá ngoặc", "expand /ɪkˈspænd/ = khai triển, nhân phá ngoặc"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 2,
      skill: "math",
      answer: 1,
      prompt: bi("How many products do you get before collecting like terms in (a + b)(c + d + e)?", "Khi nhân (a + b)(c + d + e), trước khi thu gọn có bao nhiêu tích?"),
      options: ["5", "6", "4", "3"].map((t) => bi(t, t)),
      hints: [bi("each term × each term", "Mỗi hạng tử nhân với từng hạng tử."), bi("2 terms × 3 terms", "2 hạng tử × 3 hạng tử"), bi("2 × 3 = 6", "2 × 3 = 6")],
      explain: bi("2 × 3 = 6 products.", "2 × 3 = 6 tích."),
    },
  ],
  generators: [
    { level: 1, make: genMonoPoly },
    { level: 2, make: genBinomial },
    { level: 2, make: genGeneral },
    { level: 3, make: genIndependent },
    { level: 3, make: genArea },
  ],
  speak: [
    { en: "Multiply each term by the monomial.", vi: "Nhân từng hạng tử với đơn thức." },
    { en: "Multiply each term of one polynomial by each term of the other.", vi: "Nhân mỗi hạng tử của đa thức này với từng hạng tử của đa thức kia." },
    { en: "Then add the products and collect like terms.", vi: "Sau đó cộng các tích và thu gọn." },
    { en: "We expand the brackets.", vi: "Chúng ta nhân phá ngoặc." },
    { en: "The value does not depend on x.", vi: "Giá trị không phụ thuộc vào x." },
  ],
  summary: [
    bi("A(B + C) = AB + AC", "A(B + C) = AB + AC (nhân đơn thức với từng hạng tử)"),
    bi("(A + B)(C + D) = AC + AD + BC + BD", "(A + B)(C + D) = AC + AD + BC + BD"),
    bi("xᵐ · xⁿ = xᵐ⁺ⁿ; watch the signs: (−)·(−) = (+)", "xᵐ · xⁿ = xᵐ⁺ⁿ; chú ý dấu: (−)·(−) = (+)"),
  ],
};
