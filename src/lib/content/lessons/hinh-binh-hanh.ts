// Bài 12. Hình bình hành — Parallelograms (Toán 8 Kết nối tri thức, Chương III)
import { ABCD, bi, int, PARA } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const para = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: PARA, polygon: ABCD, ...extra });
const withO = (extra: Partial<FigureSpec> = {}) => para({ segments: [["A", "C"], ["B", "D"]], dots: ["O"], ...extra });

/** Cho hai cạnh kề, tìm cạnh đối */
function genSides(r: () => number): Question {
  const ab = int(r, 5, 12);
  const ad = int(r, 3, ab - 1);
  const askCD = r() < 0.5;
  return {
    id: `g-sides-${ab}-${ad}-${askCD ? "cd" : "bc"}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: " cm",
    answer: askCD ? ab : ad,
    prompt: bi(
      `ABCD is a parallelogram with AB = ${ab} cm and AD = ${ad} cm. Find ${askCD ? "CD" : "BC"}.`,
      `ABCD là hình bình hành có AB = ${ab} cm, AD = ${ad} cm. Tính ${askCD ? "CD" : "BC"}.`,
    ),
    figure: para({ sideLabels: [["A", "B", `${ab} cm`], ["A", "D", `${ad} cm`]] }),
    hints: [
      bi("opposite sides = hai cạnh đối", "Hai cạnh đối (opposite sides) của hình bình hành…"),
      bi("In a parallelogram, opposite sides are equal.", "Trong hình bình hành, các cạnh đối bằng nhau."),
      bi(askCD ? `CD = AB = ${ab} cm` : `BC = AD = ${ad} cm`, askCD ? `CD = AB = ${ab} cm` : `BC = AD = ${ad} cm`),
    ],
    explain: bi(
      `${askCD ? "CD and AB" : "BC and AD"} are opposite sides, so they are equal: ${askCD ? ab : ad} cm.`,
      `${askCD ? "CD và AB" : "BC và AD"} là hai cạnh đối nên bằng nhau: ${askCD ? ab : ad} cm.`,
    ),
  };
}

/** Cho một góc, tìm góc đối hoặc góc kề */
function genAngles(r: () => number): Question {
  const a = int(r, 50, 85, 5);
  const askB = r() < 0.6;
  const ans = askB ? 180 - a : a;
  return {
    id: `g-angle-${a}-${askB ? "b" : "c"}`,
    type: "number",
    level: askB ? 2 : 1,
    skill: "math",
    unit: "°",
    answer: ans,
    prompt: bi(`ABCD is a parallelogram with ∠A = ${a}°. Find ${askB ? "∠B" : "∠C"}.`, `ABCD là hình bình hành có ∠A = ${a}°. Tính ${askB ? "∠B" : "∠C"}.`),
    figure: para({ angleLabels: [["A", `${a}°`], [askB ? "B" : "C", "?"]] }),
    hints: askB
      ? [
          bi("∠A and ∠B are next to the same side AB.", "∠A và ∠B là hai góc kề cạnh AB."),
          bi("AD ∥ BC, so ∠A + ∠B = 180° (two angles next to one side are supplementary).", "AD ∥ BC nên ∠A + ∠B = 180° (hai góc kề một cạnh bù nhau)."),
          bi(`∠B = 180° − ${a}° = ${ans}°`, `∠B = 180° − ${a}° = ${ans}°`),
        ]
      : [
          bi("∠A and ∠C are opposite angles.", "∠A và ∠C là hai góc đối."),
          bi("In a parallelogram, opposite angles are equal.", "Trong hình bình hành, các góc đối bằng nhau."),
          bi(`∠C = ∠A = ${a}°`, `∠C = ∠A = ${a}°`),
        ],
    explain: askB
      ? bi(`∠A + ∠B = 180°, so ∠B = ${ans}°.`, `∠A + ∠B = 180° nên ∠B = ${ans}°.`)
      : bi(`Opposite angles are equal: ∠C = ∠A = ${a}°.`, `Các góc đối bằng nhau: ∠C = ∠A = ${a}°.`),
  };
}

/** Hai đường chéo cắt nhau tại trung điểm O */
function genDiagonals(r: () => number): Question {
  const half = int(r, 3, 9);
  const askHalf = r() < 0.5;
  return {
    id: `g-diag-${half}-${askHalf ? "oa" : "bd"}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: " cm",
    answer: askHalf ? half : 2 * half,
    prompt: askHalf
      ? bi(`Parallelogram ABCD has diagonals AC and BD meeting at O. AC = ${2 * half} cm. Find OA.`, `Hình bình hành ABCD có hai đường chéo AC, BD cắt nhau tại O. AC = ${2 * half} cm. Tính OA.`)
      : bi(`Parallelogram ABCD has diagonals AC and BD meeting at O. OB = ${half} cm. Find BD.`, `Hình bình hành ABCD có hai đường chéo AC, BD cắt nhau tại O. OB = ${half} cm. Tính BD.`),
    figure: withO(),
    hints: [
      bi("bisect = cắt nhau tại trung điểm; midpoint = trung điểm", "Trung điểm (midpoint) chia đoạn thẳng thành hai phần bằng nhau."),
      bi("The diagonals of a parallelogram bisect each other: O is the midpoint of AC and of BD.", "Hai đường chéo của hình bình hành cắt nhau tại trung điểm mỗi đường: O là trung điểm AC và BD."),
      askHalf ? bi(`OA = AC : 2 = ${half} cm`, `OA = AC : 2 = ${half} cm`) : bi(`BD = 2 × OB = ${2 * half} cm`, `BD = 2 × OB = ${2 * half} cm`),
    ],
    explain: askHalf ? bi(`O is the midpoint of AC, so OA = ${half} cm.`, `O là trung điểm AC nên OA = ${half} cm.`) : bi(`O is the midpoint of BD, so BD = ${2 * half} cm.`, `O là trung điểm BD nên BD = ${2 * half} cm.`),
  };
}

/** Chu vi hình bình hành */
function genPerimeter(r: () => number): Question {
  const ab = int(r, 6, 15);
  const ad = int(r, 3, ab - 1);
  return {
    id: `g-per-${ab}-${ad}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: " cm",
    answer: 2 * (ab + ad),
    prompt: bi(`ABCD is a parallelogram with AB = ${ab} cm and BC = ${ad} cm. Find its perimeter.`, `ABCD là hình bình hành có AB = ${ab} cm, BC = ${ad} cm. Tính chu vi.`),
    figure: para({ sideLabels: [["A", "B", `${ab} cm`], ["B", "C", `${ad} cm`]] }),
    hints: [
      bi("perimeter = chu vi = tổng độ dài các cạnh", "Chu vi (perimeter) = tổng độ dài bốn cạnh."),
      bi("CD = AB and DA = BC, so P = 2 × (AB + BC).", "CD = AB, DA = BC nên P = 2 × (AB + BC)."),
      bi(`P = 2 × (${ab} + ${ad}) = ${2 * (ab + ad)} cm`, `P = 2 × (${ab} + ${ad}) = ${2 * (ab + ad)} cm`),
    ],
    explain: bi(`P = 2 × (${ab} + ${ad}) = ${2 * (ab + ad)} cm.`, `Chu vi = 2 × (${ab} + ${ad}) = ${2 * (ab + ad)} cm.`),
  };
}

/** Biết chu vi và hiệu hai cạnh kề → tìm cạnh dài (bài toán tổng – hiệu) */
function genSumDiff(r: () => number): Question {
  const ad = int(r, 4, 10);
  const d = int(r, 1, 6);
  const ab = ad + d;
  const p = 2 * (ab + ad);
  return {
    id: `g-sumdiff-${ab}-${ad}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: " cm",
    answer: ab,
    prompt: bi(
      `Parallelogram ABCD has perimeter ${p} cm and AB is ${d} cm longer than AD. Find AB.`,
      `Hình bình hành ABCD có chu vi ${p} cm, cạnh AB dài hơn cạnh AD là ${d} cm. Tính AB.`,
    ),
    hints: [
      bi("“longer than” = dài hơn; perimeter = chu vi", "“dài hơn … cm” cho biết hiệu AB − AD."),
      bi(`AB + AD = half of the perimeter = ${p} : 2. Then use sum and difference.`, `AB + AD = nửa chu vi = ${p} : 2. Rồi giải bài toán tổng – hiệu.`),
      bi(`AB + AD = ${p / 2}, AB − AD = ${d} → AB = (${p / 2} + ${d}) : 2 = ${ab} cm`, `AB + AD = ${p / 2}, AB − AD = ${d} → AB = (${p / 2} + ${d}) : 2 = ${ab} cm`),
    ],
    explain: bi(`Half perimeter: ${p / 2} cm. AB = (${p / 2} + ${d}) : 2 = ${ab} cm.`, `Nửa chu vi: ${p / 2} cm. AB = (${p / 2} + ${d}) : 2 = ${ab} cm.`),
  };
}

/** Biết hiệu hai góc kề → tìm góc lớn */
function genAngleDiff(r: () => number): Question {
  const d = int(r, 2, 8) * 10;
  const a = (180 + d) / 2;
  return {
    id: `g-angdiff-${d}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: "°",
    answer: a,
    prompt: bi(`Parallelogram ABCD has ∠A − ∠B = ${d}°. Find ∠A.`, `Hình bình hành ABCD có ∠A − ∠B = ${d}°. Tính ∠A.`),
    hints: [
      bi("∠A and ∠B are next to side AB.", "∠A và ∠B là hai góc kề cạnh AB."),
      bi("∠A + ∠B = 180° and ∠A − ∠B is given → sum and difference.", "∠A + ∠B = 180° và biết ∠A − ∠B → bài toán tổng – hiệu."),
      bi(`∠A = (180° + ${d}°) : 2 = ${a}°`, `∠A = (180° + ${d}°) : 2 = ${a}°`),
    ],
    explain: bi(`∠A + ∠B = 180°, ∠A − ∠B = ${d}° ⇒ ∠A = ${a}°.`, `∠A + ∠B = 180°, ∠A − ∠B = ${d}° ⇒ ∠A = ${a}°.`),
  };
}

/** Nhận biết qua dấu hiệu (đúng/sai) */
const SIGNS: { s: [string, string]; ok: boolean; why: [string, string] }[] = [
  { s: ["A quadrilateral with opposite sides equal is a parallelogram.", "Tứ giác có các cạnh đối bằng nhau là hình bình hành."], ok: true, why: ["This is sign 2.", "Đây là dấu hiệu 2."] },
  { s: ["A quadrilateral with two opposite sides parallel and equal is a parallelogram.", "Tứ giác có hai cạnh đối song song và bằng nhau là hình bình hành."], ok: true, why: ["This is sign 3.", "Đây là dấu hiệu 3."] },
  { s: ["A quadrilateral with opposite angles equal is a parallelogram.", "Tứ giác có các góc đối bằng nhau là hình bình hành."], ok: true, why: ["This is sign 4.", "Đây là dấu hiệu 4."] },
  { s: ["A quadrilateral whose diagonals bisect each other is a parallelogram.", "Tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường là hình bình hành."], ok: true, why: ["This is sign 5.", "Đây là dấu hiệu 5."] },
  { s: ["A quadrilateral with one pair of parallel sides is a parallelogram.", "Tứ giác có một cặp cạnh đối song song là hình bình hành."], ok: false, why: ["It may only be a trapezoid: we need both pairs parallel (or one pair parallel AND equal).", "Có thể chỉ là hình thang: cần cả hai cặp cạnh đối song song (hoặc một cặp vừa song song vừa bằng nhau)."] },
  { s: ["A quadrilateral with two equal diagonals is a parallelogram.", "Tứ giác có hai đường chéo bằng nhau là hình bình hành."], ok: false, why: ["Equal diagonals are not enough (an isosceles trapezoid also has them). The diagonals must bisect each other.", "Hai đường chéo bằng nhau chưa đủ (hình thang cân cũng có). Phải cắt nhau tại trung điểm mỗi đường."] },
  { s: ["A quadrilateral with two adjacent sides equal is a parallelogram.", "Tứ giác có hai cạnh kề bằng nhau là hình bình hành."], ok: false, why: ["Adjacent sides tell us nothing; the signs are about opposite sides.", "Hai cạnh kề không nói lên điều gì; dấu hiệu nói về các cạnh đối."] },
];
function genSign(r: () => number): Question {
  const i = int(r, 0, SIGNS.length - 1);
  const x = SIGNS[i];
  return {
    id: `g-sign-${i}`,
    type: "tf",
    level: 2,
    skill: "lang",
    answer: x.ok,
    prompt: bi(`True or false: ${x.s[0]}`, `Đúng hay sai: ${x.s[1]}`),
    hints: [
      bi("Read carefully: opposite or adjacent? parallel or equal?", "Đọc kĩ: cạnh đối hay cạnh kề? song song hay bằng nhau?"),
      bi("Compare with the 5 signs of a parallelogram.", "So sánh với 5 dấu hiệu nhận biết hình bình hành."),
      bi(x.why[0], x.why[1]),
    ],
    explain: bi(`${x.ok ? "True" : "False"}. ${x.why[0]}`, `${x.ok ? "Đúng" : "Sai"}. ${x.why[1]}`),
  };
}

export const HINH_BINH_HANH: LessonContent = {
  id: "k8-12",
  slug: "hinh-binh-hanh",
  title: bi("Parallelograms", "Hình bình hành"),
  intro: bi(
    "Push a rectangle sideways and you get a parallelogram! It has beautiful properties about its sides, angles and diagonals.",
    "Đẩy nghiêng một hình chữ nhật, ta được hình bình hành! Hình này có những tính chất rất đẹp về cạnh, góc và đường chéo.",
  ),
  goals: [
    bi("Know the definition of a parallelogram.", "Hiểu định nghĩa hình bình hành."),
    bi("Use its properties: sides, angles, diagonals.", "Vận dụng tính chất về cạnh, góc, đường chéo."),
    bi("Recognise a parallelogram with 5 signs.", "Nhận biết hình bình hành bằng 5 dấu hiệu."),
  ],
  terms: [
    { id: "parallelogram", en: "parallelogram", ipa: "/ˌpærəˈleləɡræm/", vi: "hình bình hành", example: bi("ABCD is a parallelogram.", "ABCD là hình bình hành.") },
    { id: "parallel", en: "parallel", ipa: "/ˈpærəlel/", vi: "song song", example: bi("AB is parallel to CD (AB ∥ CD).", "AB song song với CD (AB ∥ CD).") },
    { id: "equal", en: "equal", ipa: "/ˈiːkwəl/", vi: "bằng nhau", example: bi("Opposite sides are equal.", "Các cạnh đối bằng nhau.") },
    { id: "midpoint", en: "midpoint", ipa: "/ˈmɪdpɔɪnt/", vi: "trung điểm", example: bi("O is the midpoint of AC.", "O là trung điểm của AC.") },
    { id: "intersect", en: "intersect", ipa: "/ˌɪntəˈsekt/", vi: "cắt nhau", example: bi("The diagonals intersect at O.", "Hai đường chéo cắt nhau tại O.") },
    { id: "bisect", en: "bisect each other", ipa: "/baɪˈsekt/", vi: "cắt nhau tại trung điểm mỗi đường", example: bi("The diagonals bisect each other.", "Hai đường chéo cắt nhau tại trung điểm của mỗi đường.") },
    { id: "property", en: "property", ipa: "/ˈprɒpəti/", vi: "tính chất", example: bi("Properties of a parallelogram", "Tính chất của hình bình hành") },
    { id: "sign", en: "sign (test)", ipa: "/saɪn/", vi: "dấu hiệu nhận biết", example: bi("There are five signs of a parallelogram.", "Có năm dấu hiệu nhận biết hình bình hành.") },
    { id: "supplementary", en: "supplementary angles", ipa: "/ˌsʌplɪˈmentri ˈæŋɡlz/", vi: "hai góc bù nhau", example: bi("∠A and ∠B are supplementary.", "∠A và ∠B bù nhau.") },
    { id: "perimeter", en: "perimeter", ipa: "/pəˈrɪmɪtə(r)/", vi: "chu vi", example: bi("The perimeter is 24 cm.", "Chu vi bằng 24 cm.") },
  ],
  sections: [
    {
      id: "dinh-nghia",
      title: bi("What is a parallelogram?", "Hình bình hành là gì?"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("A parallelogram is a quadrilateral whose opposite sides are parallel.", "Hình bình hành là tứ giác có các cạnh đối song song.") },
        { kind: "text", text: bi("ABCD is a parallelogram ⇔ AB ∥ CD and AD ∥ BC.", "ABCD là hình bình hành ⇔ AB ∥ CD và AD ∥ BC.") },
        { kind: "figure", figure: para(), caption: bi("Parallelogram ABCD", "Hình bình hành ABCD") },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "mcq",
            level: 1,
            skill: "lang",
            answer: 1,
            prompt: bi("“AB ∥ CD” is read as…", "“AB ∥ CD” đọc bằng tiếng Anh là…"),
            options: ["AB is equal to CD", "AB is parallel to CD", "AB is perpendicular to CD", "AB intersects CD"].map((t) => bi(t, t)),
            hints: [bi("∥ = parallel", "Kí hiệu ∥ nghĩa là song song."), bi("parallel = song song", "song song = parallel"), bi("AB is parallel to CD", "AB is parallel to CD")],
            explain: bi("The symbol ∥ means “is parallel to”.", "Kí hiệu ∥ đọc là “is parallel to” (song song với)."),
          },
        },
      ],
    },
    {
      id: "tinh-chat",
      title: bi("Properties", "Tính chất"),
      blocks: [
        {
          kind: "list",
          tag: bi("Theorem — In a parallelogram:", "Định lí — Trong hình bình hành:"),
          items: [
            bi("a) Opposite sides are equal: AB = CD, AD = BC.", "a) Các cạnh đối bằng nhau: AB = CD, AD = BC."),
            bi("b) Opposite angles are equal: ∠A = ∠C, ∠B = ∠D.", "b) Các góc đối bằng nhau: ∠A = ∠C, ∠B = ∠D."),
            bi("c) The diagonals bisect each other: OA = OC, OB = OD.", "c) Hai đường chéo cắt nhau tại trung điểm của mỗi đường: OA = OC, OB = OD."),
          ],
        },
        { kind: "figure", figure: withO({ ticks: [["A", "B", 1], ["D", "C", 1], ["A", "D", 2], ["B", "C", 2]] }), caption: bi("Same number of ticks = equal sides", "Cùng số vạch = hai cạnh bằng nhau") },
        { kind: "key", tag: bi("Bonus", "Thêm"), tone: "teal", text: bi("Two angles next to the same side are supplementary: ∠A + ∠B = 180°.", "Hai góc kề một cạnh thì bù nhau: ∠A + ∠B = 180°.") },
        { kind: "play", mode: "para" },
        {
          kind: "example",
          problem: bi("Parallelogram ABCD has AB = 7 cm, AD = 5 cm. Find CD, BC and the perimeter.", "Hình bình hành ABCD có AB = 7 cm, AD = 5 cm. Tính CD, BC và chu vi."),
          figure: para({ sideLabels: [["A", "B", "7 cm"], ["A", "D", "5 cm"]] }),
          steps: [
            bi("Opposite sides are equal: CD = AB = 7 cm.", "Các cạnh đối bằng nhau: CD = AB = 7 cm."),
            bi("BC = AD = 5 cm.", "BC = AD = 5 cm."),
            bi("Perimeter = 2 × (7 + 5) = 24 cm.", "Chu vi = 2 × (7 + 5) = 24 cm."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "number",
            level: 1,
            skill: "math",
            unit: "°",
            answer: 115,
            prompt: bi("Parallelogram ABCD has ∠A = 65°. Find ∠B.", "Hình bình hành ABCD có ∠A = 65°. Tính ∠B."),
            figure: para({ angleLabels: [["A", "65°"], ["B", "?"]] }),
            hints: [bi("supplementary = bù nhau (tổng 180°)", "Bù nhau = tổng bằng 180°."), bi("∠A + ∠B = 180°", "∠A + ∠B = 180°"), bi("∠B = 180° − 65° = 115°", "∠B = 180° − 65° = 115°")],
            explain: bi("∠A + ∠B = 180°, so ∠B = 115°.", "∠A + ∠B = 180° nên ∠B = 115°."),
          },
        },
      ],
    },
    {
      id: "dau-hieu",
      title: bi("How to recognise a parallelogram", "Dấu hiệu nhận biết"),
      blocks: [
        {
          kind: "list",
          tag: bi("A quadrilateral is a parallelogram if it has:", "Tứ giác là hình bình hành nếu có:"),
          items: [
            bi("1. both pairs of opposite sides parallel;", "1. Các cạnh đối song song;"),
            bi("2. both pairs of opposite sides equal;", "2. Các cạnh đối bằng nhau;"),
            bi("3. one pair of opposite sides parallel and equal;", "3. Hai cạnh đối song song và bằng nhau;"),
            bi("4. both pairs of opposite angles equal;", "4. Các góc đối bằng nhau;"),
            bi("5. diagonals that bisect each other.", "5. Hai đường chéo cắt nhau tại trung điểm của mỗi đường."),
          ],
        },
        {
          kind: "example",
          problem: bi("Quadrilateral ABCD has diagonals meeting at O with OA = OC = 4 cm and OB = OD = 6 cm. Is ABCD a parallelogram?", "Tứ giác ABCD có hai đường chéo cắt nhau tại O, OA = OC = 4 cm, OB = OD = 6 cm. ABCD có là hình bình hành không?"),
          figure: withO({ ticks: [["A", "O", 1], ["O", "C", 1], ["B", "O", 2], ["O", "D", 2]] }),
          steps: [
            bi("OA = OC → O is the midpoint of AC.", "OA = OC → O là trung điểm của AC."),
            bi("OB = OD → O is the midpoint of BD.", "OB = OD → O là trung điểm của BD."),
            bi("The diagonals bisect each other → ABCD is a parallelogram (sign 5).", "Hai đường chéo cắt nhau tại trung điểm mỗi đường → ABCD là hình bình hành (dấu hiệu 5)."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c3",
            type: "tf",
            level: 2,
            skill: "math",
            answer: false,
            prompt: bi("True or false: A quadrilateral with AB ∥ CD and AD = BC is always a parallelogram.", "Đúng hay sai: Tứ giác có AB ∥ CD và AD = BC luôn là hình bình hành."),
            hints: [bi("Sign 3 needs the SAME pair to be parallel and equal.", "Dấu hiệu 3 cần CÙNG một cặp cạnh vừa song song vừa bằng nhau."), bi("Here AB ∥ CD but the equal pair is AD, BC.", "Ở đây AB ∥ CD nhưng cặp bằng nhau lại là AD, BC."), bi("An isosceles trapezoid is a counterexample.", "Hình thang cân là ví dụ phản bác.")],
            explain: bi("False: an isosceles trapezoid has AB ∥ CD and AD = BC but is not a parallelogram.", "Sai: hình thang cân có AB ∥ CD, AD = BC nhưng không phải hình bình hành."),
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
      accept: ["parallelogram", "a parallelogram"],
      prompt: bi("Type the English word for “hình bình hành”.", "Gõ từ tiếng Anh của “hình bình hành”."),
      hints: [bi("It contains the word “parallel”.", "Có chứa từ “parallel” (song song)."), bi("parallel + o + gram", "parallel + o + gram"), bi("parallelogram", "parallelogram")],
      explain: bi("parallelogram /ˌpærəˈleləɡræm/ = hình bình hành", "parallelogram /ˌpærəˈleləɡræm/ = hình bình hành"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 1,
      skill: "math",
      answer: 2,
      prompt: bi("Which is NOT always true for parallelogram ABCD?", "Điều nào KHÔNG phải lúc nào cũng đúng với hình bình hành ABCD?"),
      options: [bi("AB = CD", "AB = CD"), bi("∠A = ∠C", "∠A = ∠C"), bi("AC = BD", "AC = BD"), bi("OA = OC", "OA = OC")],
      hints: [bi("NOT = không", "Tìm điều KHÔNG luôn đúng."), bi("Check each property: sides, angles, diagonals.", "Kiểm tra từng tính chất: cạnh, góc, đường chéo."), bi("Diagonals bisect each other but are not always equal.", "Hai đường chéo cắt nhau tại trung điểm nhưng không nhất thiết bằng nhau.")],
      explain: bi("AC = BD is true only in special parallelograms (like rectangles).", "AC = BD chỉ đúng ở hình bình hành đặc biệt (như hình chữ nhật)."),
    },
    {
      id: "p3",
      type: "mcq",
      level: 2,
      skill: "lang",
      answer: 0,
      prompt: bi("Choose the correct English sentence for “Các góc đối bằng nhau”.", "Chọn câu tiếng Anh đúng cho “Các góc đối bằng nhau”."),
      options: ["Opposite angles are equal.", "Adjacent angles are equal.", "Opposite sides are parallel.", "Opposite angles are parallel."].map((t) => bi(t, t)),
      hints: [bi("góc = angle; đối = opposite", "góc = angle; đối = opposite"), bi("bằng nhau = equal", "bằng nhau = equal"), bi("Opposite angles are equal.", "Opposite angles are equal.")],
      explain: bi("“Opposite angles are equal.” Angles can be equal, but not parallel.", "“Opposite angles are equal.” Góc có thể bằng nhau, nhưng không “song song”."),
    },
  ],
  generators: [
    { level: 1, make: genSides },
    { level: 1, make: genAngles },
    { level: 2, make: genDiagonals },
    { level: 2, make: genPerimeter },
    { level: 2, make: genSign },
    { level: 3, make: genSumDiff },
    { level: 3, make: genAngleDiff },
  ],
  speak: [
    { en: "A parallelogram has two pairs of parallel sides.", vi: "Hình bình hành có hai cặp cạnh song song." },
    { en: "Opposite sides of a parallelogram are equal.", vi: "Các cạnh đối của hình bình hành bằng nhau." },
    { en: "Opposite angles are equal.", vi: "Các góc đối bằng nhau." },
    { en: "The diagonals bisect each other.", vi: "Hai đường chéo cắt nhau tại trung điểm của mỗi đường." },
    { en: "AB is parallel to CD.", vi: "AB song song với CD." },
  ],
  summary: [
    bi("Definition: opposite sides parallel (AB ∥ CD, AD ∥ BC).", "Định nghĩa: các cạnh đối song song (AB ∥ CD, AD ∥ BC)."),
    bi("Properties: opposite sides equal; opposite angles equal; diagonals bisect each other.", "Tính chất: cạnh đối bằng nhau; góc đối bằng nhau; hai đường chéo cắt nhau tại trung điểm mỗi đường."),
    bi("∠A + ∠B = 180° (angles next to one side)", "∠A + ∠B = 180° (hai góc kề một cạnh)"),
    bi("Perimeter P = 2 × (AB + AD)", "Chu vi P = 2 × (AB + AD)"),
  ],
};
