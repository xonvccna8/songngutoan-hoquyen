// Bài 5. Phép chia đa thức cho đơn thức — Dividing a polynomial by a monomial (Toán 8 KNTT, Chương I)
import { mono, nz, pick, S, val } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

const join = (ms: string[]) => ms.join(" + ").replace(/\+ -/g, "- ");

/** Đơn thức : đơn thức (chia hết) — tạo thương trước rồi nhân ngược lại để luôn chia hết */
function genMonoDiv(r: () => number): Question {
  const q = mono(nz(r, -6, 6), int(r, 0, 3), int(r, 0, 2));
  const d = mono(nz(r, -5, 5), int(r, 1, 2), int(r, 0, 2));
  const a = S(`(${q})*(${d})`);
  const ans = S(q);
  return {
    id: `g-mdiv-${q}|${d}`,
    type: "expr",
    form: "simplified",
    level: 1,
    skill: "math",
    answer: ans,
    prompt: bi(`Divide: ${a} : ${S(d)}`, `Thực hiện phép chia: ${a} : ${S(d)}`),
    hints: [
      bi("quotient = thương", "Chia hệ số cho hệ số, chia luỹ thừa cho luỹ thừa cùng biến."),
      bi("xᵐ : xⁿ = xᵐ⁻ⁿ (subtract the exponents); x⁰ = 1", "xᵐ : xⁿ = xᵐ⁻ⁿ (trừ số mũ); x⁰ = 1."),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${a} : ${S(d)} = ${ans}`, `${a} : ${S(d)} = ${ans}`),
  };
}

/** Đa thức : đơn thức */
function genPolyDiv(r: () => number): Question {
  const d = mono(nz(r, 2, 5) * (r() < 0.3 ? -1 : 1), 1, int(r, 0, 1));
  const qs = shuffle([[2, 0], [1, 0], [0, 0], [1, 1], [0, 1]], r)
    .slice(0, 3)
    .map(([a, b]) => mono(nz(r, -5, 5), a, b));
  const quotient = join(qs);
  const dividend = S(`(${quotient})*(${d})`);
  const ans = S(quotient);
  return {
    id: `g-pdiv-${quotient}|${d}`,
    type: "expr",
    form: "simplified",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Divide: (${dividend}) : ${S(d)}`, `Thực hiện phép chia: (${dividend}) : ${S(d)}`),
    hints: [
      bi("divide each term = chia từng hạng tử", "Chia TỪNG hạng tử của đa thức cho đơn thức rồi cộng các kết quả."),
      bi("Careful with signs: (−) : (−) = (+).", "Cẩn thận với dấu: (−) : (−) = (+)."),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`(${dividend}) : ${S(d)} = ${ans}`, `(${dividend}) : ${S(d)} = ${ans}`),
  };
}

/** Có chia hết không? */
function genDivisible(r: () => number): Question {
  const cases: [string, string, boolean][] = [
    ["6x³y²", "2xy", true],
    ["4x²y", "2xy²", false],
    ["5x²", "x³", false],
    ["−9x⁴y³", "3x²y³", true],
    ["7xy", "7xy", true],
    ["8x³", "2y", false],
    ["10x²y²", "5x²y", true],
  ];
  const [a, b, ok] = pick(r, cases);
  return {
    id: `g-dvb-${a}|${b}`,
    type: "tf",
    level: 1,
    skill: "math",
    answer: ok,
    prompt: bi(`True or false: ${a} is divisible by ${b}.`, `Đúng hay sai: Đơn thức ${a} chia hết cho đơn thức ${b}.`),
    hints: [
      bi("divisible = chia hết", `A chia hết cho B khi mỗi biến của B đều có trong A với số mũ không lớn hơn.`),
      bi(`Compare the exponents of each variable in ${b} and in ${a}.`, `So sánh số mũ từng biến trong ${b} với trong ${a}.`),
      bi(ok ? "Every exponent fits → divisible." : "Some variable of B has a bigger exponent (or is missing in A) → not divisible.", ok ? "Số mũ đều phù hợp → chia hết." : "Có biến của B có số mũ lớn hơn (hoặc không có trong A) → không chia hết."),
    ],
    explain: bi(ok ? `True: ${a} is divisible by ${b}.` : `False: ${a} is not divisible by ${b}.`, ok ? `Đúng: ${a} chia hết cho ${b}.` : `Sai: ${a} không chia hết cho ${b}.`),
  };
}

/** Chia rồi tính giá trị */
function genDivValue(r: () => number): Question {
  const d = mono(nz(r, 2, 4), 1, 1);
  const quotient = join([mono(nz(r, -4, 4), 1, 0), mono(nz(r, -4, 4), 0, 1), mono(nz(r, -6, 6), 0, 0)]);
  const dividend = S(`(${quotient})*(${d})`);
  const x = nz(r, -3, 3);
  const y = nz(r, -3, 3);
  const qv = S(quotient);
  const v = val(quotient, { x, y });
  return {
    id: `g-dval-${quotient}|${d}|${x}_${y}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: v,
    prompt: bi(`Let Q = (${dividend}) : ${S(d)}. Find the value of Q at x = ${x}, y = ${y}.`, `Cho Q = (${dividend}) : ${S(d)}. Tính giá trị của Q tại x = ${x}, y = ${y}.`),
    hints: [
      bi("Divide first — it makes the calculation much easier.", "Chia trước cho gọn rồi mới thay số."),
      bi(`Q = ${qv}`, `Q = ${qv}`),
      bi(`Q = ${v}`, `Q = ${v}`),
    ],
    explain: bi(`Q = ${qv}; at x = ${x}, y = ${y}: Q = ${v}.`, `Q = ${qv}; tại x = ${x}, y = ${y}: Q = ${v}.`),
  };
}

export const CHIA_DA_THUC: LessonContent = {
  id: "k8-5",
  slug: "chia-da-thuc",
  title: bi("Dividing a polynomial by a monomial", "Phép chia đa thức cho đơn thức"),
  intro: bi(
    "Division undoes multiplication. If 2x·(3x − 5) = 6x² − 10x, then (6x² − 10x) : 2x = 3x − 5. Let's learn when we can divide, and how.",
    "Phép chia ngược với phép nhân. Nếu 2x·(3x − 5) = 6x² − 10x thì (6x² − 10x) : 2x = 3x − 5. Cùng học khi nào chia được và chia như thế nào.",
  ),
  goals: [bi("Know when a monomial is divisible by a monomial.", "Biết khi nào đơn thức chia hết cho đơn thức."), bi("Divide a monomial by a monomial.", "Chia đơn thức cho đơn thức."), bi("Divide a polynomial by a monomial.", "Chia đa thức cho đơn thức.")],
  terms: [
    { id: "divide", en: "divide", ipa: "/dɪˈvaɪd/", vi: "chia", example: bi("Divide 6x² by 2x.", "Chia 6x² cho 2x.") },
    { id: "quotient", en: "quotient", ipa: "/ˈkwəʊʃnt/", vi: "thương", example: bi("The quotient is 3x.", "Thương là 3x.") },
    { id: "divisible", en: "divisible", ipa: "/dɪˈvɪzəbl/", vi: "chia hết", example: bi("6x³y² is divisible by 2xy.", "6x³y² chia hết cho 2xy.") },
    { id: "dividend", en: "dividend", ipa: "/ˈdɪvɪdend/", vi: "số bị chia", example: bi("In A : B, A is the dividend.", "Trong A : B, A là số bị chia.") },
    { id: "divisor", en: "divisor", ipa: "/dɪˈvaɪzə(r)/", vi: "số chia", example: bi("In A : B, B is the divisor.", "Trong A : B, B là số chia.") },
    { id: "divide-each", en: "divide each term", ipa: "/dɪˈvaɪd iːtʃ tɜːm/", vi: "chia từng hạng tử", example: bi("Divide each term by 2x.", "Chia từng hạng tử cho 2x.") },
    { id: "subtract-exp", en: "subtract the exponents", ipa: "/səbˈtrækt ði ɪkˈspəʊnənts/", vi: "trừ các số mũ", example: bi("x⁵ : x² = x³: subtract the exponents.", "x⁵ : x² = x³: trừ các số mũ.") },
    { id: "not-greater", en: "not greater than", ipa: "/nɒt ˈɡreɪtə ðæn/", vi: "không lớn hơn", example: bi("Each exponent of B is not greater than in A.", "Mỗi số mũ của B không lớn hơn trong A.") },
    { id: "power-zero", en: "to the power of zero", ipa: "/tə ðə ˈpaʊər əv ˈzɪərəʊ/", vi: "luỹ thừa bậc 0", example: bi("x to the power of zero equals 1.", "x mũ 0 bằng 1.") },
  ],
  sections: [
    {
      id: "don-chia-don",
      title: bi("Monomial : monomial", "Chia đơn thức cho đơn thức"),
      blocks: [
        {
          kind: "key",
          tag: bi("When is it divisible?", "Khi nào chia hết?"),
          text: bi("Monomial A is divisible by monomial B (B ≠ 0) when every variable of B is in A with an exponent not greater than in A.", "Đơn thức A chia hết cho đơn thức B (B ≠ 0) khi mỗi biến của B đều là biến của A với số mũ không lớn hơn số mũ của nó trong A."),
        },
        { kind: "key", tag: bi("Rule", "Quy tắc"), tone: "sun", text: bi("Divide the coefficients, then divide the powers of each variable: xᵐ : xⁿ = xᵐ⁻ⁿ (m ≥ n), x⁰ = 1.", "Chia hệ số của A cho hệ số của B, chia luỹ thừa của từng biến: xᵐ : xⁿ = xᵐ⁻ⁿ (m ≥ n), x⁰ = 1.") },
        {
          kind: "example",
          problem: bi("Divide: 12x³y² : 4xy", "Thực hiện phép chia: 12x³y² : 4xy"),
          steps: [bi("Coefficients: 12 : 4 = 3", "Hệ số: 12 : 4 = 3"), bi("x³ : x = x², y² : y = y", "x³ : x = x², y² : y = y"), bi("Result: 3x²y", "Kết quả: 3x²y")],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "expr",
            form: "simplified",
            level: 1,
            skill: "math",
            answer: "−5x²",
            prompt: bi("Divide: 15x⁴y : (−3x²y)", "Thực hiện phép chia: 15x⁴y : (−3x²y)"),
            hints: [bi("quotient = thương", "15 : (−3) = −5."), bi("x⁴ : x² = x²; y : y = 1", "x⁴ : x² = x²; y : y = 1"), bi("−5x²", "−5x²")],
            explain: bi("15x⁴y : (−3x²y) = −5x².", "15x⁴y : (−3x²y) = −5x²."),
          },
        },
      ],
    },
    {
      id: "da-chia-don",
      title: bi("Polynomial : monomial", "Chia đa thức cho đơn thức"),
      blocks: [
        { kind: "key", tag: bi("Rule", "Quy tắc"), text: bi("Divide each term of the polynomial by the monomial, then add the results. (Each term must be divisible.)", "Muốn chia đa thức A cho đơn thức B (mọi hạng tử của A đều chia hết cho B), ta chia từng hạng tử của A cho B rồi cộng các kết quả với nhau.") },
        {
          kind: "example",
          problem: bi("Divide: (6x³ − 9x² + 3x) : 3x", "Thực hiện phép chia: (6x³ − 9x² + 3x) : 3x"),
          steps: [bi("6x³ : 3x = 2x²", "6x³ : 3x = 2x²"), bi("−9x² : 3x = −3x", "−9x² : 3x = −3x"), bi("3x : 3x = 1 → result 2x² − 3x + 1", "3x : 3x = 1 → kết quả 2x² − 3x + 1")],
        },
        { kind: "key", tag: bi("Check", "Thử lại"), tone: "teal", text: bi("Multiply back: 3x·(2x² − 3x + 1) = 6x³ − 9x² + 3x ✓", "Nhân ngược lại: 3x·(2x² − 3x + 1) = 6x³ − 9x² + 3x ✓") },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "expr",
            form: "simplified",
            level: 2,
            skill: "math",
            answer: "2x² − x + 3",
            prompt: bi("Divide: (8x³ − 4x² + 12x) : 4x", "Thực hiện phép chia: (8x³ − 4x² + 12x) : 4x"),
            hints: [bi("divide each term = chia từng hạng tử", "Chia từng hạng tử cho 4x."), bi("8x³ : 4x = 2x²; −4x² : 4x = −x; 12x : 4x = 3", "8x³ : 4x = 2x²; −4x² : 4x = −x; 12x : 4x = 3"), bi("2x² − x + 3", "2x² − x + 3")],
            explain: bi("2x² − x + 3.", "2x² − x + 3."),
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
      accept: ["quotient", "the quotient"],
      prompt: bi("Type the English word for “thương” (result of a division).", "Gõ từ tiếng Anh của “thương” (kết quả phép chia)."),
      hints: [bi("It starts with “qu-”.", "Bắt đầu bằng “qu-”."), bi("quo-tient", "quo-tient"), bi("quotient", "quotient")],
      explain: bi("quotient /ˈkwəʊʃnt/ = thương", "quotient /ˈkwəʊʃnt/ = thương"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 2,
      skill: "math",
      answer: 2,
      prompt: bi("For which n is xⁿ divisible by x³?", "Với số tự nhiên n nào thì xⁿ chia hết cho x³?"),
      options: ["n = 0", "n = 2", "n ≥ 3", "n < 3"].map((t) => bi(t, t)),
      hints: [bi("divisible = chia hết", "Số mũ của số chia không được lớn hơn."), bi("n must be at least 3.", "n phải lớn hơn hoặc bằng 3."), bi("n ≥ 3", "n ≥ 3")],
      explain: bi("xⁿ is divisible by x³ when n ≥ 3.", "xⁿ chia hết cho x³ khi n ≥ 3."),
    },
  ],
  generators: [
    { level: 1, make: genMonoDiv },
    { level: 1, make: genDivisible },
    { level: 2, make: genPolyDiv },
    { level: 3, make: genDivValue },
  ],
  speak: [
    { en: "Divide the coefficients and subtract the exponents.", vi: "Chia các hệ số và trừ các số mũ." },
    { en: "Divide each term of the polynomial by the monomial.", vi: "Chia từng hạng tử của đa thức cho đơn thức." },
    { en: "Check your answer by multiplying back.", vi: "Kiểm tra đáp án bằng cách nhân ngược lại." },
    { en: "Any number to the power of zero equals one.", vi: "Mọi số khác không mũ không đều bằng một." },
    { en: "The quotient is a polynomial.", vi: "Thương là một đa thức." },
  ],
  summary: [
    bi("A divisible by B: every variable of B is in A with an exponent not greater than in A.", "A chia hết cho B: mỗi biến của B có trong A với số mũ không lớn hơn."),
    bi("xᵐ : xⁿ = xᵐ⁻ⁿ (m ≥ n); x⁰ = 1", "xᵐ : xⁿ = xᵐ⁻ⁿ (m ≥ n); x⁰ = 1"),
    bi("(A + B) : C = A : C + B : C", "(A + B) : C = A : C + B : C (chia từng hạng tử)"),
    bi("Check: quotient × divisor = dividend.", "Thử lại: thương × số chia = số bị chia."),
  ],
};
