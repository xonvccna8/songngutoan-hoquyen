// Bài 6. Hiệu hai bình phương. Bình phương của một tổng hay một hiệu (Toán 8 KNTT, Chương II)
import { bin, nz, pick, S } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

/** Khai triển (x ± a)² */
function genSquare(r: () => number): Question {
  const a = nz(r, -9, 9);
  const src = `(${bin(a)})²`;
  const ans = S(src);
  const sumCase = a > 0;
  return {
    id: `g-sq-${a}`,
    type: "expr",
    form: "expanded",
    level: 1,
    skill: "math",
    answer: ans,
    prompt: bi(`Expand: ${src}`, `Khai triển: ${src}`),
    hints: [
      bi(sumCase ? "square of a sum = bình phương của một tổng" : "square of a difference = bình phương của một hiệu", sumCase ? "(A + B)² = A² + 2AB + B²" : "(A − B)² = A² − 2AB + B²"),
      bi(`A = x, B = ${Math.abs(a)}`, `A = x, B = ${Math.abs(a)}`),
      bi(`= x² ${sumCase ? "+" : "−"} 2·x·${Math.abs(a)} + ${Math.abs(a)}² = ${ans}`, `= x² ${sumCase ? "+" : "−"} 2·x·${Math.abs(a)} + ${Math.abs(a)}² = ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Khai triển (kx ± c)² hoặc (x ± cy)² */
function genSquareGeneral(r: () => number): Question {
  const k = int(r, 2, 5);
  const c = nz(r, -7, 7);
  const withY = r() < 0.35;
  const src = withY ? `(x ${c < 0 ? "−" : "+"} ${Math.abs(c)}y)²` : `(${bin(c, "x", k)})²`;
  const ans = S(src);
  return {
    id: `g-sqg-${k}-${c}-${withY}`,
    type: "expr",
    form: "expanded",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Expand: ${src}`, `Khai triển: ${src}`),
    hints: [
      bi("Find A and B first.", withY ? `A = x, B = ${Math.abs(c)}y` : `A = ${k}x, B = ${Math.abs(c)}`),
      bi("Careful: (kx)² = k²x², and the middle term is 2·A·B.", "Cẩn thận: (kx)² = k²x², hạng tử giữa là 2·A·B."),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Phân tích hiệu hai bình phương */
function genDiffSquares(r: () => number): Question {
  const k = pick(r, [1, 1, 2, 3]);
  const a = int(r, 1, 9);
  const src = S(`(${k}x)^2 - ${a * a}`);
  const ans = `(${bin(a, "x", k)})(${bin(-a, "x", k)})`;
  return {
    id: `g-dsq-${k}-${a}`,
    type: "expr",
    form: "factored",
    level: 1,
    skill: "math",
    answer: ans,
    prompt: bi(`Write as a product: ${src}`, `Viết dưới dạng tích: ${src}`),
    hints: [
      bi("difference of two squares = hiệu hai bình phương", "A² − B² = (A + B)(A − B)"),
      bi(`${src} = (${k === 1 ? "x" : `${k}x`})² − ${a}²`, `${src} = (${k === 1 ? "x" : `${k}x`})² − ${a}²`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Viết thành bình phương của một tổng/hiệu */
function genToSquare(r: () => number): Question {
  const a = nz(r, -8, 8);
  const src = S(`(x + ${a})^2`);
  const ans = `(${bin(a)})²`;
  return {
    id: `g-tosq-${a}`,
    type: "expr",
    form: "factored",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Write as a square: ${src}`, `Viết dưới dạng bình phương: ${src}`),
    hints: [
      bi("Look for A² + 2AB + B² (or A² − 2AB + B²).", "Nhận ra dạng A² + 2AB + B² (hoặc A² − 2AB + B²)."),
      bi(`A = x, B = ${Math.abs(a)} because ${a * a} = ${Math.abs(a)}² and ${Math.abs(2 * a)}x = 2·x·${Math.abs(a)}`, `A = x, B = ${Math.abs(a)} vì ${a * a} = ${Math.abs(a)}² và ${Math.abs(2 * a)}x = 2·x·${Math.abs(a)}`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Tính nhẩm bằng hằng đẳng thức */
function genMental(r: () => number): Question {
  const kind = int(r, 0, 2);
  const base = pick(r, [20, 30, 40, 50, 60, 70, 100]);
  const d = int(r, 1, 3);
  let text = "",
    ans = 0,
    how = "";
  if (kind === 0) {
    text = `${base + d}²`;
    ans = (base + d) ** 2;
    how = `(${base} + ${d})² = ${base * base} + ${2 * base * d} + ${d * d}`;
  } else if (kind === 1) {
    text = `${base - d}²`;
    ans = (base - d) ** 2;
    how = `(${base} − ${d})² = ${base * base} − ${2 * base * d} + ${d * d}`;
  } else {
    text = `${base + d} · ${base - d}`;
    ans = (base + d) * (base - d);
    how = `(${base} + ${d})(${base} − ${d}) = ${base}² − ${d}² = ${base * base} − ${d * d}`;
  }
  return {
    id: `g-ment-${kind}-${base}-${d}`,
    type: "number",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Calculate quickly (no calculator): ${text}`, `Tính nhanh (không dùng máy tính): ${text}`),
    hints: [
      bi(`Write the numbers near ${base}.`, `Viết các số theo ${base} (số tròn).`),
      bi(kind === 2 ? "Use A² − B² = (A + B)(A − B)." : "Use (A ± B)² = A² ± 2AB + B².", kind === 2 ? "Dùng (A + B)(A − B) = A² − B²." : "Dùng (A ± B)² = A² ± 2AB + B²."),
      bi(`${how} = ${ans}`, `${how} = ${ans}`),
    ],
    explain: bi(`${how} = ${ans}`, `${how} = ${ans}`),
  };
}

/** Rút gọn biểu thức có hai hằng đẳng thức */
function genTwoSquares(r: () => number): Question {
  const a = int(r, 1, 6);
  const minus = r() < 0.5;
  const src = minus ? `(x + ${a})² − (x − ${a})²` : `(x + ${a})² + (x − ${a})²`;
  const ans = S(src);
  return {
    id: `g-two-${a}-${minus}`,
    type: "expr",
    form: "simplified",
    level: 3,
    skill: "math",
    answer: ans,
    prompt: bi(`Simplify: ${src}`, `Rút gọn: ${src}`),
    hints: [
      bi("Expand each square, then collect like terms.", "Khai triển từng bình phương rồi thu gọn."),
      bi(`(x + ${a})² = ${S(`(x+${a})^2`)}; (x − ${a})² = ${S(`(x-${a})^2`)}`, `(x + ${a})² = ${S(`(x+${a})^2`)}; (x − ${a})² = ${S(`(x-${a})^2`)}`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Giá trị biểu thức tại số "đẹp" */
function genNiceValue(r: () => number): Question {
  const a = int(r, 1, 9);
  const x = 100 - a;
  const src = S(`(x + ${a})^2`);
  return {
    id: `g-nice-${a}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: 10000,
    prompt: bi(`Find the value of ${src} at x = ${x}.`, `Tính giá trị của ${src} tại x = ${x}.`),
    hints: [
      bi("Do not substitute straight away! Look for an identity.", "Đừng thay số ngay! Hãy nhận ra hằng đẳng thức."),
      bi(`${src} = (x + ${a})²`, `${src} = (x + ${a})²`),
      bi(`= (${x} + ${a})² = 100² = 10000`, `= (${x} + ${a})² = 100² = 10000`),
    ],
    explain: bi(`(${x} + ${a})² = 100² = 10000.`, `(${x} + ${a})² = 100² = 10000.`),
  };
}

/** Nhận ra hằng đẳng thức đúng */
function genWhich(r: () => number): Question {
  const right = "(A − B)² = A² − 2AB + B²";
  const opts = shuffle([right, "(A − B)² = A² − B²", "(A − B)² = A² + 2AB − B²", "(A − B)² = A² − 2AB − B²"], r);
  return {
    id: "g-which-sq",
    type: "mcq",
    level: 1,
    skill: "math",
    answer: opts.indexOf(right),
    options: opts.map((o) => bi(o, o)),
    prompt: bi("Which identity is correct?", "Hằng đẳng thức nào đúng?"),
    hints: [bi("square of a difference = bình phương của một hiệu", "(A − B)² = (A − B)(A − B)"), bi("Expand: 4 products.", "Nhân ra: 4 tích."), bi(right, right)],
    explain: bi(`${right}. Note: (A − B)² ≠ A² − B²!`, `${right}. Chú ý: (A − B)² ≠ A² − B²!`),
  };
}

export const BINH_PHUONG: LessonContent = {
  id: "k8-6",
  slug: "binh-phuong",
  title: bi("Difference of two squares. Square of a sum or a difference", "Hiệu hai bình phương. Bình phương của một tổng hay một hiệu"),
  intro: bi(
    "Some products appear so often that we learn them by heart: identities. With them you can calculate 99² in your head and factorise polynomials quickly!",
    "Có những phép nhân xuất hiện nhiều đến mức ta học thuộc: đó là hằng đẳng thức. Nhờ chúng, em tính nhẩm được 99² và phân tích đa thức thật nhanh!",
  ),
  goals: [bi("Recognise identities.", "Nhận biết đồng nhất thức, hằng đẳng thức."), bi("Use (A + B)², (A − B)², A² − B².", "Vận dụng (A + B)², (A − B)², A² − B²."), bi("Calculate quickly with identities.", "Tính nhanh bằng hằng đẳng thức.")],
  terms: [
    { id: "identity", en: "identity", ipa: "/aɪˈdentəti/", vi: "hằng đẳng thức, đồng nhất thức", example: bi("(a + b)² = a² + 2ab + b² is an identity.", "(a + b)² = a² + 2ab + b² là một hằng đẳng thức.") },
    { id: "square-num", en: "square (of a number)", ipa: "/skweə(r)/", vi: "bình phương", example: bi("The square of 5 is 25.", "Bình phương của 5 là 25.") },
    { id: "squared", en: "squared", ipa: "/skweəd/", vi: "bình phương (cách đọc)", example: bi("x² is read “x squared”.", "x² đọc là “x squared”.") },
    { id: "square-sum", en: "square of a sum", ipa: "/skweər əv ə sʌm/", vi: "bình phương của một tổng", example: bi("(a + b)² is the square of a sum.", "(a + b)² là bình phương của một tổng.") },
    { id: "square-diff", en: "square of a difference", ipa: "/skweər əv ə ˈdɪfrəns/", vi: "bình phương của một hiệu", example: bi("(a − b)² is the square of a difference.", "(a − b)² là bình phương của một hiệu.") },
    { id: "diff-squares", en: "difference of two squares", ipa: "/ˈdɪfrəns əv tuː skweəz/", vi: "hiệu hai bình phương", example: bi("a² − b² is a difference of two squares.", "a² − b² là hiệu hai bình phương.") },
    { id: "by-heart", en: "learn by heart", ipa: "/lɜːn baɪ hɑːt/", vi: "học thuộc", example: bi("Learn the identities by heart.", "Hãy học thuộc các hằng đẳng thức.") },
    { id: "middle-term", en: "middle term", ipa: "/ˈmɪdl tɜːm/", vi: "hạng tử ở giữa", example: bi("The middle term is 2ab.", "Hạng tử ở giữa là 2ab.") },
    { id: "mental", en: "calculate in your head", ipa: "/ˈkælkjuleɪt ɪn jɔː hed/", vi: "tính nhẩm", example: bi("Calculate 99² in your head.", "Tính nhẩm 99².") },
    { id: "true-for-all", en: "true for all values", ipa: "/truː fər ɔːl ˈvæljuːz/", vi: "đúng với mọi giá trị", example: bi("An identity is true for all values of the variables.", "Hằng đẳng thức đúng với mọi giá trị của biến.") },
  ],
  sections: [
    {
      id: "hang-dang-thuc",
      title: bi("What is an identity?", "Hằng đẳng thức là gì?"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("An identity is an equality A = B that is true for all values of the variables.", "Hằng đẳng thức (đồng nhất thức) là đẳng thức A = B đúng với mọi giá trị của các biến.") },
        { kind: "list", tag: bi("Examples", "Ví dụ"), items: [bi("x(x + 1) = x² + x is an identity (true for every x).", "x(x + 1) = x² + x là hằng đẳng thức (đúng với mọi x)."), bi("x + 1 = 3 is NOT an identity (only true for x = 2).", "x + 1 = 3 KHÔNG phải hằng đẳng thức (chỉ đúng khi x = 2).")] },
      ],
    },
    {
      id: "binh-phuong-tong-hieu",
      title: bi("Square of a sum, square of a difference", "Bình phương của một tổng, một hiệu"),
      blocks: [
        { kind: "key", tag: bi("Identity 1", "Hằng đẳng thức 1"), tone: "sun", text: bi("(A + B)² = A² + 2AB + B²", "(A + B)² = A² + 2AB + B²") },
        { kind: "key", tag: bi("Identity 2", "Hằng đẳng thức 2"), tone: "sun", text: bi("(A − B)² = A² − 2AB + B²", "(A − B)² = A² − 2AB + B²") },
        { kind: "area", variant: "sum" },
        {
          kind: "example",
          problem: bi("Expand (2x − 3)².", "Khai triển (2x − 3)²."),
          steps: [bi("A = 2x, B = 3.", "A = 2x, B = 3."), bi("(2x)² − 2·2x·3 + 3²", "(2x)² − 2·2x·3 + 3²"), bi("= 4x² − 12x + 9", "= 4x² − 12x + 9")],
        },
        { kind: "key", tag: bi("Common mistake", "Lỗi hay gặp"), tone: "coral", text: bi("(A + B)² ≠ A² + B². Don't forget the middle term 2AB!", "(A + B)² ≠ A² + B². Đừng quên hạng tử 2AB ở giữa!") },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "expr",
            form: "expanded",
            level: 1,
            skill: "math",
            answer: "x² + 10x + 25",
            prompt: bi("Expand: (x + 5)²", "Khai triển: (x + 5)²"),
            hints: [bi("square of a sum = bình phương của một tổng", "A = x, B = 5."), bi("x² + 2·x·5 + 5²", "x² + 2·x·5 + 5²"), bi("x² + 10x + 25", "x² + 10x + 25")],
            explain: bi("(x + 5)² = x² + 10x + 25.", "(x + 5)² = x² + 10x + 25."),
          },
        },
      ],
    },
    {
      id: "hieu-hai-binh-phuong",
      title: bi("Difference of two squares", "Hiệu hai bình phương"),
      blocks: [
        { kind: "key", tag: bi("Identity 3", "Hằng đẳng thức 3"), tone: "sun", text: bi("A² − B² = (A + B)(A − B)", "A² − B² = (A + B)(A − B)") },
        { kind: "area", variant: "diff" },
        {
          kind: "example",
          problem: bi("Calculate quickly: 51 · 49.", "Tính nhanh: 51 · 49."),
          steps: [bi("51 · 49 = (50 + 1)(50 − 1)", "51 · 49 = (50 + 1)(50 − 1)"), bi("= 50² − 1²", "= 50² − 1²"), bi("= 2500 − 1 = 2499", "= 2500 − 1 = 2499")],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "expr",
            form: "factored",
            level: 1,
            skill: "math",
            answer: "(x + 4)(x − 4)",
            prompt: bi("Write as a product: x² − 16", "Viết dưới dạng tích: x² − 16"),
            hints: [bi("difference of two squares = hiệu hai bình phương", "x² − 16 = x² − 4²"), bi("A = x, B = 4", "A = x, B = 4"), bi("(x + 4)(x − 4)", "(x + 4)(x − 4)")],
            explain: bi("x² − 16 = (x + 4)(x − 4).", "x² − 16 = (x + 4)(x − 4)."),
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
      accept: ["identity", "an identity"],
      prompt: bi("Type the English word for “hằng đẳng thức”.", "Gõ từ tiếng Anh của “hằng đẳng thức”."),
      hints: [bi("It starts with “i-”.", "Bắt đầu bằng “i-”."), bi("i-den-ti-ty", "i-den-ti-ty"), bi("identity", "identity")],
      explain: bi("identity /aɪˈdentəti/ = hằng đẳng thức", "identity /aɪˈdentəti/ = hằng đẳng thức"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 2,
      skill: "lang",
      answer: 0,
      prompt: bi("How do you read (a + b)² in English?", "Đọc (a + b)² bằng tiếng Anh thế nào?"),
      options: ["a plus b, all squared", "a squared plus b", "a plus b squared times two", "a times b squared"].map((t) => bi(t, t)),
      hints: [bi("squared = bình phương", "Cả tổng (a + b) được bình phương."), bi("“all squared” = cả biểu thức bình phương", "“all squared” = bình phương cả tổng"), bi("a plus b, all squared", "a plus b, all squared")],
      explain: bi("(a + b)² = “a plus b, all squared” (or “the square of a plus b”).", "(a + b)² đọc là “a plus b, all squared” (hoặc “the square of a plus b”)."),
    },
  ],
  generators: [
    { level: 1, make: genSquare },
    { level: 1, make: genDiffSquares },
    { level: 1, make: genWhich },
    { level: 2, make: genSquareGeneral },
    { level: 2, make: genToSquare },
    { level: 2, make: genMental },
    { level: 3, make: genTwoSquares },
    { level: 3, make: genNiceValue },
  ],
  speak: [
    { en: "An identity is true for all values of the variables.", vi: "Hằng đẳng thức đúng với mọi giá trị của biến." },
    { en: "Do not forget the middle term.", vi: "Đừng quên hạng tử ở giữa." },
    { en: "This is the square of a sum.", vi: "Đây là bình phương của một tổng." },
    { en: "This is a difference of two squares.", vi: "Đây là hiệu hai bình phương." },
    { en: "I can calculate it in my head.", vi: "Em có thể tính nhẩm được." },
  ],
  summary: [
    bi("(A + B)² = A² + 2AB + B²", "(A + B)² = A² + 2AB + B²"),
    bi("(A − B)² = A² − 2AB + B²", "(A − B)² = A² − 2AB + B²"),
    bi("A² − B² = (A + B)(A − B)", "A² − B² = (A + B)(A − B)"),
    bi("(A ± B)² ≠ A² ± B² — remember the middle term 2AB.", "(A ± B)² ≠ A² ± B² — nhớ hạng tử 2AB."),
  ],
};

