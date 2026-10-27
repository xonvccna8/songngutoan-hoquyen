// Bài 7. Lập phương của một tổng. Lập phương của một hiệu (Toán 8 KNTT, Chương II)
import { bin, nz, S } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

/** Khai triển (x ± a)³ */
function genCube(r: () => number): Question {
  const a = nz(r, -4, 4);
  const src = `(${bin(a)})³`;
  const ans = S(src);
  const plus = a > 0;
  return {
    id: `g-cube-${a}`,
    type: "expr",
    form: "expanded",
    level: 1,
    skill: "math",
    answer: ans,
    prompt: bi(`Expand: ${src}`, `Khai triển: ${src}`),
    hints: [
      bi(plus ? "cube of a sum = lập phương của một tổng" : "cube of a difference = lập phương của một hiệu", plus ? "(A + B)³ = A³ + 3A²B + 3AB² + B³" : "(A − B)³ = A³ − 3A²B + 3AB² − B³"),
      bi(`A = x, B = ${Math.abs(a)}`, `A = x, B = ${Math.abs(a)}`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Khai triển (kx ± c)³ */
function genCubeGeneral(r: () => number): Question {
  const k = int(r, 2, 3);
  const c = nz(r, -3, 3);
  const src = `(${bin(c, "x", k)})³`;
  const ans = S(src);
  return {
    id: `g-cubeg-${k}-${c}`,
    type: "expr",
    form: "expanded",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Expand: ${src}`, `Khai triển: ${src}`),
    hints: [
      bi(`A = ${k}x, B = ${Math.abs(c)}`, `A = ${k}x, B = ${Math.abs(c)}`),
      bi(`A³ = ${k ** 3}x³, 3A²B = 3·${k * k}x²·${Math.abs(c)}, 3AB² = 3·${k}x·${c * c}`, `A³ = ${k ** 3}x³, 3A²B = 3·${k * k}x²·${Math.abs(c)}, 3AB² = 3·${k}x·${c * c}`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Viết thành lập phương */
function genToCube(r: () => number): Question {
  const a = nz(r, -4, 4);
  const src = S(`(x + ${a})^3`);
  const ans = `(${bin(a)})³`;
  return {
    id: `g-tocube-${a}`,
    type: "expr",
    form: "factored",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Write as a cube: ${src}`, `Viết dưới dạng lập phương: ${src}`),
    hints: [
      bi("Four terms, first x³ → think of (x ± B)³.", "Bốn hạng tử, đầu là x³ → nghĩ tới (x ± B)³."),
      bi(`The last term is ${a ** 3} = (${a})³.`, `Hạng tử cuối là ${a ** 3} = (${a})³.`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Giá trị tại số "đẹp" */
function genNiceCube(r: () => number): Question {
  const a = nz(r, -4, 4);
  const x = 10 - a;
  const src = S(`(x + ${a})^3`);
  return {
    id: `g-nicec-${a}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: 1000,
    prompt: bi(`Find the value of ${src} at x = ${x}.`, `Tính giá trị của ${src} tại x = ${x}.`),
    hints: [bi("Look for an identity before substituting.", "Tìm hằng đẳng thức trước khi thay số."), bi(`${src} = (${bin(a)})³`, `${src} = (${bin(a)})³`), bi(`= (${x} ${a < 0 ? "−" : "+"} ${Math.abs(a)})³ = 10³ = 1000`, `= (${x} ${a < 0 ? "−" : "+"} ${Math.abs(a)})³ = 10³ = 1000`)],
    explain: bi(`The expression equals (x ${a < 0 ? "−" : "+"} ${Math.abs(a)})³ = 10³ = 1000.`, `Biểu thức bằng (x ${a < 0 ? "−" : "+"} ${Math.abs(a)})³ = 10³ = 1000.`),
  };
}

/** Rút gọn (x + a)³ − (x − a)³ */
function genCubeDiff(r: () => number): Question {
  const a = int(r, 1, 3);
  const src = `(x + ${a})³ − (x − ${a})³`;
  const ans = S(src);
  return {
    id: `g-cubed-${a}`,
    type: "expr",
    form: "simplified",
    level: 3,
    skill: "math",
    answer: ans,
    prompt: bi(`Simplify: ${src}`, `Rút gọn: ${src}`),
    hints: [bi("Expand both cubes.", "Khai triển cả hai lập phương."), bi("The x³ terms and the constant terms cancel out.", "Các hạng tử x³ và hằng số triệt tiêu."), bi(`= ${ans}`, `= ${ans}`)],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

function genWhich(r: () => number): Question {
  const right = "(A − B)³ = A³ − 3A²B + 3AB² − B³";
  const opts = shuffle([right, "(A − B)³ = A³ − B³", "(A − B)³ = A³ − 3A²B − 3AB² − B³", "(A − B)³ = A³ + 3A²B − 3AB² − B³"], r);
  return {
    id: "g-which-cube",
    type: "mcq",
    level: 1,
    skill: "math",
    answer: opts.indexOf(right),
    options: opts.map((o) => bi(o, o)),
    prompt: bi("Which identity is correct?", "Hằng đẳng thức nào đúng?"),
    hints: [bi("Signs alternate: + − + −", "Dấu xen kẽ: + − + −"), bi("Coefficients 1, 3, 3, 1", "Hệ số 1, 3, 3, 1"), bi(right, right)],
    explain: bi(`${right}. Signs alternate, coefficients 1 3 3 1.`, `${right}. Dấu xen kẽ, hệ số 1 3 3 1.`),
  };
}

export const LAP_PHUONG: LessonContent = {
  id: "k8-7",
  slug: "lap-phuong",
  title: bi("Cube of a sum. Cube of a difference", "Lập phương của một tổng. Lập phương của một hiệu"),
  intro: bi(
    "A cube of side a + b can be cut into 8 boxes: that is why (a + b)³ = a³ + 3a²b + 3ab² + b³. Remember the magic numbers 1, 3, 3, 1!",
    "Một khối lập phương cạnh a + b cắt được thành 8 hộp nhỏ: vì thế (a + b)³ = a³ + 3a²b + 3ab² + b³. Nhớ dãy số thần kì 1, 3, 3, 1!",
  ),
  goals: [bi("Use the cube of a sum and of a difference.", "Vận dụng lập phương của một tổng, một hiệu."), bi("Recognise a cube in expanded form.", "Nhận ra lập phương ở dạng khai triển.")],
  terms: [
    { id: "cube", en: "cube", ipa: "/kjuːb/", vi: "lập phương", example: bi("The cube of 2 is 8.", "Lập phương của 2 là 8.") },
    { id: "cubed", en: "cubed", ipa: "/kjuːbd/", vi: "lập phương (cách đọc)", example: bi("x³ is read “x cubed”.", "x³ đọc là “x cubed”.") },
    { id: "cube-sum", en: "cube of a sum", ipa: "/kjuːb əv ə sʌm/", vi: "lập phương của một tổng", example: bi("(a + b)³ is the cube of a sum.", "(a + b)³ là lập phương của một tổng.") },
    { id: "cube-diff", en: "cube of a difference", ipa: "/kjuːb əv ə ˈdɪfrəns/", vi: "lập phương của một hiệu", example: bi("(a − b)³ is the cube of a difference.", "(a − b)³ là lập phương của một hiệu.") },
    { id: "alternate", en: "alternate", ipa: "/ɔːlˈtɜːnət/", vi: "xen kẽ", example: bi("The signs alternate: + − + −.", "Dấu xen kẽ: + − + −.") },
    { id: "pattern", en: "pattern", ipa: "/ˈpætn/", vi: "quy luật", example: bi("The coefficients follow the pattern 1, 3, 3, 1.", "Hệ số theo quy luật 1, 3, 3, 1.") },
    { id: "power-three", en: "to the power of three", ipa: "/tə ðə ˈpaʊər əv θriː/", vi: "mũ ba", example: bi("x to the power of three is x³.", "x mũ ba là x³.") },
    { id: "volume", en: "volume", ipa: "/ˈvɒljuːm/", vi: "thể tích", example: bi("The volume of a cube is a³.", "Thể tích hình lập phương là a³.") },
  ],
  sections: [
    {
      id: "lap-phuong-tong",
      title: bi("Cube of a sum", "Lập phương của một tổng"),
      blocks: [
        { kind: "key", tag: bi("Identity 4", "Hằng đẳng thức 4"), tone: "sun", text: bi("(A + B)³ = A³ + 3A²B + 3AB² + B³", "(A + B)³ = A³ + 3A²B + 3AB² + B³") },
        { kind: "text", text: bi("Why? (A + B)³ = (A + B)²·(A + B) = (A² + 2AB + B²)(A + B), then multiply and collect.", "Vì sao? (A + B)³ = (A + B)²·(A + B) = (A² + 2AB + B²)(A + B), rồi nhân và thu gọn.") },
        {
          kind: "example",
          problem: bi("Expand (x + 2)³.", "Khai triển (x + 2)³."),
          steps: [bi("A = x, B = 2", "A = x, B = 2"), bi("x³ + 3·x²·2 + 3·x·2² + 2³", "x³ + 3·x²·2 + 3·x·2² + 2³"), bi("= x³ + 6x² + 12x + 8", "= x³ + 6x² + 12x + 8")],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "expr",
            form: "expanded",
            level: 1,
            skill: "math",
            answer: "x³ + 3x² + 3x + 1",
            prompt: bi("Expand: (x + 1)³", "Khai triển: (x + 1)³"),
            hints: [bi("1, 3, 3, 1", "Hệ số 1, 3, 3, 1."), bi("B = 1, so B² = B³ = 1.", "B = 1 nên B² = B³ = 1."), bi("x³ + 3x² + 3x + 1", "x³ + 3x² + 3x + 1")],
            explain: bi("(x + 1)³ = x³ + 3x² + 3x + 1.", "(x + 1)³ = x³ + 3x² + 3x + 1."),
          },
        },
      ],
    },
    {
      id: "lap-phuong-hieu",
      title: bi("Cube of a difference", "Lập phương của một hiệu"),
      blocks: [
        { kind: "key", tag: bi("Identity 5", "Hằng đẳng thức 5"), tone: "sun", text: bi("(A − B)³ = A³ − 3A²B + 3AB² − B³", "(A − B)³ = A³ − 3A²B + 3AB² − B³") },
        { kind: "key", tag: bi("Tip", "Mẹo"), tone: "teal", text: bi("Same coefficients 1, 3, 3, 1 — but the signs alternate + − + −.", "Hệ số vẫn là 1, 3, 3, 1 — nhưng dấu xen kẽ + − + −.") },
        {
          kind: "example",
          problem: bi("Expand (2x − 1)³.", "Khai triển (2x − 1)³."),
          steps: [bi("A = 2x, B = 1", "A = 2x, B = 1"), bi("(2x)³ − 3·(2x)²·1 + 3·2x·1² − 1³", "(2x)³ − 3·(2x)²·1 + 3·2x·1² − 1³"), bi("= 8x³ − 12x² + 6x − 1", "= 8x³ − 12x² + 6x − 1")],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "expr",
            form: "factored",
            level: 2,
            skill: "math",
            answer: "(x − 3)³",
            prompt: bi("Write as a cube: x³ − 9x² + 27x − 27", "Viết dưới dạng lập phương: x³ − 9x² + 27x − 27"),
            hints: [bi("Signs alternate → cube of a difference.", "Dấu xen kẽ → lập phương của một hiệu."), bi("27 = 3³", "27 = 3³"), bi("(x − 3)³", "(x − 3)³")],
            explain: bi("x³ − 9x² + 27x − 27 = (x − 3)³.", "x³ − 9x² + 27x − 27 = (x − 3)³."),
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
      accept: ["cube", "cubed"],
      prompt: bi("Type the English word for “lập phương”.", "Gõ từ tiếng Anh của “lập phương”."),
      hints: [bi("Like an ice cube!", "Như viên đá (ice cube)!"), bi("c _ _ e", "c _ _ e"), bi("cube", "cube")],
      explain: bi("cube /kjuːb/ = lập phương; x³ = “x cubed”", "cube /kjuːb/ = lập phương; x³ đọc là “x cubed”"),
    },
    {
      id: "p2",
      type: "number",
      level: 2,
      skill: "math",
      answer: 1331,
      prompt: bi("Calculate quickly: 11³ = (10 + 1)³", "Tính nhanh: 11³ = (10 + 1)³"),
      hints: [bi("Use (A + B)³ with A = 10, B = 1.", "Dùng (A + B)³ với A = 10, B = 1."), bi("1000 + 300 + 30 + 1", "1000 + 300 + 30 + 1"), bi("1331", "1331")],
      explain: bi("10³ + 3·10²·1 + 3·10·1 + 1 = 1331.", "10³ + 3·10²·1 + 3·10·1 + 1 = 1331."),
    },
  ],
  generators: [
    { level: 1, make: genCube },
    { level: 1, make: genWhich },
    { level: 2, make: genCubeGeneral },
    { level: 2, make: genToCube },
    { level: 3, make: genNiceCube },
    { level: 3, make: genCubeDiff },
  ],
  speak: [
    { en: "The coefficients are one, three, three, one.", vi: "Các hệ số là một, ba, ba, một." },
    { en: "In the cube of a difference, the signs alternate.", vi: "Trong lập phương của một hiệu, các dấu xen kẽ." },
    { en: "This is the cube of a sum.", vi: "Đây là lập phương của một tổng." },
    { en: "The volume of a cube is the side cubed.", vi: "Thể tích hình lập phương bằng lập phương của cạnh." },
    { en: "Expand the cube and collect like terms.", vi: "Khai triển lập phương rồi thu gọn." },
  ],
  summary: [
    bi("(A + B)³ = A³ + 3A²B + 3AB² + B³", "(A + B)³ = A³ + 3A²B + 3AB² + B³"),
    bi("(A − B)³ = A³ − 3A²B + 3AB² − B³", "(A − B)³ = A³ − 3A²B + 3AB² − B³"),
    bi("Coefficients 1, 3, 3, 1; for a difference the signs alternate.", "Hệ số 1, 3, 3, 1; với hiệu thì dấu xen kẽ."),
  ],
};
