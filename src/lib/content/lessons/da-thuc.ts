// Bài 2. Đa thức — Polynomials (Toán 8 Kết nối tri thức, Chương I)
import { deg, mono, nz, P, pick, S, val } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

/** Ghép các đơn thức thành chuỗi đa thức: ["3x^2", "-2xy"] → "3x^2 - 2xy" */
const join = (ms: string[]) => ms.join(" + ").replace(/\+ -/g, "- ");

/** Một đa thức thu gọn ngẫu nhiên có 3–4 hạng tử khác phần biến */
function randomPoly(r: () => number, n: number): string[] {
  const parts = shuffle([[3, 0], [2, 1], [1, 2], [2, 0], [1, 1], [0, 2], [1, 0], [0, 0]], r).slice(0, n);
  return parts.map(([a, b]) => mono(nz(r, -7, 7), a, b));
}

/** Số hạng tử của đa thức */
function genTerms(r: () => number): Question {
  const n = int(r, 2, 5);
  const src = join(randomPoly(r, n));
  return {
    id: `g-pterms-${src}`,
    type: "number",
    level: 1,
    skill: "lang",
    answer: n,
    prompt: bi(`How many terms does the polynomial ${P(src)} have?`, `Đa thức ${P(src)} có bao nhiêu hạng tử?`),
    hints: [
      bi("term = hạng tử (each monomial in the sum)", "Hạng tử (term) là mỗi đơn thức trong tổng."),
      bi("Count the monomials separated by + or −.", "Đếm các đơn thức được nối bởi dấu + hoặc −."),
      bi(`${n} terms`, `${n} hạng tử`),
    ],
    explain: bi(`${P(src)} has ${n} terms.`, `${P(src)} có ${n} hạng tử.`),
  };
}

/** Bậc của đa thức thu gọn */
function genDegree(r: () => number): Question {
  const src = join(randomPoly(r, int(r, 3, 4)));
  const d = deg(src);
  return {
    id: `g-pdeg-${src}`,
    type: "number",
    level: 1,
    skill: "math",
    answer: d,
    prompt: bi(`Find the degree of the polynomial ${P(src)}.`, `Tìm bậc của đa thức ${P(src)}.`),
    hints: [
      bi("degree of a polynomial = bậc của đa thức", "Bậc của đa thức thu gọn = bậc cao nhất trong các hạng tử."),
      bi("Find the degree of each term (sum of exponents).", "Tính bậc từng hạng tử (tổng số mũ các biến)."),
      bi(`The highest degree is ${d}.`, `Bậc cao nhất là ${d}.`),
    ],
    explain: bi(`The term with the highest degree has degree ${d}.`, `Hạng tử có bậc cao nhất có bậc ${d}, nên đa thức có bậc ${d}.`),
  };
}

/** Thu gọn đa thức (có hạng tử đồng dạng) */
function genCollect(r: () => number): Question {
  const base = shuffle([[2, 0], [1, 1], [1, 0], [0, 0], [2, 1]], r).slice(0, 3);
  const ms: string[] = [];
  for (const [a, b] of base) {
    ms.push(mono(nz(r, -6, 6), a, b));
    if (r() < 0.7) ms.push(mono(nz(r, -6, 6), a, b));
  }
  const src = join(shuffle(ms, r));
  const ans = S(src);
  if (ans === "0" || ms.length < 4) return genCollect(r);
  return {
    id: `g-pcol-${src}`,
    type: "expr",
    form: "simplified",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Simplify the polynomial: ${P(src)}`, `Thu gọn đa thức: ${P(src)}`),
    hints: [
      bi("collect like terms = gộp các hạng tử đồng dạng", "Tìm các hạng tử đồng dạng (cùng phần biến)."),
      bi("Group them, then add their coefficients.", "Nhóm chúng lại rồi cộng các hệ số."),
      bi(`Result: ${ans}`, `Kết quả: ${ans}`),
    ],
    explain: bi(`${P(src)} = ${ans}`, `${P(src)} = ${ans}`),
  };
}

/** Giá trị đa thức */
function genValue(r: () => number): Question {
  const ms = [mono(nz(r, -4, 4), 2, 0), mono(nz(r, -4, 4), 1, 1), mono(nz(r, -5, 5), 0, 0)];
  const src = join(ms);
  const x = nz(r, -3, 3);
  const y = nz(r, -3, 3);
  const v = val(src, { x, y });
  return {
    id: `g-pval-${src}-${x}_${y}`,
    type: "number",
    level: 2,
    skill: "math",
    answer: v,
    prompt: bi(`Find the value of ${P(src)} at x = ${x}, y = ${y}.`, `Tính giá trị của đa thức ${P(src)} tại x = ${x}, y = ${y}.`),
    hints: [
      bi("value = giá trị; substitute = thay", "Thay x, y vào từng hạng tử (số âm để trong ngoặc)."),
      bi("Calculate each term, then add.", "Tính từng hạng tử rồi cộng lại."),
      bi(`Value: ${v}`, `Giá trị: ${v}`),
    ],
    explain: bi(`At x = ${x}, y = ${y} the polynomial equals ${v}.`, `Tại x = ${x}, y = ${y}, đa thức có giá trị ${v}.`),
  };
}

/** Bậc sau khi thu gọn (có hạng tử triệt tiêu — bẫy!) */
function genTrapDegree(r: () => number): Question {
  const c = nz(r, 2, 6);
  const others = [mono(nz(r, -5, 5), 2, 1), mono(nz(r, -5, 5), 1, 1), mono(nz(r, -9, 9), 0, 0)];
  const ms = shuffle([mono(c, 4, 0), mono(-c, 4, 0), ...others.slice(0, int(r, 2, 3))], r);
  const src = join(ms);
  const d = deg(src);
  return {
    id: `g-ptrap-${src}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: d,
    prompt: bi(`Find the degree of the polynomial ${P(src)}.`, `Tìm bậc của đa thức ${P(src)}.`),
    hints: [
      bi("Careful: is the polynomial simplified?", "Cẩn thận: đa thức đã thu gọn chưa?"),
      bi(`${c}x⁴ and −${c}x⁴ cancel out.`, `${c}x⁴ và −${c}x⁴ triệt tiêu nhau.`),
      bi(`After simplifying: ${S(src)} → degree ${d}`, `Thu gọn: ${S(src)} → bậc ${d}`),
    ],
    explain: bi(`Simplify first: ${S(src)}, so the degree is ${d} (not 4!).`, `Phải thu gọn trước: ${S(src)}, nên bậc là ${d} (không phải 4!).`),
  };
}

/** Hệ số của một hạng tử sau khi thu gọn */
function genCoefAfter(r: () => number): Question {
  const [a, b] = pick(r, [[2, 1], [1, 1], [1, 2]]);
  const c1 = nz(r, -6, 6);
  let c2 = nz(r, -6, 6);
  if (c1 + c2 === 0) c2++;
  const src = join(shuffle([mono(c1, a, b), mono(nz(r, -5, 5), 2, 0), mono(c2, a, b), mono(nz(r, -9, 9), 0, 0)], r));
  const target = S(mono(1, a, b));
  return {
    id: `g-pcoef-${src}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: c1 + c2,
    prompt: bi(`After simplifying ${P(src)}, what is the coefficient of ${target}?`, `Sau khi thu gọn ${P(src)}, hệ số của ${target} là bao nhiêu?`),
    hints: [
      bi("coefficient = hệ số", `Tìm các hạng tử có phần biến ${target}.`),
      bi("Add their coefficients.", "Cộng các hệ số của chúng."),
      bi(`${c1} + ${c2 < 0 ? `(${c2})` : c2} = ${c1 + c2}`, `${c1} + ${c2 < 0 ? `(${c2})` : c2} = ${c1 + c2}`),
    ],
    explain: bi(`Simplified: ${S(src)}. The coefficient of ${target} is ${c1 + c2}.`, `Thu gọn: ${S(src)}. Hệ số của ${target} là ${c1 + c2}.`),
  };
}

export const DA_THUC: LessonContent = {
  id: "k8-2",
  slug: "da-thuc",
  title: bi("Polynomials", "Đa thức"),
  intro: bi(
    "When we add monomials we get a polynomial, like 3x²y − 5xy + 7. Polynomials describe areas, costs, distances… Let's learn to simplify them and find their value.",
    "Cộng các đơn thức lại ta được đa thức, như 3x²y − 5xy + 7. Đa thức dùng để biểu diễn diện tích, chi phí, quãng đường… Cùng học cách thu gọn và tính giá trị của nó.",
  ),
  goals: [
    bi("Recognise polynomials in several variables and their terms.", "Nhận biết đa thức nhiều biến và các hạng tử."),
    bi("Simplify a polynomial and find its degree.", "Thu gọn đa thức và tìm bậc."),
    bi("Evaluate a polynomial.", "Tính giá trị của đa thức."),
  ],
  terms: [
    { id: "polynomial", en: "polynomial", ipa: "/ˌpɒliˈnəʊmiəl/", vi: "đa thức", example: bi("3x²y − 5xy + 7 is a polynomial.", "3x²y − 5xy + 7 là một đa thức.") },
    { id: "term", en: "term", ipa: "/tɜːm/", vi: "hạng tử", example: bi("−5xy is a term of the polynomial.", "−5xy là một hạng tử của đa thức.") },
    { id: "like-terms", en: "like terms", ipa: "/laɪk tɜːmz/", vi: "hạng tử đồng dạng", example: bi("2xy and −7xy are like terms.", "2xy và −7xy là hai hạng tử đồng dạng.") },
    { id: "collect", en: "collect like terms", ipa: "/kəˈlekt laɪk tɜːmz/", vi: "thu gọn (gộp hạng tử đồng dạng)", example: bi("Collect like terms to simplify.", "Gộp các hạng tử đồng dạng để thu gọn.") },
    { id: "degree-poly", en: "degree of a polynomial", ipa: "/dɪˈɡriː əv ə ˌpɒliˈnəʊmiəl/", vi: "bậc của đa thức", example: bi("The degree of x³ + 2x is 3.", "Bậc của x³ + 2x là 3.") },
    { id: "highest", en: "highest", ipa: "/ˈhaɪɪst/", vi: "cao nhất", example: bi("Take the highest degree of its terms.", "Lấy bậc cao nhất của các hạng tử.") },
    { id: "value", en: "value", ipa: "/ˈvæljuː/", vi: "giá trị", example: bi("The value of x + 1 at x = 2 is 3.", "Giá trị của x + 1 tại x = 2 là 3.") },
    { id: "substitute", en: "substitute", ipa: "/ˈsʌbstɪtjuːt/", vi: "thay (giá trị vào biến)", example: bi("Substitute x = −1 into the polynomial.", "Thay x = −1 vào đa thức.") },
    { id: "cancel-out", en: "cancel out", ipa: "/ˈkænsl aʊt/", vi: "triệt tiêu", example: bi("3x⁴ and −3x⁴ cancel out.", "3x⁴ và −3x⁴ triệt tiêu nhau.") },
    { id: "zero-polynomial", en: "zero polynomial", ipa: "/ˈzɪərəʊ ˌpɒliˈnəʊmiəl/", vi: "đa thức không", example: bi("The zero polynomial has no degree.", "Đa thức không không có bậc.") },
  ],
  sections: [
    {
      id: "da-thuc",
      title: bi("What is a polynomial?", "Đa thức là gì?"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("A polynomial is a sum of monomials. Each monomial in the sum is a term of the polynomial.", "Đa thức là một tổng của những đơn thức. Mỗi đơn thức trong tổng gọi là một hạng tử của đa thức đó.") },
        { kind: "text", text: bi("Each monomial is also a polynomial (with one term).", "Mỗi đơn thức cũng được coi là một đa thức (chỉ có một hạng tử).") },
        {
          kind: "example",
          problem: bi("Name the terms of the polynomial 3x²y − 5xy + 7.", "Chỉ ra các hạng tử của đa thức 3x²y − 5xy + 7."),
          steps: [bi("Write it as a sum: 3x²y + (−5xy) + 7.", "Viết thành tổng: 3x²y + (−5xy) + 7."), bi("The terms are 3x²y, −5xy and 7 (the sign goes with the term).", "Các hạng tử là 3x²y, −5xy và 7 (dấu đi kèm hạng tử).")],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "number",
            level: 1,
            skill: "lang",
            answer: 4,
            prompt: bi("How many terms does x³ − 2x²y + xy − 9 have?", "Đa thức x³ − 2x²y + xy − 9 có bao nhiêu hạng tử?"),
            hints: [bi("term = hạng tử", "Đếm các đơn thức."), bi("x³, −2x²y, xy, −9", "x³, −2x²y, xy, −9"), bi("4", "4")],
            explain: bi("Terms: x³, −2x²y, xy, −9.", "Các hạng tử: x³, −2x²y, xy, −9."),
          },
        },
      ],
    },
    {
      id: "thu-gon",
      title: bi("Simplified polynomials and degree", "Đa thức thu gọn và bậc"),
      blocks: [
        { kind: "key", tag: bi("Simplified polynomial", "Đa thức thu gọn"), text: bi("A simplified polynomial has no two like terms.", "Đa thức thu gọn là đa thức không có hai hạng tử nào đồng dạng.") },
        { kind: "key", tag: bi("Degree", "Bậc"), tone: "teal", text: bi("The degree of a polynomial is the highest degree of its terms in simplified form.", "Bậc của đa thức là bậc của hạng tử có bậc cao nhất trong dạng thu gọn của đa thức đó.") },
        {
          kind: "example",
          problem: bi("Simplify and find the degree: x³ + 2xy − x³ + y² + xy.", "Thu gọn và tìm bậc: x³ + 2xy − x³ + y² + xy."),
          steps: [
            bi("Group like terms: (x³ − x³) + (2xy + xy) + y².", "Nhóm hạng tử đồng dạng: (x³ − x³) + (2xy + xy) + y²."),
            bi("= 0 + 3xy + y² = 3xy + y².", "= 0 + 3xy + y² = 3xy + y²."),
            bi("Degrees: 3xy → 2, y² → 2. The degree is 2 (not 3!).", "Bậc: 3xy → 2, y² → 2. Đa thức có bậc 2 (không phải 3!)."),
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
            answer: "2x² − 3x + 6",
            prompt: bi("Simplify: 5x² − 3x + 2 − 3x² + 4", "Thu gọn: 5x² − 3x + 2 − 3x² + 4"),
            hints: [bi("like terms = hạng tử đồng dạng", "Nhóm 5x² với −3x², nhóm 2 với 4."), bi("5x² − 3x² = 2x²; 2 + 4 = 6", "5x² − 3x² = 2x²; 2 + 4 = 6"), bi("2x² − 3x + 6", "2x² − 3x + 6")],
            explain: bi("(5x² − 3x²) − 3x + (2 + 4) = 2x² − 3x + 6.", "(5x² − 3x²) − 3x + (2 + 4) = 2x² − 3x + 6."),
          },
        },
      ],
    },
    {
      id: "gia-tri",
      title: bi("The value of a polynomial", "Giá trị của đa thức"),
      blocks: [
        { kind: "key", tag: bi("How to", "Cách làm"), tone: "sun", text: bi("To evaluate a polynomial, simplify it (if needed), then substitute the values of the variables and calculate.", "Để tính giá trị đa thức, ta thu gọn (nếu cần), rồi thay giá trị của các biến vào và thực hiện phép tính.") },
        {
          kind: "example",
          problem: bi("Evaluate x²y − 2xy at x = −1, y = 2.", "Tính giá trị của x²y − 2xy tại x = −1, y = 2."),
          steps: [bi("x²y = (−1)²·2 = 2", "x²y = (−1)²·2 = 2"), bi("2xy = 2·(−1)·2 = −4", "2xy = 2·(−1)·2 = −4"), bi("Value: 2 − (−4) = 6", "Giá trị: 2 − (−4) = 6")],
        },
        {
          kind: "check",
          question: {
            id: "c3",
            type: "number",
            level: 2,
            skill: "math",
            answer: 11,
            prompt: bi("Find the value of 2x² + 3x − 3 at x = 2.", "Tính giá trị của 2x² + 3x − 3 tại x = 2."),
            hints: [bi("substitute = thay", "Thay x = 2."), bi("2·4 + 3·2 − 3", "2·4 + 3·2 − 3"), bi("8 + 6 − 3 = 11", "8 + 6 − 3 = 11")],
            explain: bi("2·2² + 3·2 − 3 = 8 + 6 − 3 = 11.", "2·2² + 3·2 − 3 = 8 + 6 − 3 = 11."),
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
      accept: ["polynomial", "a polynomial"],
      prompt: bi("Type the English word for “đa thức”.", "Gõ từ tiếng Anh của “đa thức”."),
      hints: [bi("poly- = many", "“poly-” nghĩa là nhiều."), bi("poly + nomial", "poly + nomial"), bi("polynomial", "polynomial")],
      explain: bi("polynomial /ˌpɒliˈnəʊmiəl/ = đa thức", "polynomial /ˌpɒliˈnəʊmiəl/ = đa thức"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 2,
      skill: "lang",
      answer: 2,
      prompt: bi("“Hạng tử đồng dạng” in English is…", "“Hạng tử đồng dạng” trong tiếng Anh là…"),
      options: ["equal terms", "same terms", "like terms", "similar degrees"].map((t) => bi(t, t)),
      hints: [bi("hạng tử = term", "hạng tử = term"), bi("đồng dạng = like (giống)", "đồng dạng = like"), bi("like terms", "like terms")],
      explain: bi("like terms = hạng tử đồng dạng", "like terms = hạng tử đồng dạng"),
    },
  ],
  generators: [
    { level: 1, make: genTerms },
    { level: 1, make: genDegree },
    { level: 2, make: genCollect },
    { level: 2, make: genValue },
    { level: 3, make: genTrapDegree },
    { level: 3, make: genCoefAfter },
  ],
  speak: [
    { en: "A polynomial is a sum of monomials.", vi: "Đa thức là một tổng của những đơn thức." },
    { en: "Each monomial is a term of the polynomial.", vi: "Mỗi đơn thức là một hạng tử của đa thức." },
    { en: "Collect like terms to simplify the polynomial.", vi: "Gộp các hạng tử đồng dạng để thu gọn đa thức." },
    { en: "The degree is the highest degree of its terms.", vi: "Bậc là bậc cao nhất của các hạng tử." },
    { en: "Substitute the values and calculate.", vi: "Thay giá trị vào rồi tính." },
  ],
  summary: [
    bi("Polynomial: a sum of monomials (terms).", "Đa thức: tổng của những đơn thức (hạng tử)."),
    bi("Simplified: no two like terms.", "Thu gọn: không có hai hạng tử đồng dạng."),
    bi("Degree: highest degree of the terms, after simplifying.", "Bậc: bậc cao nhất của các hạng tử, sau khi thu gọn."),
    bi("Value: substitute, then calculate.", "Giá trị: thay giá trị của biến rồi tính."),
  ],
};
