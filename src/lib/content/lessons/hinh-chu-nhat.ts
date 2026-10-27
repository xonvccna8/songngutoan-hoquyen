// Bài 13. Hình chữ nhật — Rectangles (Toán 8 Kết nối tri thức, Chương III)
import { ABCD, bi, int, RECT, RIGHT_TRI, vn } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const rect = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: RECT, polygon: ABCD, rightAngles: ABCD, ...extra });
const rectO = (extra: Partial<FigureSpec> = {}) => rect({ segments: [["A", "C"], ["B", "D"]], dots: ["O"], ...extra });
const tri = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: RIGHT_TRI, polygon: ["A", "B", "C"], rightAngles: ["A"], segments: [["A", "M"]], dots: ["M"], ...extra });

/** Đường chéo bằng nhau, cắt nhau tại trung điểm */
function genDiag(r: () => number): Question {
  const ac = int(r, 6, 20);
  const kind = int(r, 0, 2); // 0: BD · 1: OB · 2: OD
  const ask = ["BD", "OB", "OD"][kind];
  const ans = kind === 0 ? ac : ac / 2;
  return {
    id: `g-rdiag-${ac}-${kind}`,
    type: "number",
    level: kind === 0 ? 1 : 2,
    skill: "math",
    unit: " cm",
    answer: ans,
    prompt: bi(`Rectangle ABCD has diagonals meeting at O and AC = ${ac} cm. Find ${ask}.`, `Hình chữ nhật ABCD có hai đường chéo cắt nhau tại O và AC = ${ac} cm. Tính ${ask}.`),
    figure: rectO({ sideLabels: [["A", "C", `${ac} cm`]] }),
    hints: [
      bi("In a rectangle the diagonals are equal.", "Trong hình chữ nhật, hai đường chéo bằng nhau."),
      bi("They also bisect each other: O is the midpoint of both.", "Chúng còn cắt nhau tại trung điểm mỗi đường: O là trung điểm của cả hai."),
      kind === 0 ? bi(`BD = AC = ${ac} cm`, `BD = AC = ${ac} cm`) : bi(`${ask} = BD : 2 = AC : 2 = ${vn(ans)} cm`, `${ask} = BD : 2 = AC : 2 = ${vn(ans)} cm`),
    ],
    explain: kind === 0 ? bi(`Equal diagonals: BD = ${ac} cm.`, `Hai đường chéo bằng nhau: BD = ${ac} cm.`) : bi(`OA = OB = OC = OD = ${vn(ans)} cm.`, `OA = OB = OC = OD = ${vn(ans)} cm.`),
  };
}

/** Chu vi hoặc diện tích */
function genArea(r: () => number): Question {
  const l = int(r, 5, 15);
  const w = int(r, 2, l - 1);
  const area = r() < 0.5;
  return {
    id: `g-${area ? "area" : "rper"}-${l}-${w}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: area ? " cm²" : " cm",
    answer: area ? l * w : 2 * (l + w),
    prompt: bi(`Rectangle ABCD has AB = ${l} cm and BC = ${w} cm. Find its ${area ? "area" : "perimeter"}.`, `Hình chữ nhật ABCD có AB = ${l} cm, BC = ${w} cm. Tính ${area ? "diện tích" : "chu vi"}.`),
    figure: rect({ sideLabels: [["A", "B", `${l} cm`], ["B", "C", `${w} cm`]] }),
    hints: [
      area ? bi("area = diện tích; length × width", "Diện tích (area) = chiều dài × chiều rộng.") : bi("perimeter = chu vi", "Chu vi (perimeter) = 2 × (dài + rộng)."),
      area ? bi(`S = AB × BC`, `S = AB × BC`) : bi(`P = 2 × (AB + BC)`, `P = 2 × (AB + BC)`),
      area ? bi(`S = ${l} × ${w} = ${l * w} cm²`, `S = ${l} × ${w} = ${l * w} cm²`) : bi(`P = 2 × (${l} + ${w}) = ${2 * (l + w)} cm`, `P = 2 × (${l} + ${w}) = ${2 * (l + w)} cm`),
    ],
    explain: area ? bi(`Area = ${l} × ${w} = ${l * w} cm².`, `Diện tích = ${l} × ${w} = ${l * w} cm².`) : bi(`Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} cm.`, `Chu vi = 2 × (${l} + ${w}) = ${2 * (l + w)} cm.`),
  };
}

/** Trung tuyến ứng với cạnh huyền */
function genMedian(r: () => number): Question {
  const bc = int(r, 4, 13) * 2;
  const reverse = r() < 0.4;
  return {
    id: `g-median-${bc}-${reverse ? "r" : "f"}`,
    type: "number",
    level: reverse ? 3 : 2,
    skill: "math",
    unit: " cm",
    answer: reverse ? bc : bc / 2,
    prompt: reverse
      ? bi(`Triangle ABC is right-angled at A. M is the midpoint of BC and AM = ${bc / 2} cm. Find BC.`, `Tam giác ABC vuông tại A, M là trung điểm BC và AM = ${bc / 2} cm. Tính BC.`)
      : bi(`Triangle ABC is right-angled at A with hypotenuse BC = ${bc} cm. M is the midpoint of BC. Find AM.`, `Tam giác ABC vuông tại A có cạnh huyền BC = ${bc} cm. M là trung điểm BC. Tính AM.`),
    figure: tri(),
    hints: [
      bi("hypotenuse = cạnh huyền; median = đường trung tuyến", "Cạnh huyền (hypotenuse) là cạnh đối diện góc vuông; AM là đường trung tuyến (median)."),
      bi("The median to the hypotenuse is half the hypotenuse.", "Đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền."),
      reverse ? bi(`BC = 2 × AM = ${bc} cm`, `BC = 2 × AM = ${bc} cm`) : bi(`AM = BC : 2 = ${bc / 2} cm`, `AM = BC : 2 = ${bc / 2} cm`),
    ],
    explain: reverse ? bi(`AM = BC : 2, so BC = 2 × ${bc / 2} = ${bc} cm.`, `AM = BC : 2 nên BC = 2 × ${bc / 2} = ${bc} cm.`) : bi(`AM = BC : 2 = ${bc / 2} cm.`, `AM = BC : 2 = ${bc / 2} cm.`),
  };
}

/** Góc tạo bởi hai đường chéo → tam giác OAB cân */
function genIsosceles(r: () => number): Question {
  const aob = int(r, 6, 14) * 10;
  const ans = (180 - aob) / 2;
  return {
    id: `g-aob-${aob}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: "°",
    answer: ans,
    prompt: bi(`Rectangle ABCD has diagonals meeting at O and ∠AOB = ${aob}°. Find ∠OAB.`, `Hình chữ nhật ABCD có hai đường chéo cắt nhau tại O và ∠AOB = ${aob}°. Tính ∠OAB.`),
    figure: rectO(),
    hints: [
      bi("isosceles triangle = tam giác cân", "OA = OB (nửa hai đường chéo bằng nhau) → tam giác OAB cân tại O."),
      bi("Base angles of an isosceles triangle are equal: ∠OAB = ∠OBA.", "Hai góc ở đáy bằng nhau: ∠OAB = ∠OBA."),
      bi(`∠OAB = (180° − ${aob}°) : 2 = ${ans}°`, `∠OAB = (180° − ${aob}°) : 2 = ${ans}°`),
    ],
    explain: bi(`OA = OB, so triangle OAB is isosceles: ∠OAB = (180° − ${aob}°) : 2 = ${ans}°.`, `OA = OB nên tam giác OAB cân tại O: ∠OAB = (180° − ${aob}°) : 2 = ${ans}°.`),
  };
}

/** Biết chu vi và hiệu dài – rộng → diện tích */
function genSumDiffArea(r: () => number): Question {
  const w = int(r, 3, 9);
  const d = int(r, 1, 5);
  const l = w + d;
  const p = 2 * (l + w);
  return {
    id: `g-pda-${l}-${w}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: " cm²",
    answer: l * w,
    prompt: bi(`A rectangle has perimeter ${p} cm. Its length is ${d} cm more than its width. Find its area.`, `Một hình chữ nhật có chu vi ${p} cm, chiều dài hơn chiều rộng ${d} cm. Tính diện tích.`),
    hints: [
      bi("length = chiều dài; width = chiều rộng", "Nửa chu vi = dài + rộng."),
      bi(`length + width = ${p / 2}, length − width = ${d}`, `dài + rộng = ${p / 2}, dài − rộng = ${d}`),
      bi(`length = ${l} cm, width = ${w} cm, area = ${l * w} cm²`, `dài = ${l} cm, rộng = ${w} cm, diện tích = ${l * w} cm²`),
    ],
    explain: bi(`Length = (${p / 2} + ${d}) : 2 = ${l} cm, width = ${w} cm, area = ${l} × ${w} = ${l * w} cm².`, `Dài = (${p / 2} + ${d}) : 2 = ${l} cm, rộng = ${w} cm, diện tích = ${l} × ${w} = ${l * w} cm².`),
  };
}

/** Dấu hiệu nhận biết (đúng/sai) */
const SIGNS: { s: [string, string]; ok: boolean; why: [string, string] }[] = [
  { s: ["A quadrilateral with three right angles is a rectangle.", "Tứ giác có ba góc vuông là hình chữ nhật."], ok: true, why: ["The fourth angle is 360° − 270° = 90°.", "Góc thứ tư bằng 360° − 270° = 90°."] },
  { s: ["A parallelogram with one right angle is a rectangle.", "Hình bình hành có một góc vuông là hình chữ nhật."], ok: true, why: ["Opposite angles are equal and adjacent angles are supplementary, so all angles are 90°.", "Góc đối bằng nhau, góc kề bù nhau nên cả bốn góc đều vuông."] },
  { s: ["A parallelogram with equal diagonals is a rectangle.", "Hình bình hành có hai đường chéo bằng nhau là hình chữ nhật."], ok: true, why: ["This is a sign of a rectangle.", "Đây là một dấu hiệu nhận biết hình chữ nhật."] },
  { s: ["An isosceles trapezoid with one right angle is a rectangle.", "Hình thang cân có một góc vuông là hình chữ nhật."], ok: true, why: ["This is a sign of a rectangle.", "Đây là một dấu hiệu nhận biết hình chữ nhật."] },
  { s: ["A quadrilateral with equal diagonals is a rectangle.", "Tứ giác có hai đường chéo bằng nhau là hình chữ nhật."], ok: false, why: ["Not enough: an isosceles trapezoid also has equal diagonals. It must be a parallelogram first.", "Chưa đủ: hình thang cân cũng có hai đường chéo bằng nhau. Phải là hình bình hành trước đã."] },
  { s: ["A quadrilateral with two right angles is a rectangle.", "Tứ giác có hai góc vuông là hình chữ nhật."], ok: false, why: ["The other two angles only add up to 180°; they need not be 90° each.", "Hai góc còn lại chỉ có tổng 180°, chưa chắc mỗi góc bằng 90°."] },
];
function genSign(r: () => number): Question {
  const i = int(r, 0, SIGNS.length - 1);
  const x = SIGNS[i];
  return {
    id: `g-rsign-${i}`,
    type: "tf",
    level: 2,
    skill: "lang",
    answer: x.ok,
    prompt: bi(`True or false: ${x.s[0]}`, `Đúng hay sai: ${x.s[1]}`),
    hints: [
      bi("right angle = góc vuông; diagonal = đường chéo", "Đọc kĩ: “tứ giác” hay “hình bình hành”? mấy góc vuông?"),
      bi("Compare with the signs of a rectangle.", "So sánh với các dấu hiệu nhận biết hình chữ nhật."),
      bi(x.why[0], x.why[1]),
    ],
    explain: bi(`${x.ok ? "True" : "False"}. ${x.why[0]}`, `${x.ok ? "Đúng" : "Sai"}. ${x.why[1]}`),
  };
}

export const HINH_CHU_NHAT: LessonContent = {
  id: "k8-13",
  slug: "hinh-chu-nhat",
  title: bi("Rectangles", "Hình chữ nhật"),
  intro: bi(
    "Doors, books, football pitches… Rectangles are everywhere. A rectangle is a very special parallelogram — and builders use its diagonals to check their work!",
    "Cửa ra vào, quyển sách, sân bóng… Hình chữ nhật ở khắp nơi. Đó là một hình bình hành rất đặc biệt — và thợ xây dùng đường chéo của nó để kiểm tra công trình!",
  ),
  goals: [
    bi("Know the definition and properties of a rectangle.", "Hiểu định nghĩa và tính chất của hình chữ nhật."),
    bi("Recognise a rectangle with its signs.", "Nhận biết hình chữ nhật bằng các dấu hiệu."),
    bi("Use: the median to the hypotenuse is half the hypotenuse.", "Vận dụng: trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền."),
  ],
  terms: [
    { id: "rectangle", en: "rectangle", ipa: "/ˈrektæŋɡl/", vi: "hình chữ nhật", example: bi("ABCD is a rectangle.", "ABCD là hình chữ nhật.") },
    { id: "right-angle", en: "right angle", ipa: "/raɪt ˈæŋɡl/", vi: "góc vuông", example: bi("A rectangle has four right angles.", "Hình chữ nhật có bốn góc vuông.") },
    { id: "length", en: "length", ipa: "/leŋθ/", vi: "chiều dài; độ dài", example: bi("The length is 8 cm.", "Chiều dài là 8 cm.") },
    { id: "width", en: "width", ipa: "/wɪdθ/", vi: "chiều rộng", example: bi("The width is 5 cm.", "Chiều rộng là 5 cm.") },
    { id: "area", en: "area", ipa: "/ˈeəriə/", vi: "diện tích", example: bi("Area = length × width", "Diện tích = dài × rộng") },
    { id: "perpendicular", en: "perpendicular", ipa: "/ˌpɜːpənˈdɪkjələ(r)/", vi: "vuông góc", example: bi("AB is perpendicular to AD (AB ⊥ AD).", "AB vuông góc với AD (AB ⊥ AD).") },
    { id: "right-triangle", en: "right triangle", ipa: "/raɪt ˈtraɪæŋɡl/", vi: "tam giác vuông", example: bi("Triangle ABC is a right triangle.", "ABC là tam giác vuông.") },
    { id: "hypotenuse", en: "hypotenuse", ipa: "/haɪˈpɒtənjuːz/", vi: "cạnh huyền", example: bi("BC is the hypotenuse.", "BC là cạnh huyền.") },
    { id: "median", en: "median", ipa: "/ˈmiːdiən/", vi: "đường trung tuyến", example: bi("AM is a median of triangle ABC.", "AM là đường trung tuyến của tam giác ABC.") },
    { id: "isosceles-trapezoid", en: "isosceles trapezoid", ipa: "/aɪˈsɒsəliːz ˈtræpəzɔɪd/", vi: "hình thang cân", example: bi("A rectangle is also an isosceles trapezoid.", "Hình chữ nhật cũng là hình thang cân.") },
  ],
  sections: [
    {
      id: "dinh-nghia",
      title: bi("What is a rectangle?", "Hình chữ nhật là gì?"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("A rectangle is a quadrilateral with four right angles.", "Hình chữ nhật là tứ giác có bốn góc vuông.") },
        { kind: "text", text: bi("ABCD is a rectangle ⇔ ∠A = ∠B = ∠C = ∠D = 90°.", "ABCD là hình chữ nhật ⇔ ∠A = ∠B = ∠C = ∠D = 90°.") },
        { kind: "figure", figure: rect(), caption: bi("Rectangle ABCD", "Hình chữ nhật ABCD") },
        { kind: "key", tag: bi("Note", "Nhận xét"), tone: "teal", text: bi("A rectangle is a special parallelogram, and also a special isosceles trapezoid.", "Hình chữ nhật là một hình bình hành đặc biệt, cũng là một hình thang cân đặc biệt.") },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "tf",
            level: 1,
            skill: "math",
            answer: true,
            prompt: bi("True or false: Every rectangle is a parallelogram.", "Đúng hay sai: Mọi hình chữ nhật đều là hình bình hành."),
            hints: [bi("every = mọi", "Mọi = every"), bi("Are the opposite sides of a rectangle parallel?", "Các cạnh đối của hình chữ nhật có song song không?"), bi("Yes: both are perpendicular to the same side.", "Có: chúng cùng vuông góc với một cạnh.")],
            explain: bi("True. Its opposite sides are parallel, so a rectangle is a parallelogram.", "Đúng. Các cạnh đối song song nên hình chữ nhật là hình bình hành."),
          },
        },
      ],
    },
    {
      id: "tinh-chat",
      title: bi("Properties", "Tính chất"),
      blocks: [
        { kind: "text", text: bi("A rectangle has all the properties of a parallelogram and of an isosceles trapezoid.", "Hình chữ nhật có tất cả các tính chất của hình bình hành và hình thang cân.") },
        { kind: "key", tag: bi("Theorem", "Định lí"), tone: "sun", text: bi("In a rectangle, the two diagonals are equal and bisect each other.", "Trong hình chữ nhật, hai đường chéo bằng nhau và cắt nhau tại trung điểm của mỗi đường.") },
        { kind: "figure", figure: rectO({ ticks: [["A", "O", 1], ["O", "C", 1], ["B", "O", 1], ["O", "D", 1]] }), caption: bi("OA = OB = OC = OD", "OA = OB = OC = OD") },
        { kind: "play", mode: "rect" },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "number",
            level: 1,
            skill: "math",
            unit: " cm",
            answer: 5,
            prompt: bi("Rectangle ABCD has BD = 10 cm and diagonals meeting at O. Find OA.", "Hình chữ nhật ABCD có BD = 10 cm, hai đường chéo cắt nhau tại O. Tính OA."),
            figure: rectO(),
            hints: [bi("AC = BD (equal diagonals)", "AC = BD (hai đường chéo bằng nhau)"), bi("O is the midpoint of AC.", "O là trung điểm AC."), bi("OA = AC : 2 = 10 : 2 = 5 cm", "OA = AC : 2 = 10 : 2 = 5 cm")],
            explain: bi("AC = BD = 10 cm and OA = AC : 2 = 5 cm.", "AC = BD = 10 cm và OA = AC : 2 = 5 cm."),
          },
        },
      ],
    },
    {
      id: "dau-hieu",
      title: bi("How to recognise a rectangle", "Dấu hiệu nhận biết"),
      blocks: [
        {
          kind: "list",
          tag: bi("Signs of a rectangle", "Dấu hiệu nhận biết hình chữ nhật"),
          items: [
            bi("1. A quadrilateral with three right angles.", "1. Tứ giác có ba góc vuông."),
            bi("2. An isosceles trapezoid with one right angle.", "2. Hình thang cân có một góc vuông."),
            bi("3. A parallelogram with one right angle.", "3. Hình bình hành có một góc vuông."),
            bi("4. A parallelogram with equal diagonals.", "4. Hình bình hành có hai đường chéo bằng nhau."),
          ],
        },
        {
          kind: "example",
          problem: bi("A carpenter makes a door frame. How can she check that it is a rectangle using only a tape measure?", "Một bác thợ mộc làm khung cửa. Làm sao kiểm tra khung là hình chữ nhật chỉ bằng thước dây?"),
          steps: [
            bi("Measure the opposite sides: if both pairs are equal, the frame is a parallelogram (sign 2 of parallelograms).", "Đo các cạnh đối: nếu từng cặp bằng nhau thì khung là hình bình hành."),
            bi("Measure the two diagonals: if they are equal, the parallelogram is a rectangle (sign 4).", "Đo hai đường chéo: nếu bằng nhau thì hình bình hành đó là hình chữ nhật (dấu hiệu 4)."),
          ],
        },
      ],
    },
    {
      id: "tam-giac-vuong",
      title: bi("Application to right triangles", "Áp dụng vào tam giác vuông"),
      blocks: [
        { kind: "key", tag: bi("Theorem", "Định lí"), tone: "coral", text: bi("In a right triangle, the median to the hypotenuse is half the hypotenuse.", "Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền.") },
        { kind: "figure", figure: tri({ ticks: [["B", "M", 1], ["M", "C", 1], ["A", "M", 1]] }), caption: bi("ABC right-angled at A, M is the midpoint of BC: AM = BC : 2", "ABC vuông tại A, M là trung điểm BC: AM = BC : 2") },
        {
          kind: "list",
          tag: bi("Why?", "Vì sao?"),
          items: [
            bi("Extend AM to D so that M is the midpoint of AD.", "Lấy D sao cho M là trung điểm của AD."),
            bi("ABDC has diagonals bisecting each other → parallelogram; it has a right angle at A → rectangle.", "ABDC có hai đường chéo cắt nhau tại trung điểm mỗi đường → hình bình hành; lại có góc A vuông → hình chữ nhật."),
            bi("So AD = BC, and AM = AD : 2 = BC : 2.", "Do đó AD = BC, nên AM = AD : 2 = BC : 2."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c3",
            type: "number",
            level: 2,
            skill: "math",
            unit: " cm",
            answer: 6.5,
            prompt: bi("Triangle ABC is right-angled at A with BC = 13 cm. M is the midpoint of BC. Find AM.", "Tam giác ABC vuông tại A có BC = 13 cm, M là trung điểm BC. Tính AM."),
            figure: tri(),
            hints: [bi("BC is the hypotenuse.", "BC là cạnh huyền."), bi("AM = BC : 2", "AM = BC : 2"), bi("13 : 2 = 6.5 cm", "13 : 2 = 6,5 cm")],
            explain: bi("AM = 13 : 2 = 6.5 cm.", "AM = 13 : 2 = 6,5 cm."),
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
      accept: ["rectangle", "a rectangle"],
      prompt: bi("Type the English word for “hình chữ nhật”.", "Gõ từ tiếng Anh của “hình chữ nhật”."),
      hints: [bi("rect- means “right” (straight).", "“rect-” nghĩa là “thẳng, vuông”."), bi("rect + angle", "rect + angle"), bi("rectangle", "rectangle")],
      explain: bi("rectangle /ˈrektæŋɡl/ = hình chữ nhật", "rectangle /ˈrektæŋɡl/ = hình chữ nhật"),
    },
    {
      id: "p2",
      type: "term",
      level: 2,
      skill: "lang",
      accept: ["hypotenuse", "the hypotenuse"],
      prompt: bi("Type the English word for “cạnh huyền”.", "Gõ từ tiếng Anh của “cạnh huyền”."),
      hints: [bi("It starts with “hypo-”.", "Bắt đầu bằng “hypo-”."), bi("hy-PO-te-nuse", "hy-PO-te-nuse"), bi("hypotenuse", "hypotenuse")],
      explain: bi("hypotenuse /haɪˈpɒtənjuːz/ = cạnh huyền", "hypotenuse /haɪˈpɒtənjuːz/ = cạnh huyền"),
    },
    {
      id: "p3",
      type: "mcq",
      level: 2,
      skill: "math",
      answer: 3,
      prompt: bi("Which property does a rectangle have that a general parallelogram does NOT?", "Hình chữ nhật có tính chất nào mà hình bình hành bất kì KHÔNG có?"),
      options: [bi("Opposite sides are equal", "Các cạnh đối bằng nhau"), bi("Opposite angles are equal", "Các góc đối bằng nhau"), bi("Diagonals bisect each other", "Hai đường chéo cắt nhau tại trung điểm mỗi đường"), bi("Diagonals are equal", "Hai đường chéo bằng nhau")],
      hints: [bi("general = bất kì", "Ba tính chất đầu là của mọi hình bình hành."), bi("Which one is special to rectangles?", "Tính chất nào chỉ riêng hình chữ nhật có?"), bi("Diagonals are equal.", "Hai đường chéo bằng nhau.")],
      explain: bi("Only rectangles (among parallelograms) have equal diagonals.", "Trong các hình bình hành, chỉ hình chữ nhật có hai đường chéo bằng nhau."),
    },
    {
      id: "p4",
      type: "number",
      level: 3,
      skill: "math",
      unit: " cm",
      answer: 5,
      prompt: bi(
        "Rectangle ABCD has AB = 8 cm and AC = 10 cm. Its diagonals meet at O. Find OD.",
        "Hình chữ nhật ABCD có AB = 8 cm, AC = 10 cm, hai đường chéo cắt nhau tại O. Tính OD.",
      ),
      figure: rectO({ sideLabels: [["A", "B", "8 cm"], ["A", "C", "10 cm"]] }),
      hints: [bi("AB = 8 cm is extra information — do you need it?", "AB = 8 cm là dữ kiện thừa — em có cần dùng không?"), bi("BD = AC, and O is the midpoint of BD.", "BD = AC và O là trung điểm BD."), bi("OD = BD : 2 = 10 : 2 = 5 cm", "OD = BD : 2 = 10 : 2 = 5 cm")],
      explain: bi("BD = AC = 10 cm, so OD = 5 cm. AB was not needed!", "BD = AC = 10 cm nên OD = 5 cm. Không cần dùng AB!"),
    },
  ],
  generators: [
    { level: 1, make: genDiag },
    { level: 2, make: genArea },
    { level: 2, make: genMedian },
    { level: 2, make: genSign },
    { level: 3, make: genIsosceles },
    { level: 3, make: genSumDiffArea },
  ],
  speak: [
    { en: "A rectangle has four right angles.", vi: "Hình chữ nhật có bốn góc vuông." },
    { en: "A rectangle is a special parallelogram.", vi: "Hình chữ nhật là một hình bình hành đặc biệt." },
    { en: "The diagonals of a rectangle are equal.", vi: "Hai đường chéo của hình chữ nhật bằng nhau." },
    { en: "The area of a rectangle is length times width.", vi: "Diện tích hình chữ nhật bằng chiều dài nhân chiều rộng." },
    { en: "The median to the hypotenuse is half the hypotenuse.", vi: "Đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền." },
  ],
  summary: [
    bi("Definition: four right angles.", "Định nghĩa: tứ giác có bốn góc vuông."),
    bi("Properties: all properties of a parallelogram; diagonals equal and bisect each other.", "Tính chất: mọi tính chất của hình bình hành; hai đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường."),
    bi("Signs: 3 right angles · parallelogram + 1 right angle · parallelogram + equal diagonals · isosceles trapezoid + 1 right angle.", "Dấu hiệu: 3 góc vuông · HBH có 1 góc vuông · HBH có 2 đường chéo bằng nhau · hình thang cân có 1 góc vuông."),
    bi("Right triangle: median to the hypotenuse = hypotenuse : 2.", "Tam giác vuông: trung tuyến ứng với cạnh huyền = cạnh huyền : 2."),
    bi("P = 2 × (length + width) · S = length × width", "P = 2 × (dài + rộng) · S = dài × rộng"),
  ],
};
