// Bài 14. Hình thoi và hình vuông — Rhombuses and squares (Toán 8 Kết nối tri thức, Chương III)
import { ABCD, bi, int, RHOMB, SQUARE } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const rhomb = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: RHOMB, polygon: ABCD, ...extra });
const rhombO = (extra: Partial<FigureSpec> = {}) => rhomb({ segments: [["A", "C"], ["B", "D"]], dots: ["O"], ...extra });
const square = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: SQUARE, polygon: ABCD, rightAngles: ABCD, ...extra });
const squareO = (extra: Partial<FigureSpec> = {}) => square({ segments: [["A", "C"], ["B", "D"]], dots: ["O"], ...extra });

/** Chu vi hình thoi ↔ cạnh */
function genRhombPerimeter(r: () => number): Question {
  const a = int(r, 3, 15);
  const fromSide = r() < 0.5;
  return {
    id: `g-rper-${a}-${fromSide ? "p" : "a"}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: " cm",
    answer: fromSide ? 4 * a : a,
    prompt: fromSide
      ? bi(`Rhombus ABCD has AB = ${a} cm. Find its perimeter.`, `Hình thoi ABCD có AB = ${a} cm. Tính chu vi.`)
      : bi(`Rhombus ABCD has perimeter ${4 * a} cm. Find the length of side AB.`, `Hình thoi ABCD có chu vi ${4 * a} cm. Tính độ dài cạnh AB.`),
    figure: rhomb({ ticks: [["A", "B", 1], ["B", "C", 1], ["C", "D", 1], ["D", "A", 1]] }),
    hints: [
      bi("rhombus = hình thoi; perimeter = chu vi", "Hình thoi (rhombus) có bốn cạnh bằng nhau."),
      bi("Perimeter = 4 × side", "Chu vi = 4 × cạnh"),
      fromSide ? bi(`P = 4 × ${a} = ${4 * a} cm`, `P = 4 × ${a} = ${4 * a} cm`) : bi(`AB = ${4 * a} : 4 = ${a} cm`, `AB = ${4 * a} : 4 = ${a} cm`),
    ],
    explain: bi(`Four equal sides: P = 4 × AB, AB = ${a} cm, P = ${4 * a} cm.`, `Bốn cạnh bằng nhau: P = 4 × AB, AB = ${a} cm, P = ${4 * a} cm.`),
  };
}

/** Đường chéo là phân giác: biết ∠BAD → ∠BAC (hoặc ngược lại) */
function genBisect(r: () => number): Question {
  const half = int(r, 25, 65, 5);
  const ask = r() < 0.5 ? "half" : "full";
  return {
    id: `g-bis-${half}-${ask}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: "°",
    answer: ask === "half" ? half : 2 * half,
    prompt:
      ask === "half"
        ? bi(`Rhombus ABCD has ∠BAD = ${2 * half}°. Find ∠BAC.`, `Hình thoi ABCD có ∠BAD = ${2 * half}°. Tính ∠BAC.`)
        : bi(`Rhombus ABCD has ∠BAC = ${half}°. Find ∠BAD.`, `Hình thoi ABCD có ∠BAC = ${half}°. Tính ∠BAD.`),
    figure: rhombO(),
    hints: [
      bi("angle bisector = đường phân giác", "Đường phân giác chia một góc thành hai góc bằng nhau."),
      bi("In a rhombus, each diagonal bisects two angles: AC bisects ∠BAD.", "Trong hình thoi, mỗi đường chéo là phân giác của hai góc: AC là phân giác của ∠BAD."),
      ask === "half" ? bi(`∠BAC = ${2 * half}° : 2 = ${half}°`, `∠BAC = ${2 * half}° : 2 = ${half}°`) : bi(`∠BAD = 2 × ${half}° = ${2 * half}°`, `∠BAD = 2 × ${half}° = ${2 * half}°`),
    ],
    explain: bi(`AC bisects ∠BAD, so ∠BAD = 2 × ∠BAC.`, `AC là phân giác của ∠BAD nên ∠BAD = 2 × ∠BAC.`),
  };
}

/** Diện tích hình thoi từ hai đường chéo; hoặc nửa đường chéo */
function genRhombDiag(r: () => number): Question {
  const ac = int(r, 3, 12) * 2;
  const bd = int(r, 2, 10) * 2;
  const area = r() < 0.5;
  return {
    id: `g-rdiag-${ac}-${bd}-${area ? "s" : "o"}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: area ? " cm²" : " cm",
    answer: area ? (ac * bd) / 2 : bd / 2,
    prompt: area
      ? bi(`Rhombus ABCD has diagonals AC = ${ac} cm and BD = ${bd} cm. Find its area.`, `Hình thoi ABCD có hai đường chéo AC = ${ac} cm, BD = ${bd} cm. Tính diện tích.`)
      : bi(`Rhombus ABCD has diagonals meeting at O and BD = ${bd} cm. Find OB.`, `Hình thoi ABCD có hai đường chéo cắt nhau tại O và BD = ${bd} cm. Tính OB.`),
    figure: rhombO(area ? { sideLabels: [["A", "C", `${ac} cm`], ["B", "D", `${bd} cm`]] } : { sideLabels: [["B", "D", `${bd} cm`]] }),
    hints: area
      ? [bi("area = diện tích; product = tích", "Diện tích hình thoi bằng nửa tích hai đường chéo."), bi("S = AC × BD : 2", "S = AC × BD : 2"), bi(`S = ${ac} × ${bd} : 2 = ${(ac * bd) / 2} cm²`, `S = ${ac} × ${bd} : 2 = ${(ac * bd) / 2} cm²`)]
      : [bi("A rhombus is a parallelogram.", "Hình thoi cũng là hình bình hành."), bi("The diagonals bisect each other: O is the midpoint of BD.", "Hai đường chéo cắt nhau tại trung điểm mỗi đường: O là trung điểm BD."), bi(`OB = ${bd} : 2 = ${bd / 2} cm`, `OB = ${bd} : 2 = ${bd / 2} cm`)],
    explain: area ? bi(`S = ${ac} × ${bd} : 2 = ${(ac * bd) / 2} cm².`, `S = ${ac} × ${bd} : 2 = ${(ac * bd) / 2} cm².`) : bi(`OB = BD : 2 = ${bd / 2} cm.`, `OB = BD : 2 = ${bd / 2} cm.`),
  };
}

/** Tam giác ABD cân tại A (AB = AD) → ∠ABD */
function genRhombIsosceles(r: () => number): Question {
  const a = int(r, 4, 14) * 10;
  const ans = (180 - a) / 2;
  return {
    id: `g-rabd-${a}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: "°",
    answer: ans,
    prompt: bi(`Rhombus ABCD has ∠BAD = ${a}°. Find ∠ABD.`, `Hình thoi ABCD có ∠BAD = ${a}°. Tính ∠ABD.`),
    figure: rhomb({ segments: [["B", "D"]], angleLabels: [["A", `${a}°`]] }),
    hints: [
      bi("isosceles triangle = tam giác cân", "Xét tam giác ABD: AB = AD (cạnh hình thoi)."),
      bi("Triangle ABD is isosceles at A, so ∠ABD = ∠ADB.", "Tam giác ABD cân tại A nên ∠ABD = ∠ADB."),
      bi(`∠ABD = (180° − ${a}°) : 2 = ${ans}°`, `∠ABD = (180° − ${a}°) : 2 = ${ans}°`),
    ],
    explain: bi(`AB = AD, so ∠ABD = (180° − ${a}°) : 2 = ${ans}°.`, `AB = AD nên ∠ABD = (180° − ${a}°) : 2 = ${ans}°.`),
  };
}

/** Hình vuông: chu vi / diện tích */
function genSquare(r: () => number): Question {
  const a = int(r, 3, 12);
  const area = r() < 0.5;
  return {
    id: `g-sq-${a}-${area ? "s" : "p"}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: area ? " cm²" : " cm",
    answer: area ? a * a : 4 * a,
    prompt: bi(`Square ABCD has side ${a} cm. Find its ${area ? "area" : "perimeter"}.`, `Hình vuông ABCD có cạnh ${a} cm. Tính ${area ? "diện tích" : "chu vi"}.`),
    figure: square({ sideLabels: [["A", "B", `${a} cm`]] }),
    hints: [
      bi("square = hình vuông: four equal sides, four right angles", "Hình vuông có bốn cạnh bằng nhau, bốn góc vuông."),
      area ? bi("S = side × side", "S = cạnh × cạnh") : bi("P = 4 × side", "P = 4 × cạnh"),
      area ? bi(`S = ${a} × ${a} = ${a * a} cm²`, `S = ${a} × ${a} = ${a * a} cm²`) : bi(`P = 4 × ${a} = ${4 * a} cm`, `P = 4 × ${a} = ${4 * a} cm`),
    ],
    explain: area ? bi(`S = ${a}² = ${a * a} cm².`, `S = ${a}² = ${a * a} cm².`) : bi(`P = 4 × ${a} = ${4 * a} cm.`, `P = 4 × ${a} = ${4 * a} cm.`),
  };
}

/** Hình vuông: diện tích từ đường chéo (hình vuông cũng là hình thoi) */
function genSquareDiag(r: () => number): Question {
  const d = int(r, 2, 10) * 2;
  return {
    id: `g-sqd-${d}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: " cm²",
    answer: (d * d) / 2,
    prompt: bi(`Square ABCD has diagonal AC = ${d} cm. Find its area.`, `Hình vuông ABCD có đường chéo AC = ${d} cm. Tính diện tích.`),
    figure: squareO({ sideLabels: [["A", "C", `${d} cm`]] }),
    hints: [
      bi("A square is also a rhombus.", "Hình vuông cũng là một hình thoi."),
      bi("So S = AC × BD : 2, and BD = AC (a square is a rectangle too).", "Nên S = AC × BD : 2, mà BD = AC (hình vuông cũng là hình chữ nhật)."),
      bi(`S = ${d} × ${d} : 2 = ${(d * d) / 2} cm²`, `S = ${d} × ${d} : 2 = ${(d * d) / 2} cm²`),
    ],
    explain: bi(`BD = AC = ${d} cm, S = ${d} × ${d} : 2 = ${(d * d) / 2} cm².`, `BD = AC = ${d} cm, S = ${d} × ${d} : 2 = ${(d * d) / 2} cm².`),
  };
}

/** Góc đặc biệt của hình vuông */
const SQ_ANGLES: { ask: [string, string]; ans: number; why: [string, string] }[] = [
  { ask: ["∠BAC", "∠BAC"], ans: 45, why: ["AC bisects the right angle ∠BAD: 90° : 2 = 45°.", "AC là phân giác của góc vuông ∠BAD: 90° : 2 = 45°."] },
  { ask: ["∠AOB", "∠AOB"], ans: 90, why: ["The diagonals of a square are perpendicular.", "Hai đường chéo của hình vuông vuông góc với nhau."] },
  { ask: ["∠OBC", "∠OBC"], ans: 45, why: ["BD bisects the right angle ∠ABC: 90° : 2 = 45°.", "BD là phân giác của góc vuông ∠ABC: 90° : 2 = 45°."] },
];
function genSquareAngle(r: () => number): Question {
  const i = int(r, 0, SQ_ANGLES.length - 1);
  const x = SQ_ANGLES[i];
  return {
    id: `g-sqa-${i}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: "°",
    answer: x.ans,
    prompt: bi(`Square ABCD has diagonals meeting at O. Find ${x.ask[0]}.`, `Hình vuông ABCD có hai đường chéo cắt nhau tại O. Tính ${x.ask[1]}.`),
    figure: squareO(),
    hints: [
      bi("A square is both a rectangle and a rhombus.", "Hình vuông vừa là hình chữ nhật vừa là hình thoi."),
      bi("Its diagonals are perpendicular and bisect the right angles.", "Hai đường chéo vuông góc và là phân giác của các góc vuông."),
      bi(x.why[0], x.why[1]),
    ],
    explain: bi(`${x.ask[0]} = ${x.ans}°. ${x.why[0]}`, `${x.ask[1]} = ${x.ans}°. ${x.why[1]}`),
  };
}

const SIGNS: { s: [string, string]; ok: boolean; why: [string, string] }[] = [
  { s: ["A parallelogram with two equal adjacent sides is a rhombus.", "Hình bình hành có hai cạnh kề bằng nhau là hình thoi."], ok: true, why: ["This is a sign of a rhombus.", "Đây là dấu hiệu nhận biết hình thoi."] },
  { s: ["A parallelogram with perpendicular diagonals is a rhombus.", "Hình bình hành có hai đường chéo vuông góc là hình thoi."], ok: true, why: ["This is a sign of a rhombus.", "Đây là dấu hiệu nhận biết hình thoi."] },
  { s: ["A parallelogram whose diagonal bisects an angle is a rhombus.", "Hình bình hành có một đường chéo là phân giác của một góc là hình thoi."], ok: true, why: ["This is a sign of a rhombus.", "Đây là dấu hiệu nhận biết hình thoi."] },
  { s: ["A quadrilateral with perpendicular diagonals is a rhombus.", "Tứ giác có hai đường chéo vuông góc là hình thoi."], ok: false, why: ["It must be a parallelogram first (e.g. a kite has perpendicular diagonals).", "Phải là hình bình hành trước đã (ví dụ hình cánh diều cũng có hai đường chéo vuông góc)."] },
  { s: ["A rectangle with two equal adjacent sides is a square.", "Hình chữ nhật có hai cạnh kề bằng nhau là hình vuông."], ok: true, why: ["This is a sign of a square.", "Đây là dấu hiệu nhận biết hình vuông."] },
  { s: ["A rhombus with one right angle is a square.", "Hình thoi có một góc vuông là hình vuông."], ok: true, why: ["This is a sign of a square.", "Đây là dấu hiệu nhận biết hình vuông."] },
  { s: ["A rhombus with equal diagonals is a square.", "Hình thoi có hai đường chéo bằng nhau là hình vuông."], ok: true, why: ["This is a sign of a square.", "Đây là dấu hiệu nhận biết hình vuông."] },
  { s: ["Every rhombus is a square.", "Mọi hình thoi đều là hình vuông."], ok: false, why: ["A rhombus needs a right angle to be a square. (But every square is a rhombus!)", "Hình thoi cần có một góc vuông mới là hình vuông. (Nhưng mọi hình vuông đều là hình thoi!)"] },
];
function genSign(r: () => number): Question {
  const i = int(r, 0, SIGNS.length - 1);
  const x = SIGNS[i];
  return {
    id: `g-rsq-sign-${i}`,
    type: "tf",
    level: 2,
    skill: "lang",
    answer: x.ok,
    prompt: bi(`True or false: ${x.s[0]}`, `Đúng hay sai: ${x.s[1]}`),
    hints: [
      bi("Read carefully: quadrilateral, parallelogram, rectangle or rhombus?", "Đọc kĩ: tứ giác, hình bình hành, hình chữ nhật hay hình thoi?"),
      bi("Compare with the signs of a rhombus and of a square.", "So sánh với dấu hiệu nhận biết hình thoi và hình vuông."),
      bi(x.why[0], x.why[1]),
    ],
    explain: bi(`${x.ok ? "True" : "False"}. ${x.why[0]}`, `${x.ok ? "Đúng" : "Sai"}. ${x.why[1]}`),
  };
}

export const HINH_THOI_HINH_VUONG: LessonContent = {
  id: "k8-14",
  slug: "hinh-thoi-hinh-vuong",
  title: bi("Rhombuses and squares", "Hình thoi và hình vuông"),
  intro: bi(
    "A rhombus is a “pushed” square: four equal sides, but the angles can change. A square is the most special quadrilateral of all — it is a rectangle AND a rhombus!",
    "Hình thoi giống một hình vuông bị “đẩy nghiêng”: bốn cạnh vẫn bằng nhau nhưng góc thay đổi. Hình vuông là tứ giác đặc biệt nhất — vừa là hình chữ nhật VỪA là hình thoi!",
  ),
  goals: [
    bi("Know the definitions of a rhombus and a square.", "Hiểu định nghĩa hình thoi, hình vuông."),
    bi("Explain the properties of their diagonals.", "Giải thích tính chất về đường chéo của hình thoi, hình vuông."),
    bi("Recognise when a parallelogram is a rhombus and when a rectangle is a square.", "Nhận biết khi nào hình bình hành là hình thoi, hình chữ nhật là hình vuông."),
  ],
  terms: [
    { id: "rhombus", en: "rhombus", ipa: "/ˈrɒmbəs/", vi: "hình thoi", example: bi("A rhombus has four equal sides.", "Hình thoi có bốn cạnh bằng nhau.") },
    { id: "square", en: "square", ipa: "/skweə(r)/", vi: "hình vuông", example: bi("A square has four right angles.", "Hình vuông có bốn góc vuông.") },
    { id: "angle-bisector", en: "angle bisector", ipa: "/ˈæŋɡl baɪˈsektə(r)/", vi: "đường phân giác của góc", example: bi("AC is the angle bisector of ∠BAD.", "AC là đường phân giác của ∠BAD.") },
    { id: "perp-diagonals", en: "perpendicular diagonals", ipa: "/ˌpɜːpənˈdɪkjələ daɪˈæɡənlz/", vi: "hai đường chéo vuông góc", example: bi("A rhombus has perpendicular diagonals.", "Hình thoi có hai đường chéo vuông góc.") },
    { id: "equal-sides", en: "four equal sides", ipa: "/fɔː ˈiːkwəl saɪdz/", vi: "bốn cạnh bằng nhau", example: bi("A square has four equal sides.", "Hình vuông có bốn cạnh bằng nhau.") },
    { id: "side-length", en: "side length", ipa: "/saɪd leŋθ/", vi: "độ dài cạnh", example: bi("The side length is 5 cm.", "Độ dài cạnh là 5 cm.") },
    { id: "product", en: "product", ipa: "/ˈprɒdʌkt/", vi: "tích (kết quả phép nhân)", example: bi("Area = half the product of the diagonals.", "Diện tích = nửa tích hai đường chéo.") },
    { id: "half", en: "half", ipa: "/hɑːf/", vi: "một nửa", example: bi("OA is half of AC.", "OA bằng một nửa AC.") },
    { id: "kite", en: "kite", ipa: "/kaɪt/", vi: "cánh diều (hình có hai cặp cạnh kề bằng nhau)", example: bi("A kite is not always a rhombus.", "Hình cánh diều không phải lúc nào cũng là hình thoi.") },
    { id: "special-case", en: "special case", ipa: "/ˈspeʃl keɪs/", vi: "trường hợp đặc biệt", example: bi("A square is a special case of a rhombus.", "Hình vuông là trường hợp đặc biệt của hình thoi.") },
  ],
  sections: [
    {
      id: "hinh-thoi",
      title: bi("Rhombuses", "Hình thoi"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("A rhombus is a quadrilateral with four equal sides.", "Hình thoi là tứ giác có bốn cạnh bằng nhau.") },
        { kind: "figure", figure: rhomb({ ticks: [["A", "B", 1], ["B", "C", 1], ["C", "D", 1], ["D", "A", 1]] }), caption: bi("Rhombus ABCD: AB = BC = CD = DA", "Hình thoi ABCD: AB = BC = CD = DA") },
        { kind: "text", text: bi("Its opposite sides are equal, so a rhombus is also a parallelogram — it has all the properties of a parallelogram.", "Các cạnh đối bằng nhau nên hình thoi cũng là hình bình hành — nó có mọi tính chất của hình bình hành.") },
        {
          kind: "key",
          tag: bi("Theorem", "Định lí"),
          tone: "sun",
          text: bi("In a rhombus: the two diagonals are perpendicular; each diagonal is the angle bisector of two angles.", "Trong hình thoi: hai đường chéo vuông góc với nhau; hai đường chéo là các đường phân giác của các góc của hình thoi."),
        },
        { kind: "figure", figure: rhombO(), caption: bi("AC ⊥ BD at O; AC bisects ∠A and ∠C; BD bisects ∠B and ∠D", "AC ⊥ BD tại O; AC là phân giác ∠A, ∠C; BD là phân giác ∠B, ∠D") },
        { kind: "play", mode: "rhomb" },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "number",
            level: 1,
            skill: "math",
            unit: "°",
            answer: 90,
            prompt: bi("Rhombus ABCD has diagonals meeting at O. Find ∠AOB.", "Hình thoi ABCD có hai đường chéo cắt nhau tại O. Tính ∠AOB."),
            figure: rhombO(),
            hints: [bi("perpendicular = vuông góc", "Vuông góc = tạo góc 90°."), bi("The diagonals of a rhombus are perpendicular.", "Hai đường chéo của hình thoi vuông góc với nhau."), bi("∠AOB = 90°", "∠AOB = 90°")],
            explain: bi("AC ⊥ BD, so ∠AOB = 90°.", "AC ⊥ BD nên ∠AOB = 90°."),
          },
        },
      ],
    },
    {
      id: "dau-hieu-thoi",
      title: bi("How to recognise a rhombus", "Dấu hiệu nhận biết hình thoi"),
      blocks: [
        {
          kind: "list",
          tag: bi("Signs of a rhombus", "Dấu hiệu nhận biết hình thoi"),
          items: [
            bi("1. A quadrilateral with four equal sides.", "1. Tứ giác có bốn cạnh bằng nhau."),
            bi("2. A parallelogram with two equal adjacent sides.", "2. Hình bình hành có hai cạnh kề bằng nhau."),
            bi("3. A parallelogram with perpendicular diagonals.", "3. Hình bình hành có hai đường chéo vuông góc."),
            bi("4. A parallelogram with a diagonal that bisects an angle.", "4. Hình bình hành có một đường chéo là đường phân giác của một góc."),
          ],
        },
        { kind: "key", tag: bi("Area", "Diện tích"), tone: "teal", text: bi("Area of a rhombus = half the product of its diagonals: S = AC × BD : 2.", "Diện tích hình thoi bằng nửa tích hai đường chéo: S = AC × BD : 2.") },
        {
          kind: "example",
          problem: bi("Rhombus ABCD has ∠BAD = 60° and AB = 5 cm. Find BD.", "Hình thoi ABCD có ∠BAD = 60° và AB = 5 cm. Tính BD."),
          figure: rhomb({ segments: [["B", "D"]], sideLabels: [["A", "B", "5 cm"]] }),
          steps: [
            bi("AB = AD (sides of the rhombus), so triangle ABD is isosceles at A.", "AB = AD (cạnh hình thoi) nên tam giác ABD cân tại A."),
            bi("An isosceles triangle with a 60° angle is equilateral.", "Tam giác cân có một góc 60° là tam giác đều."),
            bi("So BD = AB = 5 cm.", "Vậy BD = AB = 5 cm."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "tf",
            level: 2,
            skill: "math",
            answer: false,
            prompt: bi("True or false: A quadrilateral with perpendicular diagonals is always a rhombus.", "Đúng hay sai: Tứ giác có hai đường chéo vuông góc luôn là hình thoi."),
            hints: [bi("kite = cánh diều", "Nghĩ tới hình cánh diều."), bi("Sign 3 needs a PARALLELOGRAM with perpendicular diagonals.", "Dấu hiệu 3 cần một HÌNH BÌNH HÀNH có hai đường chéo vuông góc."), bi("A kite has perpendicular diagonals but is usually not a rhombus.", "Cánh diều có hai đường chéo vuông góc nhưng thường không phải hình thoi.")],
            explain: bi("False. It must be a parallelogram first.", "Sai. Phải là hình bình hành trước đã."),
          },
        },
      ],
    },
    {
      id: "hinh-vuong",
      title: bi("Squares", "Hình vuông"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("A square is a quadrilateral with four right angles and four equal sides.", "Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau.") },
        { kind: "text", text: bi("So a square is a rectangle and also a rhombus. It has all their properties.", "Vậy hình vuông vừa là hình chữ nhật, vừa là hình thoi. Nó có mọi tính chất của hai hình đó.") },
        {
          kind: "list",
          tag: bi("The diagonals of a square:", "Hai đường chéo của hình vuông:"),
          items: [
            bi("are equal (rectangle);", "bằng nhau (như hình chữ nhật);"),
            bi("are perpendicular and bisect the angles (rhombus);", "vuông góc với nhau và là phân giác các góc (như hình thoi);"),
            bi("bisect each other (parallelogram).", "cắt nhau tại trung điểm mỗi đường (như hình bình hành)."),
          ],
        },
        { kind: "figure", figure: squareO({ ticks: [["A", "B", 1], ["B", "C", 1], ["C", "D", 1], ["D", "A", 1]] }), caption: bi("Square ABCD: ∠BAC = 45°", "Hình vuông ABCD: ∠BAC = 45°") },
        {
          kind: "list",
          tag: bi("Signs of a square", "Dấu hiệu nhận biết hình vuông"),
          items: [
            bi("A rectangle with two equal adjacent sides.", "Hình chữ nhật có hai cạnh kề bằng nhau."),
            bi("A rectangle with perpendicular diagonals.", "Hình chữ nhật có hai đường chéo vuông góc."),
            bi("A rectangle with a diagonal that bisects an angle.", "Hình chữ nhật có một đường chéo là đường phân giác của một góc."),
            bi("A rhombus with one right angle.", "Hình thoi có một góc vuông."),
            bi("A rhombus with equal diagonals.", "Hình thoi có hai đường chéo bằng nhau."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c3",
            type: "number",
            level: 2,
            skill: "math",
            unit: "°",
            answer: 45,
            prompt: bi("Square ABCD. Find ∠BAC.", "Hình vuông ABCD. Tính ∠BAC."),
            figure: square({ segments: [["A", "C"]] }),
            hints: [bi("AC bisects ∠BAD.", "AC là phân giác của ∠BAD."), bi("∠BAD = 90°", "∠BAD = 90°"), bi("∠BAC = 90° : 2 = 45°", "∠BAC = 90° : 2 = 45°")],
            explain: bi("The diagonal bisects the right angle: ∠BAC = 45°.", "Đường chéo là phân giác của góc vuông: ∠BAC = 45°."),
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
      accept: ["rhombus", "a rhombus"],
      prompt: bi("Type the English word for “hình thoi”.", "Gõ từ tiếng Anh của “hình thoi”."),
      hints: [bi("It starts with “rh-” (the h is silent).", "Bắt đầu bằng “rh-” (chữ h câm)."), bi("rhom-bus", "rhom-bus"), bi("rhombus", "rhombus")],
      explain: bi("rhombus /ˈrɒmbəs/ = hình thoi", "rhombus /ˈrɒmbəs/ = hình thoi"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 2,
      skill: "math",
      answer: 3,
      prompt: bi("Which shape is a rectangle AND a rhombus?", "Hình nào vừa là hình chữ nhật VỪA là hình thoi?"),
      options: [bi("Parallelogram", "Hình bình hành"), bi("Isosceles trapezoid", "Hình thang cân"), bi("Kite", "Cánh diều"), bi("Square", "Hình vuông")],
      hints: [bi("Four right angles + four equal sides", "Bốn góc vuông + bốn cạnh bằng nhau"), bi("It is the most special quadrilateral.", "Đó là tứ giác đặc biệt nhất."), bi("Square", "Hình vuông")],
      explain: bi("A square is both a rectangle and a rhombus.", "Hình vuông vừa là hình chữ nhật vừa là hình thoi."),
    },
    {
      id: "p3",
      type: "mcq",
      level: 2,
      skill: "lang",
      answer: 1,
      prompt: bi("Choose the correct English sentence for “Hai đường chéo của hình thoi vuông góc với nhau”.", "Chọn câu tiếng Anh đúng cho “Hai đường chéo của hình thoi vuông góc với nhau”."),
      options: ["The diagonals of a rhombus are parallel.", "The diagonals of a rhombus are perpendicular.", "The sides of a rhombus are perpendicular.", "The diagonals of a rhombus are equal."].map((t) => bi(t, t)),
      hints: [bi("vuông góc = perpendicular", "vuông góc = perpendicular"), bi("đường chéo = diagonal", "đường chéo = diagonal"), bi("The diagonals of a rhombus are perpendicular.", "The diagonals of a rhombus are perpendicular.")],
      explain: bi("perpendicular = vuông góc; parallel = song song.", "perpendicular = vuông góc; parallel = song song."),
    },
  ],
  generators: [
    { level: 1, make: genRhombPerimeter },
    { level: 1, make: genSquare },
    { level: 2, make: genBisect },
    { level: 2, make: genRhombDiag },
    { level: 2, make: genSquareAngle },
    { level: 2, make: genSign },
    { level: 3, make: genRhombIsosceles },
    { level: 3, make: genSquareDiag },
  ],
  speak: [
    { en: "A rhombus has four equal sides.", vi: "Hình thoi có bốn cạnh bằng nhau." },
    { en: "The diagonals of a rhombus are perpendicular.", vi: "Hai đường chéo của hình thoi vuông góc với nhau." },
    { en: "Each diagonal bisects two angles.", vi: "Mỗi đường chéo là phân giác của hai góc." },
    { en: "A square is a rectangle and a rhombus.", vi: "Hình vuông vừa là hình chữ nhật vừa là hình thoi." },
    { en: "The area of a rhombus is half the product of its diagonals.", vi: "Diện tích hình thoi bằng nửa tích hai đường chéo." },
  ],
  summary: [
    bi("Rhombus: four equal sides (also a parallelogram).", "Hình thoi: tứ giác có bốn cạnh bằng nhau (cũng là hình bình hành)."),
    bi("Rhombus diagonals: perpendicular, bisect each other, bisect the angles. S = AC × BD : 2.", "Đường chéo hình thoi: vuông góc, cắt nhau tại trung điểm, là phân giác các góc. S = AC × BD : 2."),
    bi("Signs of a rhombus: parallelogram + (2 equal adjacent sides / perpendicular diagonals / diagonal bisects an angle).", "Dấu hiệu hình thoi: HBH + (2 cạnh kề bằng nhau / 2 đường chéo vuông góc / 1 đường chéo là phân giác)."),
    bi("Square: four right angles + four equal sides = rectangle + rhombus.", "Hình vuông: bốn góc vuông + bốn cạnh bằng nhau = hình chữ nhật + hình thoi."),
    bi("Signs of a square: rectangle + (2 equal adjacent sides / perpendicular diagonals) or rhombus + (1 right angle / equal diagonals).", "Dấu hiệu hình vuông: HCN + (2 cạnh kề bằng nhau / 2 đường chéo vuông góc) hoặc hình thoi + (1 góc vuông / 2 đường chéo bằng nhau)."),
  ],
};
