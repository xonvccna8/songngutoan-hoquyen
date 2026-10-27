// Bài 11. Hình thang cân — Isosceles trapezoids (Toán 8 Kết nối tri thức, Chương III)
import { ABCD, bi, int, RIGHT_TRAP, TRAP } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const trap = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: TRAP, polygon: ABCD, ...extra });
const trapDiag = (extra: Partial<FigureSpec> = {}) => trap({ segments: [["A", "C"], ["B", "D"]], ...extra });

/** Biết một góc kề đáy lớn → góc còn lại (cùng đáy hoặc kề cạnh bên) */
function genBaseAngle(r: () => number): Question {
  const d = int(r, 50, 80, 5);
  const askA = r() < 0.5;
  const ans = askA ? 180 - d : d;
  return {
    id: `g-tbase-${d}-${askA ? "a" : "c"}`,
    type: "number",
    level: askA ? 2 : 1,
    skill: "math",
    unit: "°",
    answer: ans,
    prompt: bi(`ABCD is an isosceles trapezoid (AB ∥ CD) with ∠D = ${d}°. Find ${askA ? "∠A" : "∠C"}.`, `ABCD là hình thang cân (AB ∥ CD) có ∠D = ${d}°. Tính ${askA ? "∠A" : "∠C"}.`),
    figure: trap({ angleLabels: [["D", `${d}°`], [askA ? "A" : "C", "?"]] }),
    hints: askA
      ? [
          bi("∠A and ∠D are next to the same leg AD.", "∠A và ∠D là hai góc kề cạnh bên AD."),
          bi("AB ∥ CD, so ∠A + ∠D = 180°.", "AB ∥ CD nên ∠A + ∠D = 180° (hai góc trong cùng phía)."),
          bi(`∠A = 180° − ${d}° = ${ans}°`, `∠A = 180° − ${d}° = ${ans}°`),
        ]
      : [
          bi("base angles = hai góc kề một đáy", "∠C và ∠D là hai góc kề đáy CD."),
          bi("In an isosceles trapezoid, the two base angles are equal.", "Trong hình thang cân, hai góc kề một đáy bằng nhau."),
          bi(`∠C = ∠D = ${d}°`, `∠C = ∠D = ${d}°`),
        ],
    explain: askA ? bi(`∠A + ∠D = 180°, so ∠A = ${ans}°.`, `∠A + ∠D = 180° nên ∠A = ${ans}°.`) : bi(`Base angles are equal: ∠C = ${d}°.`, `Hai góc kề đáy bằng nhau: ∠C = ${d}°.`),
  };
}

/** Cạnh bên hoặc đường chéo bằng nhau */
function genEqual(r: () => number): Question {
  const v = int(r, 4, 15);
  const diag = r() < 0.5;
  return {
    id: `g-teq-${v}-${diag ? "d" : "l"}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: " cm",
    answer: v,
    prompt: diag
      ? bi(`ABCD is an isosceles trapezoid (AB ∥ CD) with AC = ${v} cm. Find BD.`, `ABCD là hình thang cân (AB ∥ CD) có AC = ${v} cm. Tính BD.`)
      : bi(`ABCD is an isosceles trapezoid (AB ∥ CD) with AD = ${v} cm. Find BC.`, `ABCD là hình thang cân (AB ∥ CD) có AD = ${v} cm. Tính BC.`),
    figure: diag ? trapDiag({ sideLabels: [["A", "C", `${v} cm`]] }) : trap({ sideLabels: [["A", "D", `${v} cm`]] }),
    hints: diag
      ? [bi("diagonal = đường chéo", "AC và BD là hai đường chéo."), bi("In an isosceles trapezoid, the diagonals are equal.", "Trong hình thang cân, hai đường chéo bằng nhau."), bi(`BD = AC = ${v} cm`, `BD = AC = ${v} cm`)]
      : [bi("leg = cạnh bên", "AD và BC là hai cạnh bên."), bi("In an isosceles trapezoid, the legs are equal.", "Trong hình thang cân, hai cạnh bên bằng nhau."), bi(`BC = AD = ${v} cm`, `BC = AD = ${v} cm`)],
    explain: diag ? bi(`Equal diagonals: BD = ${v} cm.`, `Hai đường chéo bằng nhau: BD = ${v} cm.`) : bi(`Equal legs: BC = ${v} cm.`, `Hai cạnh bên bằng nhau: BC = ${v} cm.`),
  };
}

/** Chu vi → cạnh bên */
function genPerimeter(r: () => number): Question {
  const ab = int(r, 3, 8);
  const cd = ab + int(r, 2, 8);
  const leg = int(r, 3, 9);
  const p = ab + cd + 2 * leg;
  return {
    id: `g-tper-${ab}-${cd}-${leg}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: " cm",
    answer: leg,
    prompt: bi(
      `Isosceles trapezoid ABCD has bases AB = ${ab} cm, CD = ${cd} cm and perimeter ${p} cm. Find the leg AD.`,
      `Hình thang cân ABCD có hai đáy AB = ${ab} cm, CD = ${cd} cm và chu vi ${p} cm. Tính cạnh bên AD.`,
    ),
    figure: trap({ sideLabels: [["A", "B", `${ab} cm`], ["D", "C", `${cd} cm`], ["A", "D", "?"]] }),
    hints: [
      bi("perimeter = chu vi; leg = cạnh bên", "Chu vi = AB + BC + CD + DA."),
      bi("The two legs are equal: AD = BC.", "Hai cạnh bên bằng nhau: AD = BC, nên chu vi = AB + CD + 2 × AD."),
      bi(`2 × AD = ${p} − ${ab} − ${cd} = ${2 * leg} → AD = ${leg} cm`, `2 × AD = ${p} − ${ab} − ${cd} = ${2 * leg} → AD = ${leg} cm`),
    ],
    explain: bi(`AD = (${p} − ${ab} − ${cd}) : 2 = ${leg} cm.`, `AD = (${p} − ${ab} − ${cd}) : 2 = ${leg} cm.`),
  };
}

/** Biết hiệu hai góc kề cạnh bên → góc kề đáy lớn (tổng – hiệu) */
function genAngleDiff(r: () => number): Question {
  const diff = int(r, 2, 10) * 10;
  const d = (180 - diff) / 2;
  return {
    id: `g-tdiff-${diff}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: "°",
    answer: d,
    prompt: bi(`Isosceles trapezoid ABCD (AB ∥ CD) has ∠A − ∠D = ${diff}°. Find ∠D.`, `Hình thang cân ABCD (AB ∥ CD) có ∠A − ∠D = ${diff}°. Tính ∠D.`),
    figure: trap(),
    hints: [
      bi("∠A and ∠D are next to leg AD.", "∠A và ∠D là hai góc kề cạnh bên AD."),
      bi(`∠A + ∠D = 180° and ∠A − ∠D = ${diff}° → sum and difference.`, `∠A + ∠D = 180° và ∠A − ∠D = ${diff}° → bài toán tổng – hiệu.`),
      bi(`∠D = (180° − ${diff}°) : 2 = ${d}°`, `∠D = (180° − ${diff}°) : 2 = ${d}°`),
    ],
    explain: bi(`∠D = (180° − ${diff}°) : 2 = ${d}°.`, `∠D = (180° − ${diff}°) : 2 = ${d}°.`),
  };
}

/** Hình thang vuông: góc còn lại */
function genRightTrap(r: () => number): Question {
  const c = int(r, 50, 80, 5);
  return {
    id: `g-rtrap-${c}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: "°",
    answer: 180 - c,
    prompt: bi(`Right trapezoid ABCD has AB ∥ CD, ∠A = ∠D = 90° and ∠C = ${c}°. Find ∠B.`, `Hình thang vuông ABCD có AB ∥ CD, ∠A = ∠D = 90° và ∠C = ${c}°. Tính ∠B.`),
    figure: { points: RIGHT_TRAP, polygon: ABCD, rightAngles: ["A", "D"], angleLabels: [["C", `${c}°`], ["B", "?"]] },
    hints: [
      bi("right trapezoid = hình thang vuông", "∠B và ∠C là hai góc kề cạnh bên BC."),
      bi("AB ∥ CD, so ∠B + ∠C = 180°.", "AB ∥ CD nên ∠B + ∠C = 180°."),
      bi(`∠B = 180° − ${c}° = ${180 - c}°`, `∠B = 180° − ${c}° = ${180 - c}°`),
    ],
    explain: bi(`∠B + ∠C = 180°, so ∠B = ${180 - c}°.`, `∠B + ∠C = 180° nên ∠B = ${180 - c}°.`),
  };
}

const SIGNS: { s: [string, string]; ok: boolean; why: [string, string] }[] = [
  { s: ["A trapezoid with two equal base angles is an isosceles trapezoid.", "Hình thang có hai góc kề một đáy bằng nhau là hình thang cân."], ok: true, why: ["This is the definition.", "Đây chính là định nghĩa hình thang cân."] },
  { s: ["A trapezoid with equal diagonals is an isosceles trapezoid.", "Hình thang có hai đường chéo bằng nhau là hình thang cân."], ok: true, why: ["This is the sign of an isosceles trapezoid.", "Đây là dấu hiệu nhận biết hình thang cân."] },
  { s: ["In an isosceles trapezoid, the two legs are equal.", "Trong hình thang cân, hai cạnh bên bằng nhau."], ok: true, why: ["This is a property.", "Đây là một tính chất của hình thang cân."] },
  { s: ["A trapezoid with two equal legs is always an isosceles trapezoid.", "Hình thang có hai cạnh bên bằng nhau luôn là hình thang cân."], ok: false, why: ["A parallelogram also has equal legs but is usually not an isosceles trapezoid.", "Hình bình hành cũng có hai cạnh bên bằng nhau nhưng thường không phải hình thang cân."] },
  { s: ["In a trapezoid, two angles next to a leg add up to 180°.", "Trong hình thang, hai góc kề một cạnh bên có tổng 180°."], ok: true, why: ["The two bases are parallel.", "Vì hai đáy song song."] },
  { s: ["In an isosceles trapezoid, the diagonals are perpendicular.", "Trong hình thang cân, hai đường chéo vuông góc với nhau."], ok: false, why: ["The diagonals are equal, not necessarily perpendicular.", "Hai đường chéo bằng nhau, chưa chắc vuông góc."] },
];
function genSign(r: () => number): Question {
  const i = int(r, 0, SIGNS.length - 1);
  const x = SIGNS[i];
  return {
    id: `g-tsign-${i}`,
    type: "tf",
    level: 2,
    skill: "lang",
    answer: x.ok,
    prompt: bi(`True or false: ${x.s[0]}`, `Đúng hay sai: ${x.s[1]}`),
    hints: [
      bi("leg = cạnh bên; base angles = góc kề đáy; diagonal = đường chéo", "Đọc kĩ: nói về góc, cạnh bên hay đường chéo?"),
      bi("Compare with the definition, properties and sign of an isosceles trapezoid.", "So sánh với định nghĩa, tính chất và dấu hiệu nhận biết hình thang cân."),
      bi(x.why[0], x.why[1]),
    ],
    explain: bi(`${x.ok ? "True" : "False"}. ${x.why[0]}`, `${x.ok ? "Đúng" : "Sai"}. ${x.why[1]}`),
  };
}

export const HINH_THANG_CAN: LessonContent = {
  id: "k8-11",
  slug: "hinh-thang-can",
  title: bi("Isosceles trapezoids", "Hình thang cân"),
  intro: bi(
    "A bucket seen from the side, a lampshade, a handbag… Many objects have a trapezoid shape. The isosceles trapezoid is the one that looks the same on the left and on the right!",
    "Chiếc xô nhìn ngang, chụp đèn, túi xách… Nhiều đồ vật có dạng hình thang. Hình thang cân là hình thang trông giống hệt nhau ở bên trái và bên phải!",
  ),
  goals: [
    bi("Know trapezoids, right trapezoids and isosceles trapezoids.", "Nhận biết hình thang, hình thang vuông, hình thang cân."),
    bi("Explain the properties of base angles, legs and diagonals.", "Giải thích tính chất về góc kề đáy, cạnh bên, đường chéo của hình thang cân."),
    bi("Recognise an isosceles trapezoid.", "Nhận biết một hình thang là hình thang cân."),
  ],
  terms: [
    { id: "trapezoid", en: "trapezoid", ipa: "/ˈtræpəzɔɪd/", vi: "hình thang", example: bi("ABCD is a trapezoid with AB ∥ CD.", "ABCD là hình thang có AB ∥ CD.") },
    { id: "isosceles-trap", en: "isosceles trapezoid", ipa: "/aɪˈsɒsəliːz ˈtræpəzɔɪd/", vi: "hình thang cân", example: bi("An isosceles trapezoid has equal legs.", "Hình thang cân có hai cạnh bên bằng nhau.") },
    { id: "base", en: "base", ipa: "/beɪs/", vi: "đáy", example: bi("AB and CD are the two bases.", "AB và CD là hai đáy.") },
    { id: "leg", en: "leg", ipa: "/leɡ/", vi: "cạnh bên", example: bi("AD and BC are the legs.", "AD và BC là hai cạnh bên.") },
    { id: "height", en: "height", ipa: "/haɪt/", vi: "đường cao; chiều cao", example: bi("The height is the distance between the bases.", "Chiều cao là khoảng cách giữa hai đáy.") },
    { id: "right-trapezoid", en: "right trapezoid", ipa: "/raɪt ˈtræpəzɔɪd/", vi: "hình thang vuông", example: bi("A right trapezoid has a right angle.", "Hình thang vuông có một góc vuông.") },
    { id: "base-angles", en: "base angles", ipa: "/beɪs ˈæŋɡlz/", vi: "hai góc kề một đáy", example: bi("∠C and ∠D are base angles.", "∠C và ∠D là hai góc kề đáy CD.") },
    { id: "longer-base", en: "longer base", ipa: "/ˈlɒŋɡə beɪs/", vi: "đáy lớn", example: bi("CD is the longer base.", "CD là đáy lớn.") },
    { id: "shorter-base", en: "shorter base", ipa: "/ˈʃɔːtə beɪs/", vi: "đáy nhỏ", example: bi("AB is the shorter base.", "AB là đáy nhỏ.") },
    { id: "axis-symmetry", en: "axis of symmetry", ipa: "/ˈæksɪs əv ˈsɪmətri/", vi: "trục đối xứng", example: bi("An isosceles trapezoid has an axis of symmetry.", "Hình thang cân có một trục đối xứng.") },
  ],
  sections: [
    {
      id: "hinh-thang",
      title: bi("Trapezoids", "Hình thang"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("A trapezoid is a quadrilateral with two parallel opposite sides.", "Hình thang là tứ giác có hai cạnh đối song song.") },
        { kind: "figure", figure: trap(), caption: bi("Trapezoid ABCD: AB ∥ CD", "Hình thang ABCD: AB ∥ CD") },
        {
          kind: "list",
          tag: bi("Parts of a trapezoid", "Các yếu tố của hình thang"),
          items: [
            bi("Bases: the two parallel sides AB (shorter base) and CD (longer base).", "Đáy: hai cạnh song song AB (đáy nhỏ) và CD (đáy lớn)."),
            bi("Legs: the other two sides AD and BC.", "Cạnh bên: hai cạnh còn lại AD và BC."),
            bi("Height: the distance between the two bases.", "Đường cao: đoạn vuông góc nối hai đáy; độ dài là chiều cao."),
            bi("Two angles next to a leg are supplementary: ∠A + ∠D = 180°, ∠B + ∠C = 180°.", "Hai góc kề một cạnh bên bù nhau: ∠A + ∠D = 180°, ∠B + ∠C = 180°."),
          ],
        },
        { kind: "key", tag: bi("Right trapezoid", "Hình thang vuông"), tone: "teal", text: bi("A right trapezoid is a trapezoid with a right angle.", "Hình thang vuông là hình thang có một góc vuông.") },
        { kind: "figure", figure: { points: RIGHT_TRAP, polygon: ABCD, rightAngles: ["A", "D"] }, caption: bi("Right trapezoid ABCD (∠A = ∠D = 90°)", "Hình thang vuông ABCD (∠A = ∠D = 90°)") },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "mcq",
            level: 1,
            skill: "lang",
            answer: 1,
            prompt: bi("In trapezoid ABCD with AB ∥ CD, what are AD and BC called?", "Trong hình thang ABCD có AB ∥ CD, AD và BC được gọi là gì?"),
            options: ["bases", "legs", "diagonals", "heights"].map((t) => bi(t, t)),
            hints: [bi("AB and CD are the bases.", "AB và CD là hai đáy."), bi("The other two sides …", "Hai cạnh còn lại gọi là cạnh bên."), bi("cạnh bên = legs", "cạnh bên = legs")],
            explain: bi("AD and BC are the legs of the trapezoid.", "AD và BC là hai cạnh bên (legs) của hình thang."),
          },
        },
      ],
    },
    {
      id: "hinh-thang-can",
      title: bi("Isosceles trapezoids and their properties", "Hình thang cân và tính chất"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("An isosceles trapezoid is a trapezoid with two equal angles next to a base.", "Hình thang cân là hình thang có hai góc kề một đáy bằng nhau.") },
        { kind: "text", text: bi("ABCD (AB ∥ CD) is an isosceles trapezoid ⇔ ∠C = ∠D (or ∠A = ∠B).", "ABCD (AB ∥ CD) là hình thang cân ⇔ ∠C = ∠D (hoặc ∠A = ∠B).") },
        {
          kind: "list",
          tag: bi("Theorem — In an isosceles trapezoid:", "Định lí — Trong hình thang cân:"),
          items: [bi("the two legs are equal: AD = BC;", "hai cạnh bên bằng nhau: AD = BC;"), bi("the two diagonals are equal: AC = BD.", "hai đường chéo bằng nhau: AC = BD.")],
        },
        { kind: "figure", figure: trapDiag({ ticks: [["A", "D", 1], ["B", "C", 1]] }), caption: bi("AD = BC and AC = BD", "AD = BC và AC = BD") },
        { kind: "play", mode: "trap" },
        {
          kind: "example",
          problem: bi("Isosceles trapezoid ABCD (AB ∥ CD) has ∠D = 65°. Find ∠C, ∠A and ∠B.", "Hình thang cân ABCD (AB ∥ CD) có ∠D = 65°. Tính ∠C, ∠A, ∠B."),
          figure: trap({ angleLabels: [["D", "65°"]] }),
          steps: [
            bi("Base angles are equal: ∠C = ∠D = 65°.", "Hai góc kề đáy CD bằng nhau: ∠C = ∠D = 65°."),
            bi("AB ∥ CD, so ∠A + ∠D = 180° → ∠A = 115°.", "AB ∥ CD nên ∠A + ∠D = 180° → ∠A = 115°."),
            bi("∠B = ∠A = 115° (base angles of AB).", "∠B = ∠A = 115° (hai góc kề đáy AB)."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "number",
            level: 1,
            skill: "math",
            unit: " cm",
            answer: 9,
            prompt: bi("Isosceles trapezoid ABCD (AB ∥ CD) has BD = 9 cm. Find AC.", "Hình thang cân ABCD (AB ∥ CD) có BD = 9 cm. Tính AC."),
            figure: trapDiag({ sideLabels: [["B", "D", "9 cm"]] }),
            hints: [bi("diagonals = đường chéo", "AC và BD là hai đường chéo."), bi("They are equal in an isosceles trapezoid.", "Hình thang cân có hai đường chéo bằng nhau."), bi("AC = BD = 9 cm", "AC = BD = 9 cm")],
            explain: bi("AC = BD = 9 cm.", "AC = BD = 9 cm."),
          },
        },
      ],
    },
    {
      id: "dau-hieu",
      title: bi("How to recognise an isosceles trapezoid", "Dấu hiệu nhận biết"),
      blocks: [
        {
          kind: "list",
          tag: bi("A trapezoid is isosceles if:", "Hình thang là hình thang cân nếu:"),
          items: [bi("it has two equal angles next to a base (definition);", "có hai góc kề một đáy bằng nhau (định nghĩa);"), bi("it has two equal diagonals (sign).", "có hai đường chéo bằng nhau (dấu hiệu nhận biết).")],
        },
        { kind: "key", tag: bi("Be careful!", "Chú ý!"), tone: "coral", text: bi("A trapezoid with two equal legs is NOT always isosceles: a parallelogram is a trapezoid with equal legs too.", "Hình thang có hai cạnh bên bằng nhau CHƯA CHẮC là hình thang cân: hình bình hành cũng là hình thang có hai cạnh bên bằng nhau.") },
        {
          kind: "example",
          problem: bi("Trapezoid ABCD (AB ∥ CD) has AC = BD = 8 cm. Is it an isosceles trapezoid? Find ∠C if ∠D = 70°.", "Hình thang ABCD (AB ∥ CD) có AC = BD = 8 cm. ABCD có là hình thang cân không? Tính ∠C nếu ∠D = 70°."),
          figure: trapDiag({ angleLabels: [["D", "70°"]] }),
          steps: [
            bi("The diagonals are equal → ABCD is an isosceles trapezoid.", "Hai đường chéo bằng nhau → ABCD là hình thang cân."),
            bi("So the base angles are equal: ∠C = ∠D = 70°.", "Do đó hai góc kề đáy bằng nhau: ∠C = ∠D = 70°."),
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
            prompt: bi("True or false: A trapezoid with two equal legs is always an isosceles trapezoid.", "Đúng hay sai: Hình thang có hai cạnh bên bằng nhau luôn là hình thang cân."),
            hints: [bi("leg = cạnh bên", "Nghĩ tới hình bình hành."), bi("Is a parallelogram a trapezoid? Are its legs equal?", "Hình bình hành có phải hình thang không? Hai cạnh bên có bằng nhau không?"), bi("Yes and yes — but it is not isosceles.", "Có và có — nhưng nó không phải hình thang cân.")],
            explain: bi("False: a parallelogram has equal legs but its base angles are usually not equal.", "Sai: hình bình hành có hai cạnh bên bằng nhau nhưng hai góc kề đáy thường không bằng nhau."),
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
      accept: ["trapezoid", "a trapezoid", "trapezium"],
      prompt: bi("Type the English word for “hình thang”.", "Gõ từ tiếng Anh của “hình thang”."),
      hints: [bi("It starts with “trap-”.", "Bắt đầu bằng “trap-”."), bi("trap-e-zoid", "trap-e-zoid"), bi("trapezoid (British English: trapezium)", "trapezoid (tiếng Anh – Anh: trapezium)")],
      explain: bi("trapezoid /ˈtræpəzɔɪd/ = hình thang (British English: trapezium)", "trapezoid /ˈtræpəzɔɪd/ = hình thang (Anh – Anh: trapezium)"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 1,
      skill: "math",
      answer: 2,
      prompt: bi("Isosceles trapezoid ABCD (AB ∥ CD). Which is always true?", "Hình thang cân ABCD (AB ∥ CD). Điều nào luôn đúng?"),
      options: [bi("AB = CD", "AB = CD"), bi("AC ⊥ BD", "AC ⊥ BD"), bi("AC = BD", "AC = BD"), bi("∠A = ∠C", "∠A = ∠C")],
      hints: [bi("Think about the diagonals.", "Nghĩ về hai đường chéo."), bi("The bases are usually different lengths.", "Hai đáy thường dài khác nhau."), bi("The diagonals are equal.", "Hai đường chéo bằng nhau.")],
      explain: bi("In an isosceles trapezoid the diagonals are equal: AC = BD.", "Trong hình thang cân, hai đường chéo bằng nhau: AC = BD."),
    },
    {
      id: "p3",
      type: "mcq",
      level: 2,
      skill: "lang",
      answer: 0,
      prompt: bi("Choose the correct English sentence for “Hai cạnh bên bằng nhau”.", "Chọn câu tiếng Anh đúng cho “Hai cạnh bên bằng nhau”."),
      options: ["The two legs are equal.", "The two bases are equal.", "The two legs are parallel.", "The two diagonals are equal."].map((t) => bi(t, t)),
      hints: [bi("cạnh bên = leg", "cạnh bên = leg"), bi("bằng nhau = equal", "bằng nhau = equal"), bi("The two legs are equal.", "The two legs are equal.")],
      explain: bi("“The two legs are equal.” Legs = cạnh bên, bases = đáy.", "“The two legs are equal.” Legs = cạnh bên, bases = đáy."),
    },
  ],
  generators: [
    { level: 1, make: genBaseAngle },
    { level: 1, make: genEqual },
    { level: 2, make: genRightTrap },
    { level: 2, make: genSign },
    { level: 3, make: genPerimeter },
    { level: 3, make: genAngleDiff },
  ],
  speak: [
    { en: "A trapezoid has two parallel sides.", vi: "Hình thang có hai cạnh song song." },
    { en: "The two parallel sides are called the bases.", vi: "Hai cạnh song song được gọi là hai đáy." },
    { en: "An isosceles trapezoid has two equal legs.", vi: "Hình thang cân có hai cạnh bên bằng nhau." },
    { en: "The diagonals of an isosceles trapezoid are equal.", vi: "Hai đường chéo của hình thang cân bằng nhau." },
    { en: "The base angles are equal.", vi: "Hai góc kề một đáy bằng nhau." },
  ],
  summary: [
    bi("Trapezoid: two parallel opposite sides (bases); the other two are legs.", "Hình thang: tứ giác có hai cạnh đối song song (hai đáy); hai cạnh còn lại là cạnh bên."),
    bi("In a trapezoid: ∠A + ∠D = 180°, ∠B + ∠C = 180°.", "Trong hình thang: ∠A + ∠D = 180°, ∠B + ∠C = 180°."),
    bi("Isosceles trapezoid: two equal base angles; legs equal; diagonals equal.", "Hình thang cân: hai góc kề một đáy bằng nhau; cạnh bên bằng nhau; đường chéo bằng nhau."),
    bi("Sign: a trapezoid with equal diagonals is isosceles.", "Dấu hiệu: hình thang có hai đường chéo bằng nhau là hình thang cân."),
  ],
};
