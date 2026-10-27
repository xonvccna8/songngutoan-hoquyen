// Bài 3. Phép cộng và phép trừ đa thức — Adding and subtracting polynomials (Toán 8 KNTT, Chương I)
import { mono, nz, P, S } from "@/lib/content/alg";
import { bi, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

const join = (ms: string[]) => ms.join(" + ").replace(/\+ -/g, "- ");

/** Đa thức ngẫu nhiên 3 hạng tử, dùng chung các phần biến để cộng/trừ có hạng tử đồng dạng */
function pair(r: () => number) {
  const parts = shuffle([[2, 0], [1, 1], [0, 2], [1, 0], [0, 0], [2, 1]], r).slice(0, 4);
  const A = join(parts.slice(0, 3).map(([a, b]) => mono(nz(r, -7, 7), a, b)));
  const B = join(parts.slice(1, 4).map(([a, b]) => mono(nz(r, -7, 7), a, b)));
  return { A, B };
}

function genAdd(r: () => number): Question {
  const { A, B } = pair(r);
  const ans = S(`${A} + ${B}`);
  if (ans === "0") return genAdd(r);
  return {
    id: `g-add-${A}|${B}`,
    type: "expr",
    form: "simplified",
    level: 1,
    skill: "math",
    answer: ans,
    prompt: bi(`Let A = ${P(A)} and B = ${P(B)}. Find A + B.`, `Cho A = ${P(A)} và B = ${P(B)}. Tính A + B.`),
    hints: [
      bi("sum = tổng; add = cộng", "Viết A + B, bỏ ngoặc (dấu giữ nguyên)."),
      bi("Then collect like terms.", "Rồi gộp các hạng tử đồng dạng."),
      bi(`A + B = ${ans}`, `A + B = ${ans}`),
    ],
    explain: bi(`(${P(A)}) + (${P(B)}) = ${ans}`, `(${P(A)}) + (${P(B)}) = ${ans}`),
  };
}

function genSub(r: () => number): Question {
  const { A, B } = pair(r);
  const ans = S(`${A} - (${B})`);
  if (ans === "0") return genSub(r);
  return {
    id: `g-sub-${A}|${B}`,
    type: "expr",
    form: "simplified",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Let A = ${P(A)} and B = ${P(B)}. Find A − B.`, `Cho A = ${P(A)} và B = ${P(B)}. Tính A − B.`),
    hints: [
      bi("difference = hiệu; subtract = trừ", "A − B = (A) − (B)."),
      bi("A minus sign before brackets changes the sign of EVERY term inside.", "Dấu trừ trước ngoặc: bỏ ngoặc phải đổi dấu TẤT CẢ hạng tử bên trong."),
      bi(`A − B = ${ans}`, `A − B = ${ans}`),
    ],
    explain: bi(`(${P(A)}) − (${P(B)}) = ${ans}`, `(${P(A)}) − (${P(B)}) = ${ans}`),
  };
}

/** Tìm đa thức M biết M + B = C (tức M = C − B) */
function genFind(r: () => number): Question {
  const { A: M, B } = pair(r);
  const C = S(`${M} + ${B}`);
  const ans = S(M);
  if (C === "0") return genFind(r);
  const plus = r() < 0.5;
  return {
    id: `g-find-${M}|${B}|${plus}`,
    type: "expr",
    form: "simplified",
    level: 3,
    skill: "math",
    answer: plus ? ans : S(`${B} - (${C})`),
    prompt: plus
      ? bi(`Find the polynomial M such that M + (${P(B)}) = ${C}.`, `Tìm đa thức M sao cho M + (${P(B)}) = ${C}.`)
      : bi(`Find the polynomial M such that (${C}) + M = ${P(B)}.`, `Tìm đa thức M sao cho (${C}) + M = ${P(B)}.`),
    hints: [
      bi("Think: unknown term = sum − known term.", "Nhớ: số hạng chưa biết = tổng − số hạng đã biết."),
      plus ? bi(`M = (${C}) − (${P(B)})`, `M = (${C}) − (${P(B)})`) : bi(`M = (${P(B)}) − (${C})`, `M = (${P(B)}) − (${C})`),
      bi(`M = ${plus ? ans : S(`${B} - (${C})`)}`, `M = ${plus ? ans : S(`${B} - (${C})`)}`),
    ],
    explain: bi(`M = ${plus ? ans : S(`${B} - (${C})`)}`, `M = ${plus ? ans : S(`${B} - (${C})`)}`),
  };
}

/** Bỏ ngoặc có dấu trừ phía trước: chọn kết quả đúng */
function genSign(r: () => number): Question {
  const a = nz(r, 2, 9);
  const b = nz(r, 2, 9);
  const c = nz(r, 2, 9);
  const right = `−${a}x² + ${b}x − ${c}`;
  const opts = shuffle([right, `−${a}x² − ${b}x + ${c}`, `−${a}x² − ${b}x − ${c}`, `${a}x² + ${b}x − ${c}`], r);
  return {
    id: `g-sign-${a}${b}${c}`,
    type: "mcq",
    level: 1,
    skill: "math",
    answer: opts.indexOf(right),
    options: opts.map((o) => bi(o, o)),
    prompt: bi(`Remove the brackets: −(${a}x² − ${b}x + ${c})`, `Bỏ ngoặc: −(${a}x² − ${b}x + ${c})`),
    hints: [bi("brackets = dấu ngoặc", "Trước ngoặc là dấu trừ."), bi("Change the sign of every term inside.", "Đổi dấu tất cả các hạng tử trong ngoặc."), bi(right, right)],
    explain: bi(`−(${a}x² − ${b}x + ${c}) = ${right}`, `−(${a}x² − ${b}x + ${c}) = ${right}`),
  };
}

export const CONG_TRU_DA_THUC: LessonContent = {
  id: "k8-3",
  slug: "cong-tru-da-thuc",
  title: bi("Adding and subtracting polynomials", "Phép cộng và phép trừ đa thức"),
  intro: bi(
    "Adding polynomials is like adding fruit: apples with apples, oranges with oranges — x² with x², xy with xy. The big trap is the minus sign before brackets!",
    "Cộng đa thức giống như cộng trái cây: táo với táo, cam với cam — x² với x², xy với xy. Cái bẫy lớn nhất là dấu trừ trước dấu ngoặc!",
  ),
  goals: [bi("Add two polynomials.", "Cộng hai đa thức."), bi("Subtract two polynomials (careful with signs).", "Trừ hai đa thức (cẩn thận với dấu)."), bi("Find an unknown polynomial.", "Tìm đa thức chưa biết.")],
  terms: [
    { id: "add", en: "add", ipa: "/æd/", vi: "cộng", example: bi("Add A and B.", "Cộng A với B.") },
    { id: "subtract", en: "subtract", ipa: "/səbˈtrækt/", vi: "trừ", example: bi("Subtract B from A.", "Lấy A trừ B.") },
    { id: "sum-alg", en: "sum", ipa: "/sʌm/", vi: "tổng", example: bi("A + B is the sum of A and B.", "A + B là tổng của A và B.") },
    { id: "difference", en: "difference", ipa: "/ˈdɪfrəns/", vi: "hiệu", example: bi("A − B is the difference.", "A − B là hiệu.") },
    { id: "brackets", en: "brackets", ipa: "/ˈbrækɪts/", vi: "dấu ngoặc", example: bi("Remove the brackets.", "Bỏ dấu ngoặc.") },
    { id: "remove-brackets", en: "remove the brackets", ipa: "/rɪˈmuːv ðə ˈbrækɪts/", vi: "bỏ ngoặc", example: bi("Remove the brackets, then collect like terms.", "Bỏ ngoặc rồi thu gọn.") },
    { id: "change-sign", en: "change the sign", ipa: "/tʃeɪndʒ ðə saɪn/", vi: "đổi dấu", example: bi("A minus sign changes the sign of each term.", "Dấu trừ làm đổi dấu từng hạng tử.") },
    { id: "minus-sign", en: "minus sign", ipa: "/ˈmaɪnəs saɪn/", vi: "dấu trừ", example: bi("There is a minus sign before the brackets.", "Có dấu trừ trước ngoặc.") },
    { id: "unknown", en: "unknown polynomial", ipa: "/ˌʌnˈnəʊn ˌpɒliˈnəʊmiəl/", vi: "đa thức chưa biết", example: bi("Find the unknown polynomial M.", "Tìm đa thức chưa biết M.") },
  ],
  sections: [
    {
      id: "cong",
      title: bi("Adding polynomials", "Cộng hai đa thức"),
      blocks: [
        { kind: "key", tag: bi("How to", "Cách làm"), text: bi("Write A + B, remove the brackets (signs stay the same), then collect like terms.", "Viết A + B, bỏ dấu ngoặc (giữ nguyên dấu), rồi nhóm và thu gọn các hạng tử đồng dạng.") },
        {
          kind: "example",
          problem: bi("A = x² − 2xy + 3, B = 2x² + xy − 5. Find A + B.", "A = x² − 2xy + 3, B = 2x² + xy − 5. Tính A + B."),
          steps: [
            bi("A + B = (x² − 2xy + 3) + (2x² + xy − 5)", "A + B = (x² − 2xy + 3) + (2x² + xy − 5)"),
            bi("= x² − 2xy + 3 + 2x² + xy − 5", "= x² − 2xy + 3 + 2x² + xy − 5"),
            bi("= (x² + 2x²) + (−2xy + xy) + (3 − 5) = 3x² − xy − 2", "= (x² + 2x²) + (−2xy + xy) + (3 − 5) = 3x² − xy − 2"),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "expr",
            form: "simplified",
            level: 1,
            skill: "math",
            answer: "5x + 2y",
            prompt: bi("Calculate: (3x − y) + (2x + 3y)", "Tính: (3x − y) + (2x + 3y)"),
            hints: [bi("add = cộng", "Bỏ ngoặc, giữ nguyên dấu."), bi("3x + 2x; −y + 3y", "3x + 2x; −y + 3y"), bi("5x + 2y", "5x + 2y")],
            explain: bi("3x − y + 2x + 3y = 5x + 2y.", "3x − y + 2x + 3y = 5x + 2y."),
          },
        },
      ],
    },
    {
      id: "tru",
      title: bi("Subtracting polynomials", "Trừ hai đa thức"),
      blocks: [
        { kind: "key", tag: bi("Watch out!", "Chú ý!"), tone: "coral", text: bi("When there is a minus sign before brackets, remove the brackets and CHANGE THE SIGN of every term inside.", "Khi bỏ ngoặc có dấu trừ đằng trước, ta phải ĐỔI DẤU tất cả các hạng tử trong ngoặc.") },
        {
          kind: "example",
          problem: bi("A = x² − 2xy + 3, B = 2x² + xy − 5. Find A − B.", "A = x² − 2xy + 3, B = 2x² + xy − 5. Tính A − B."),
          steps: [
            bi("A − B = (x² − 2xy + 3) − (2x² + xy − 5)", "A − B = (x² − 2xy + 3) − (2x² + xy − 5)"),
            bi("= x² − 2xy + 3 − 2x² − xy + 5   (every sign in B changed)", "= x² − 2xy + 3 − 2x² − xy + 5   (đổi dấu mọi hạng tử của B)"),
            bi("= −x² − 3xy + 8", "= −x² − 3xy + 8"),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "expr",
            form: "simplified",
            level: 2,
            skill: "math",
            answer: "x − 4y",
            prompt: bi("Calculate: (3x − y) − (2x + 3y)", "Tính: (3x − y) − (2x + 3y)"),
            hints: [bi("subtract = trừ", "Dấu trừ trước ngoặc → đổi dấu."), bi("3x − y − 2x − 3y", "3x − y − 2x − 3y"), bi("x − 4y", "x − 4y")],
            explain: bi("3x − y − 2x − 3y = x − 4y.", "3x − y − 2x − 3y = x − 4y."),
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
      accept: ["brackets", "bracket", "parentheses"],
      prompt: bi("Type the English word for “dấu ngoặc”.", "Gõ từ tiếng Anh của “dấu ngoặc”."),
      hints: [bi("It starts with “br-”.", "Bắt đầu bằng “br-”."), bi("br _ _ _ _ _ s", "br _ _ _ _ _ s"), bi("brackets", "brackets")],
      explain: bi("brackets /ˈbrækɪts/ = dấu ngoặc (American English: parentheses)", "brackets = dấu ngoặc (tiếng Anh – Mỹ: parentheses)"),
    },
    {
      id: "p2",
      type: "tf",
      level: 2,
      skill: "math",
      answer: false,
      prompt: bi("True or false: x − (y − z) = x − y − z", "Đúng hay sai: x − (y − z) = x − y − z"),
      hints: [bi("minus sign before brackets = dấu trừ trước ngoặc", "Dấu trừ trước ngoặc đổi dấu mọi hạng tử."), bi("−(y − z) = −y + z", "−(y − z) = −y + z"), bi("x − y + z", "x − y + z")],
      explain: bi("False: x − (y − z) = x − y + z.", "Sai: x − (y − z) = x − y + z."),
    },
  ],
  generators: [
    { level: 1, make: genAdd },
    { level: 1, make: genSign },
    { level: 2, make: genSub },
    { level: 3, make: genFind },
  ],
  speak: [
    { en: "Remove the brackets and collect like terms.", vi: "Bỏ ngoặc và thu gọn các hạng tử đồng dạng." },
    { en: "A minus sign changes the sign of every term.", vi: "Dấu trừ làm đổi dấu mọi hạng tử." },
    { en: "The sum of two polynomials is a polynomial.", vi: "Tổng của hai đa thức là một đa thức." },
    { en: "Subtract the second polynomial from the first.", vi: "Lấy đa thức thứ nhất trừ đa thức thứ hai." },
    { en: "Add like terms together.", vi: "Cộng các hạng tử đồng dạng với nhau." },
  ],
  summary: [
    bi("A + B: remove brackets (signs stay), collect like terms.", "A + B: bỏ ngoặc (giữ dấu), thu gọn."),
    bi("A − B: remove brackets, CHANGE every sign in B, collect like terms.", "A − B: bỏ ngoặc, ĐỔI DẤU mọi hạng tử của B, thu gọn."),
    bi("M + B = C ⇒ M = C − B", "M + B = C ⇒ M = C − B"),
  ],
};
