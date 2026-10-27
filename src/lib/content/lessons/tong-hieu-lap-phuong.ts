// Bài 8. Tổng và hiệu hai lập phương — Sum and difference of two cubes (Toán 8 KNTT, Chương II)
import { S } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

/** Thừa số bậc hai: k²x² ∓ k·a·x + a² (dạng đẹp) */
const quad = (k: number, a: number, sign: "+" | "−") => S(`(${k}x)^2 ${sign === "+" ? "+" : "-"} ${k * a}x + ${a * a}`);
const lin = (k: number, a: number, sign: "+" | "−") => `${k === 1 ? "" : k}x ${sign} ${a}`;

/** Phân tích x³ ± a³ (hoặc (kx)³ ± a³) */
function genFactor(r: () => number, level: 1 | 2): Question {
  const k = level === 1 ? 1 : int(r, 2, 3);
  const a = int(r, 1, level === 1 ? 5 : 3);
  const plus = r() < 0.5;
  const src = S(`(${k}x)^3 ${plus ? "+" : "-"} ${a ** 3}`);
  const ans = plus ? `(${lin(k, a, "+")})(${quad(k, a, "−")})` : `(${lin(k, a, "−")})(${quad(k, a, "+")})`;
  return {
    id: `g-fc-${k}-${a}-${plus}`,
    type: "expr",
    form: "factored",
    level,
    skill: "math",
    answer: ans,
    prompt: bi(`Write as a product: ${src}`, `Viết dưới dạng tích: ${src}`),
    hints: [
      bi(plus ? "sum of two cubes = tổng hai lập phương" : "difference of two cubes = hiệu hai lập phương", plus ? "A³ + B³ = (A + B)(A² − AB + B²)" : "A³ − B³ = (A − B)(A² + AB + B²)"),
      bi(`A = ${k === 1 ? "x" : `${k}x`}, B = ${a} (since ${a ** 3} = ${a}³)`, `A = ${k === 1 ? "x" : `${k}x`}, B = ${a} (vì ${a ** 3} = ${a}³)`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Nhân (x ± a)(x² ∓ ax + a²) → x³ ± a³ */
function genExpand(r: () => number): Question {
  const a = int(r, 1, 5);
  const plus = r() < 0.5;
  const src = plus ? `(x + ${a})(${quad(1, a, "−")})` : `(x − ${a})(${quad(1, a, "+")})`;
  const ans = S(src);
  return {
    id: `g-ec-${a}-${plus}`,
    type: "expr",
    form: "expanded",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Calculate: ${src}`, `Tính: ${src}`),
    hints: [
      bi("Recognise an identity before multiplying!", "Nhận ra hằng đẳng thức trước khi nhân!"),
      bi(plus ? "(A + B)(A² − AB + B²) = A³ + B³" : "(A − B)(A² + AB + B²) = A³ − B³", plus ? "(A + B)(A² − AB + B²) = A³ + B³" : "(A − B)(A² + AB + B²) = A³ − B³"),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Rút gọn: biểu thức không phụ thuộc x */
function genConst(r: () => number): Question {
  const a = int(r, 1, 4);
  const plus = r() < 0.5;
  const src = plus ? `(x + ${a})(${quad(1, a, "−")}) − x³` : `(x − ${a})(${quad(1, a, "+")}) − x³`;
  const v = plus ? a ** 3 : -(a ** 3);
  return {
    id: `g-cc-${a}-${plus}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: v,
    prompt: bi(`Show that ${src} does not depend on x. What is its value?`, `Chứng tỏ ${src} không phụ thuộc vào x. Giá trị của nó bằng bao nhiêu?`),
    hints: [
      bi("Use the sum/difference of two cubes for the product.", "Dùng hằng đẳng thức tổng/hiệu hai lập phương cho tích."),
      bi(`The product = x³ ${plus ? "+" : "−"} ${a ** 3}.`, `Tích = x³ ${plus ? "+" : "−"} ${a ** 3}.`),
      bi(`x³ ${plus ? "+" : "−"} ${a ** 3} − x³ = ${v}`, `x³ ${plus ? "+" : "−"} ${a ** 3} − x³ = ${v}`),
    ],
    explain: bi(`The x³ terms cancel out, leaving ${v}.`, `Các hạng tử x³ triệt tiêu, còn lại ${v}.`),
  };
}

function genWhich(r: () => number): Question {
  const right = "A³ − B³ = (A − B)(A² + AB + B²)";
  const opts = shuffle([right, "A³ − B³ = (A − B)(A² − AB + B²)", "A³ − B³ = (A − B)³", "A³ − B³ = (A − B)(A² + 2AB + B²)"], r);
  return {
    id: "g-which-c3",
    type: "mcq",
    level: 1,
    skill: "math",
    answer: opts.indexOf(right),
    options: opts.map((o) => bi(o, o)),
    prompt: bi("Which identity is correct?", "Hằng đẳng thức nào đúng?"),
    hints: [bi("difference of two cubes = hiệu hai lập phương", "Ngoặc thứ hai có “bình phương thiếu”: A² + AB + B² (không có số 2)."), bi("For a difference, the sign before AB is +.", "Với hiệu hai lập phương, dấu trước AB là dấu +."), bi(right, right)],
    explain: bi(`${right}. Note: (A − B)³ is different!`, `${right}. Chú ý: (A − B)³ là hằng đẳng thức khác!`),
  };
}

export const TONG_HIEU_LAP_PHUONG: LessonContent = {
  id: "k8-8",
  slug: "tong-hieu-lap-phuong",
  title: bi("Sum and difference of two cubes", "Tổng và hiệu hai lập phương"),
  intro: bi(
    "x³ + 8 and x³ − 27 look hard to factorise — but two last identities turn them into products in one step. These complete the 7 identities you must know!",
    "x³ + 8 hay x³ − 27 trông khó phân tích — nhưng hai hằng đẳng thức cuối cùng biến chúng thành tích chỉ trong một bước. Đây là hai hằng đẳng thức khép lại bộ 7 hằng đẳng thức đáng nhớ!",
  ),
  goals: [bi("Use A³ + B³ and A³ − B³.", "Vận dụng A³ + B³ và A³ − B³."), bi("Factorise sums and differences of cubes.", "Phân tích tổng, hiệu hai lập phương thành tích.")],
  terms: [
    { id: "sum-cubes", en: "sum of two cubes", ipa: "/sʌm əv tuː kjuːbz/", vi: "tổng hai lập phương", example: bi("x³ + 8 is a sum of two cubes.", "x³ + 8 là tổng hai lập phương.") },
    { id: "diff-cubes", en: "difference of two cubes", ipa: "/ˈdɪfrəns əv tuː kjuːbz/", vi: "hiệu hai lập phương", example: bi("x³ − 27 is a difference of two cubes.", "x³ − 27 là hiệu hai lập phương.") },
    { id: "incomplete-square", en: "incomplete square", ipa: "/ˌɪnkəmˈpliːt skweə(r)/", vi: "bình phương thiếu", example: bi("A² − AB + B² is an incomplete square.", "A² − AB + B² là bình phương thiếu.") },
    { id: "factorise-c", en: "write as a product", ipa: "/raɪt æz ə ˈprɒdʌkt/", vi: "viết dưới dạng tích", example: bi("Write x³ + 8 as a product.", "Viết x³ + 8 dưới dạng tích.") },
    { id: "perfect-cube", en: "perfect cube", ipa: "/ˈpɜːfɪkt kjuːb/", vi: "số lập phương", example: bi("8, 27 and 64 are perfect cubes.", "8, 27, 64 là các số lập phương.") },
    { id: "bracket-first", en: "first bracket", ipa: "/fɜːst ˈbrækɪt/", vi: "ngoặc thứ nhất", example: bi("The first bracket is A + B.", "Ngoặc thứ nhất là A + B.") },
    { id: "opposite-sign", en: "opposite sign", ipa: "/ˈɒpəzɪt saɪn/", vi: "dấu ngược lại", example: bi("The middle sign is the opposite sign.", "Dấu ở giữa là dấu ngược lại.") },
    { id: "seven-identities", en: "the seven identities", ipa: "/ðə ˈsevn aɪˈdentətiz/", vi: "bảy hằng đẳng thức đáng nhớ", example: bi("Learn the seven identities by heart.", "Học thuộc bảy hằng đẳng thức đáng nhớ.") },
  ],
  sections: [
    {
      id: "tong",
      title: bi("Sum of two cubes", "Tổng hai lập phương"),
      blocks: [
        { kind: "key", tag: bi("Identity 6", "Hằng đẳng thức 6"), tone: "sun", text: bi("A³ + B³ = (A + B)(A² − AB + B²)", "A³ + B³ = (A + B)(A² − AB + B²)") },
        { kind: "text", text: bi("A² − AB + B² is called an “incomplete square” (no 2 in front of AB).", "A² − AB + B² gọi là “bình phương thiếu” của hiệu (không có số 2 trước AB).") },
        {
          kind: "example",
          problem: bi("Write x³ + 8 as a product.", "Viết x³ + 8 dưới dạng tích."),
          steps: [bi("x³ + 8 = x³ + 2³: A = x, B = 2", "x³ + 8 = x³ + 2³: A = x, B = 2"), bi("= (x + 2)(x² − 2x + 4)", "= (x + 2)(x² − 2x + 4)")],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "expr",
            form: "factored",
            level: 1,
            skill: "math",
            answer: "(x + 1)(x² − x + 1)",
            prompt: bi("Write as a product: x³ + 1", "Viết dưới dạng tích: x³ + 1"),
            hints: [bi("1 = 1³", "1 = 1³"), bi("A = x, B = 1", "A = x, B = 1"), bi("(x + 1)(x² − x + 1)", "(x + 1)(x² − x + 1)")],
            explain: bi("x³ + 1 = (x + 1)(x² − x + 1).", "x³ + 1 = (x + 1)(x² − x + 1)."),
          },
        },
      ],
    },
    {
      id: "hieu",
      title: bi("Difference of two cubes", "Hiệu hai lập phương"),
      blocks: [
        { kind: "key", tag: bi("Identity 7", "Hằng đẳng thức 7"), tone: "sun", text: bi("A³ − B³ = (A − B)(A² + AB + B²)", "A³ − B³ = (A − B)(A² + AB + B²)") },
        { kind: "key", tag: bi("Tip", "Mẹo"), tone: "teal", text: bi("The sign in the first bracket is the same as in A³ ± B³; the sign of AB is the opposite.", "Dấu trong ngoặc thứ nhất giống dấu của A³ ± B³; dấu trước AB thì ngược lại.") },
        { kind: "key", tag: bi("Common mistake", "Lỗi hay gặp"), tone: "coral", text: bi("A³ − B³ ≠ (A − B)³ and A³ + B³ ≠ (A + B)³.", "A³ − B³ ≠ (A − B)³ và A³ + B³ ≠ (A + B)³.") },
        {
          kind: "example",
          problem: bi("Write 8x³ − 27 as a product.", "Viết 8x³ − 27 dưới dạng tích."),
          steps: [bi("8x³ − 27 = (2x)³ − 3³: A = 2x, B = 3", "8x³ − 27 = (2x)³ − 3³: A = 2x, B = 3"), bi("= (2x − 3)(4x² + 6x + 9)", "= (2x − 3)(4x² + 6x + 9)")],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "expr",
            form: "expanded",
            level: 2,
            skill: "math",
            answer: "x³ − 64",
            prompt: bi("Calculate: (x − 4)(x² + 4x + 16)", "Tính: (x − 4)(x² + 4x + 16)"),
            hints: [bi("Recognise A³ − B³.", "Nhận ra dạng (A − B)(A² + AB + B²)."), bi("A = x, B = 4", "A = x, B = 4"), bi("x³ − 64", "x³ − 64")],
            explain: bi("(x − 4)(x² + 4x + 16) = x³ − 4³ = x³ − 64.", "(x − 4)(x² + 4x + 16) = x³ − 4³ = x³ − 64."),
          },
        },
      ],
    },
  ],
  practice: [
    {
      id: "p1",
      type: "mcq",
      level: 1,
      skill: "lang",
      answer: 2,
      prompt: bi("“Hiệu hai lập phương” in English is…", "“Hiệu hai lập phương” trong tiếng Anh là…"),
      options: ["cube of a difference", "difference of two squares", "difference of two cubes", "sum of two cubes"].map((t) => bi(t, t)),
      hints: [bi("hiệu = difference; lập phương = cube", "hiệu = difference; lập phương = cube"), bi("hai lập phương = two cubes", "hai lập phương = two cubes"), bi("difference of two cubes", "difference of two cubes")],
      explain: bi("A³ − B³ is a difference of two cubes; (A − B)³ is a cube of a difference.", "A³ − B³ là hiệu hai lập phương; (A − B)³ là lập phương của một hiệu."),
    },
    {
      id: "p2",
      type: "tf",
      level: 2,
      skill: "math",
      answer: false,
      prompt: bi("True or false: x³ + 8 = (x + 2)³", "Đúng hay sai: x³ + 8 = (x + 2)³"),
      hints: [bi("Expand (x + 2)³.", "Khai triển (x + 2)³."), bi("(x + 2)³ = x³ + 6x² + 12x + 8", "(x + 2)³ = x³ + 6x² + 12x + 8"), bi("Different!", "Khác nhau!")],
      explain: bi("False: x³ + 8 = (x + 2)(x² − 2x + 4).", "Sai: x³ + 8 = (x + 2)(x² − 2x + 4)."),
    },
  ],
  generators: [
    { level: 1, make: (r) => genFactor(r, 1) },
    { level: 1, make: genWhich },
    { level: 2, make: (r) => genFactor(r, 2) },
    { level: 2, make: genExpand },
    { level: 3, make: genConst },
  ],
  speak: [
    { en: "This is a sum of two cubes.", vi: "Đây là tổng hai lập phương." },
    { en: "This is a difference of two cubes.", vi: "Đây là hiệu hai lập phương." },
    { en: "The second bracket is an incomplete square.", vi: "Ngoặc thứ hai là bình phương thiếu." },
    { en: "Eight is two cubed.", vi: "Tám là lập phương của hai." },
    { en: "Learn the seven identities by heart.", vi: "Hãy học thuộc bảy hằng đẳng thức đáng nhớ." },
  ],
  summary: [
    bi("A³ + B³ = (A + B)(A² − AB + B²)", "A³ + B³ = (A + B)(A² − AB + B²)"),
    bi("A³ − B³ = (A − B)(A² + AB + B²)", "A³ − B³ = (A − B)(A² + AB + B²)"),
    bi("Perfect cubes: 1, 8, 27, 64, 125; (2x)³ = 8x³", "Số lập phương: 1, 8, 27, 64, 125; (2x)³ = 8x³"),
  ],
};
