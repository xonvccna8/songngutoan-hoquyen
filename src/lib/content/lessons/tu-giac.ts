// Bài 10. Tứ giác — Quadrilaterals (Toán 8 Kết nối tri thức, Chương III)
import { ABCD, bi, int, QUAD, shuffle } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const quad = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: QUAD, polygon: ABCD, ...extra });

/** Cho 3 góc, tìm góc còn lại */
function genFourth(r: () => number): Question {
  // Chọn 3 góc sao cho góc thứ tư nằm trong khoảng 50°–150° (thử lại vài lần, cuối cùng dùng bộ số an toàn)
  let [a, b, cc, d] = [80, 110, 70, 100];
  for (let i = 0; i < 20; i++) {
    const [x, y, z] = [int(r, 55, 135, 5), int(r, 55, 135, 5), int(r, 55, 135, 5)];
    const w = 360 - x - y - z;
    if (w >= 50 && w <= 150) {
      [a, b, cc, d] = [x, y, z, w];
      break;
    }
  }
  return {
    id: `g-fourth-${a}-${b}-${cc}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: "°",
    answer: d,
    prompt: bi(`Quadrilateral ABCD has ∠A = ${a}°, ∠B = ${b}°, ∠C = ${cc}°. Find ∠D.`, `Tứ giác ABCD có ∠A = ${a}°, ∠B = ${b}°, ∠C = ${cc}°. Tính ∠D.`),
    figure: quad({ angleLabels: [["A", `${a}°`], ["B", `${b}°`], ["C", `${cc}°`], ["D", "?"]] }),
    hints: [
      bi("sum of the angles = tổng các góc; quadrilateral = tứ giác", "Tổng các góc của tứ giác — sum of the angles of a quadrilateral"),
      bi("The four angles add up to 360°.", "Bốn góc cộng lại bằng 360°. Lấy 360° trừ đi ba góc đã biết."),
      bi(`∠D = 360° − ${a}° − ${b}° − ${cc}° = ${d}°`, `∠D = 360° − ${a}° − ${b}° − ${cc}° = ${d}°`),
    ],
    explain: bi(`∠A + ∠B + ∠C + ∠D = 360°, so ∠D = ${d}°.`, `∠A + ∠B + ∠C + ∠D = 360° nên ∠D = ${d}°.`),
  };
}

/** Hai góc đối bằng nhau, biết hai góc còn lại */
function genEqualPair(r: () => number): Question {
  const b = int(r, 70, 130, 10);
  const d = int(r, 60, 120, 10);
  const x = (360 - b - d) / 2;
  return {
    id: `g-pair-${b}-${d}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: "°",
    answer: x,
    prompt: bi(`Quadrilateral ABCD has ∠A = ∠C, ∠B = ${b}° and ∠D = ${d}°. Find ∠A.`, `Tứ giác ABCD có ∠A = ∠C, ∠B = ${b}° và ∠D = ${d}°. Tính ∠A.`),
    figure: quad({ angleLabels: [["A", "x"], ["B", `${b}°`], ["C", "x"], ["D", `${d}°`]] }),
    hints: [
      bi("∠A = ∠C means angle A equals angle C.", "∠A = ∠C nghĩa là hai góc A và C bằng nhau, gọi mỗi góc là x."),
      bi("x + x + ∠B + ∠D = 360°", "x + x + ∠B + ∠D = 360°, tìm 2x rồi chia đôi."),
      bi(`2x = 360° − ${b}° − ${d}° = ${2 * x}°, so x = ${x}°`, `2x = 360° − ${b}° − ${d}° = ${2 * x}° nên x = ${x}°`),
    ],
    explain: bi(`∠A = ∠C = (360° − ${b}° − ${d}°) : 2 = ${x}°.`, `∠A = ∠C = (360° − ${b}° − ${d}°) : 2 = ${x}°.`),
  };
}

/** Bốn góc tỉ lệ với các số cho trước */
const RATIOS = [[1, 2, 3, 4], [2, 3, 4, 6], [3, 4, 5, 6], [1, 1, 2, 2], [2, 3, 3, 4], [4, 5, 5, 6]];
function genRatio(r: () => number): Question {
  const k = RATIOS[int(r, 0, RATIOS.length - 1)];
  const sum = k.reduce((a, b) => a + b, 0);
  const unit = 360 / sum;
  const big = Math.max(...k) * unit;
  return {
    id: `g-ratio-${k.join("")}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: "°",
    answer: big,
    prompt: bi(
      `The angles ∠A, ∠B, ∠C, ∠D of quadrilateral ABCD are in the ratio ${k.join(" : ")}. Find the largest angle.`,
      `Các góc ∠A, ∠B, ∠C, ∠D của tứ giác ABCD tỉ lệ với ${k.join(" : ")}. Tính góc lớn nhất.`,
    ),
    hints: [
      bi("ratio = tỉ lệ; the largest angle = góc lớn nhất", "Tỉ lệ (ratio): mỗi góc gồm một số “phần” bằng nhau."),
      bi(`Total parts: ${k.join(" + ")} = ${sum}. One part = 360° : ${sum}.`, `Tổng số phần: ${k.join(" + ")} = ${sum}. Một phần = 360° : ${sum}.`),
      bi(`One part = ${unit}°. Largest angle = ${Math.max(...k)} × ${unit}° = ${big}°`, `Một phần = ${unit}°. Góc lớn nhất = ${Math.max(...k)} × ${unit}° = ${big}°`),
    ],
    explain: bi(`360° : ${sum} = ${unit}°, so the largest angle is ${big}°.`, `360° : ${sum} = ${unit}° nên góc lớn nhất bằng ${big}°.`),
  };
}

/** Nhận diện thuật ngữ: cho nghĩa tiếng Việt, chọn từ tiếng Anh */
const WORDS: [string, string][] = [
  ["vertex", "đỉnh"],
  ["side", "cạnh"],
  ["diagonal", "đường chéo"],
  ["opposite angles", "hai góc đối"],
  ["adjacent sides", "hai cạnh kề"],
  ["convex quadrilateral", "tứ giác lồi"],
];
function genWord(r: () => number): Question {
  const i = int(r, 0, WORDS.length - 1);
  const opts = shuffle(WORDS.filter((_, j) => j !== i), r).slice(0, 3).concat([WORDS[i]]);
  const order = shuffle(opts, r);
  return {
    id: `g-word-${i}`,
    type: "mcq",
    level: 1,
    skill: "lang",
    answer: order.indexOf(WORDS[i]),
    options: order.map(([en]) => bi(en, en)),
    prompt: bi(`Which English term means “${WORDS[i][1]}”?`, `Thuật ngữ tiếng Anh nào nghĩa là “${WORDS[i][1]}”?`),
    hints: [
      bi("Look at the word list of this lesson.", "Xem lại bảng từ vựng của bài."),
      bi("Read each option aloud and think of the figure.", "Đọc to từng phương án và nghĩ tới hình vẽ."),
      bi(`Answer: ${WORDS[i][0]}`, `Đáp án: ${WORDS[i][0]}`),
    ],
    explain: bi(`“${WORDS[i][1]}” is “${WORDS[i][0]}”.`, `“${WORDS[i][1]}” trong tiếng Anh là “${WORDS[i][0]}”.`),
  };
}

export const TU_GIAC: LessonContent = {
  id: "k8-10",
  slug: "tu-giac",
  title: bi("Quadrilaterals", "Tứ giác"),
  intro: bi(
    "Tables, windows, kites, phone screens… Many shapes around us have four sides. Let's learn their names and their most important property!",
    "Mặt bàn, khung cửa, cánh diều, màn hình điện thoại… Rất nhiều hình quanh ta có bốn cạnh. Cùng học tên gọi và tính chất quan trọng nhất của chúng nhé!",
  ),
  goals: [
    bi("Name the vertices, sides, angles and diagonals of a quadrilateral.", "Gọi tên đỉnh, cạnh, góc, đường chéo của tứ giác."),
    bi("Recognise a convex quadrilateral.", "Nhận biết tứ giác lồi."),
    bi("Use: the angles of a quadrilateral add up to 360°.", "Vận dụng: tổng các góc của một tứ giác bằng 360°."),
  ],
  terms: [
    { id: "quadrilateral", en: "quadrilateral", ipa: "/ˌkwɒdrɪˈlætərəl/", vi: "tứ giác", example: bi("ABCD is a quadrilateral.", "ABCD là một tứ giác.") },
    { id: "vertex", en: "vertex (vertices)", ipa: "/ˈvɜːteks/", vi: "đỉnh (các đỉnh)", example: bi("A, B, C, D are the vertices.", "A, B, C, D là các đỉnh.") },
    { id: "side", en: "side", ipa: "/saɪd/", vi: "cạnh", example: bi("AB is a side of ABCD.", "AB là một cạnh của ABCD.") },
    { id: "angle", en: "angle", ipa: "/ˈæŋɡl/", vi: "góc", example: bi("Angle A is 70 degrees.", "Góc A bằng 70 độ.") },
    { id: "diagonal", en: "diagonal", ipa: "/daɪˈæɡənl/", vi: "đường chéo", example: bi("AC and BD are the diagonals.", "AC và BD là hai đường chéo.") },
    { id: "convex", en: "convex", ipa: "/ˈkɒnveks/", vi: "lồi", example: bi("ABCD is a convex quadrilateral.", "ABCD là một tứ giác lồi.") },
    { id: "adjacent-sides", en: "adjacent sides", ipa: "/əˈdʒeɪsnt saɪdz/", vi: "hai cạnh kề", example: bi("AB and BC are adjacent sides.", "AB và BC là hai cạnh kề.") },
    { id: "opposite-sides", en: "opposite sides", ipa: "/ˈɒpəzɪt saɪdz/", vi: "hai cạnh đối", example: bi("AB and CD are opposite sides.", "AB và CD là hai cạnh đối.") },
    { id: "opposite-angles", en: "opposite angles", ipa: "/ˈɒpəzɪt ˈæŋɡlz/", vi: "hai góc đối", example: bi("∠A and ∠C are opposite angles.", "∠A và ∠C là hai góc đối.") },
    { id: "sum", en: "sum", ipa: "/sʌm/", vi: "tổng", example: bi("The sum of the angles is 360°.", "Tổng các góc bằng 360°.") },
    { id: "degree", en: "degree", ipa: "/dɪˈɡriː/", vi: "độ (đơn vị đo góc)", example: bi("A right angle is 90 degrees.", "Góc vuông bằng 90 độ.") },
  ],
  sections: [
    {
      id: "dinh-nghia",
      title: bi("What is a quadrilateral?", "Tứ giác là gì?"),
      blocks: [
        {
          kind: "key",
          tag: bi("Definition", "Định nghĩa"),
          text: bi(
            "Quadrilateral ABCD is a figure made of four segments AB, BC, CD and DA, in which no two segments lie on the same line.",
            "Tứ giác ABCD là hình gồm bốn đoạn thẳng AB, BC, CD, DA, trong đó không có hai đoạn thẳng nào cùng nằm trên một đường thẳng.",
          ),
        },
        { kind: "figure", figure: quad({ segments: [["A", "C"], ["B", "D"]] }), caption: bi("Quadrilateral ABCD with its two diagonals", "Tứ giác ABCD và hai đường chéo") },
        {
          kind: "list",
          tag: bi("Parts of a quadrilateral", "Các yếu tố của tứ giác"),
          items: [
            bi("Vertices: A, B, C, D", "Đỉnh: A, B, C, D"),
            bi("Sides: AB, BC, CD, DA", "Cạnh: AB, BC, CD, DA"),
            bi("Angles: ∠A, ∠B, ∠C, ∠D", "Góc: ∠A, ∠B, ∠C, ∠D"),
            bi("Diagonals: AC, BD (they join two opposite vertices)", "Đường chéo: AC, BD (nối hai đỉnh đối nhau)"),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "mcq",
            level: 1,
            skill: "lang",
            answer: 2,
            prompt: bi("In quadrilateral ABCD, which segment is a diagonal?", "Trong tứ giác ABCD, đoạn thẳng nào là đường chéo?"),
            options: [bi("AB", "AB"), bi("CD", "CD"), bi("BD", "BD"), bi("DA", "DA")],
            hints: [bi("diagonal = đường chéo", "Đường chéo = diagonal"), bi("A diagonal joins two vertices that are not next to each other.", "Đường chéo nối hai đỉnh không kề nhau."), bi("BD joins B and D.", "BD nối B với D.")],
            explain: bi("BD joins two opposite vertices B and D, so it is a diagonal. AB, CD, DA are sides.", "BD nối hai đỉnh đối B và D nên là đường chéo. AB, CD, DA là cạnh."),
          },
        },
      ],
    },
    {
      id: "tu-giac-loi",
      title: bi("Convex quadrilaterals", "Tứ giác lồi"),
      blocks: [
        {
          kind: "key",
          tag: bi("Definition", "Định nghĩa"),
          tone: "teal",
          text: bi(
            "A convex quadrilateral always lies on one side of the line containing any of its sides.",
            "Tứ giác lồi là tứ giác luôn nằm về một phía của đường thẳng chứa bất kì cạnh nào của tứ giác.",
          ),
        },
        { kind: "text", text: bi("From now on, “quadrilateral” means a convex quadrilateral.", "Từ nay, khi nói “tứ giác” mà không nói gì thêm, ta hiểu đó là tứ giác lồi.") },
        {
          kind: "list",
          tag: bi("Useful words", "Từ hay dùng"),
          items: [
            bi("Adjacent sides share a vertex: AB and BC.", "Hai cạnh kề có chung một đỉnh: AB và BC."),
            bi("Opposite sides do not share a vertex: AB and CD; AD and BC.", "Hai cạnh đối không có đỉnh chung: AB và CD; AD và BC."),
            bi("Opposite angles: ∠A and ∠C; ∠B and ∠D.", "Hai góc đối: ∠A và ∠C; ∠B và ∠D."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "tf",
            level: 1,
            skill: "lang",
            answer: false,
            prompt: bi("True or false: AB and BC are opposite sides of ABCD.", "Đúng hay sai: AB và BC là hai cạnh đối của tứ giác ABCD."),
            hints: [bi("opposite = đối; adjacent = kề", "Đối = opposite; kề = adjacent"), bi("Do AB and BC share a vertex?", "AB và BC có chung đỉnh nào không?"), bi("They share B → adjacent.", "Có chung đỉnh B → là hai cạnh kề.")],
            explain: bi("AB and BC share vertex B, so they are adjacent sides, not opposite sides.", "AB và BC có chung đỉnh B nên là hai cạnh kề, không phải hai cạnh đối."),
          },
        },
      ],
    },
    {
      id: "tong-cac-goc",
      title: bi("The sum of the angles", "Tổng các góc của tứ giác"),
      blocks: [
        { kind: "key", tag: bi("Theorem", "Định lí"), tone: "sun", text: bi("The sum of the angles of a quadrilateral is 360°.", "Tổng các góc của một tứ giác bằng 360°.") },
        { kind: "text", text: bi("∠A + ∠B + ∠C + ∠D = 360°", "∠A + ∠B + ∠C + ∠D = 360°") },
        {
          kind: "list",
          tag: bi("Why?", "Vì sao?"),
          items: [
            bi("Draw diagonal AC. It cuts ABCD into two triangles: ABC and ACD.", "Vẽ đường chéo AC. Tứ giác được chia thành hai tam giác ABC và ACD."),
            bi("The angles of each triangle add up to 180°.", "Tổng ba góc của mỗi tam giác bằng 180°."),
            bi("So the four angles of ABCD add up to 180° + 180° = 360°.", "Vậy bốn góc của ABCD có tổng 180° + 180° = 360°."),
          ],
        },
        { kind: "play", mode: "quad" },
        {
          kind: "example",
          problem: bi("ABCD has ∠A = 70°, ∠B = 110°, ∠C = 80°. Find ∠D.", "Tứ giác ABCD có ∠A = 70°, ∠B = 110°, ∠C = 80°. Tính ∠D."),
          figure: quad({ angleLabels: [["A", "70°"], ["B", "110°"], ["C", "80°"], ["D", "?"]] }),
          steps: [
            bi("∠A + ∠B + ∠C + ∠D = 360° (sum of the angles of a quadrilateral)", "∠A + ∠B + ∠C + ∠D = 360° (tổng các góc của tứ giác)"),
            bi("70° + 110° + 80° + ∠D = 360°", "70° + 110° + 80° + ∠D = 360°"),
            bi("∠D = 360° − 260° = 100°", "∠D = 360° − 260° = 100°"),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c3",
            type: "number",
            level: 1,
            skill: "math",
            unit: "°",
            answer: 90,
            prompt: bi("A quadrilateral has three angles of 90°. What is the fourth angle?", "Một tứ giác có ba góc bằng 90°. Góc thứ tư bằng bao nhiêu độ?"),
            hints: [bi("fourth = thứ tư", "Góc thứ tư = the fourth angle"), bi("360° minus the three angles.", "Lấy 360° trừ ba góc đã biết."), bi("360° − 3 × 90° = 90°", "360° − 3 × 90° = 90°")],
            explain: bi("360° − 270° = 90°. All four angles are right angles!", "360° − 270° = 90°. Cả bốn góc đều vuông!"),
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
      accept: ["quadrilateral", "a quadrilateral"],
      prompt: bi("Type the English word for “tứ giác”.", "Gõ từ tiếng Anh của “tứ giác”."),
      hints: [bi("It starts with “quad-” (four).", "Bắt đầu bằng “quad-” (nghĩa là bốn)."), bi("quad + lateral (side)", "quad (bốn) + lateral (cạnh)"), bi("quadrilateral", "quadrilateral")],
      explain: bi("quadrilateral /ˌkwɒdrɪˈlætərəl/ = tứ giác", "quadrilateral /ˌkwɒdrɪˈlætərəl/ = tứ giác"),
    },
    {
      id: "p2",
      type: "mcq",
      level: 1,
      skill: "math",
      answer: 1,
      prompt: bi("How many diagonals does a quadrilateral have?", "Một tứ giác có bao nhiêu đường chéo?"),
      options: [bi("1", "1"), bi("2", "2"), bi("3", "3"), bi("4", "4")],
      hints: [bi("diagonal = đường chéo", "Đường chéo nối hai đỉnh đối nhau."), bi("List the pairs of opposite vertices.", "Liệt kê các cặp đỉnh đối: A–C, B–D."), bi("AC and BD → 2 diagonals", "AC và BD → 2 đường chéo")],
      explain: bi("A quadrilateral has 2 diagonals: AC and BD.", "Tứ giác có 2 đường chéo: AC và BD."),
    },
    {
      id: "p3",
      type: "tf",
      level: 2,
      skill: "math",
      answer: false,
      prompt: bi("True or false: A quadrilateral can have four angles of 100°.", "Đúng hay sai: Một tứ giác có thể có cả bốn góc bằng 100°."),
      hints: [bi("sum = tổng", "Nghĩ tới tổng các góc."), bi("4 × 100° = ? Compare with 360°.", "4 × 100° = ? So sánh với 360°."), bi("400° ≠ 360° → impossible", "400° ≠ 360° → không thể")],
      explain: bi("4 × 100° = 400°, but the sum must be 360°. So it is false.", "4 × 100° = 400° nhưng tổng các góc phải bằng 360°. Vậy là sai."),
    },
    {
      id: "p4",
      type: "mcq",
      level: 2,
      skill: "math",
      answer: 3,
      prompt: bi("Can a quadrilateral have four acute angles (each less than 90°)?", "Một tứ giác có thể có cả bốn góc nhọn (mỗi góc nhỏ hơn 90°) không?"),
      options: [bi("Yes, always", "Có, luôn luôn"), bi("Yes, sometimes", "Có, đôi khi"), bi("Only if it is convex", "Chỉ khi là tứ giác lồi"), bi("No, never", "Không bao giờ")],
      hints: [bi("acute angle = góc nhọn (< 90°)", "Góc nhọn (acute angle) nhỏ hơn 90°."), bi("If all four angles are less than 90°, their sum is less than …?", "Nếu cả bốn góc nhỏ hơn 90° thì tổng nhỏ hơn bao nhiêu?"), bi("Sum < 4 × 90° = 360° → impossible", "Tổng < 4 × 90° = 360° → vô lí")],
      explain: bi("Four acute angles would add up to less than 360°, which is impossible.", "Bốn góc nhọn có tổng nhỏ hơn 360°, trái với định lí. Vậy không bao giờ có."),
    },
    {
      id: "p5",
      type: "number",
      level: 2,
      skill: "math",
      unit: "°",
      answer: 115,
      prompt: bi("ABCD has ∠A = 65°, ∠B = ∠D = 90°. Find ∠C.", "Tứ giác ABCD có ∠A = 65°, ∠B = ∠D = 90°. Tính ∠C."),
      figure: quad({ angleLabels: [["A", "65°"], ["B", "90°"], ["C", "?"], ["D", "90°"]] }),
      hints: [bi("∠B = ∠D = 90°: both are right angles.", "∠B = ∠D = 90°: cả hai đều là góc vuông."), bi("∠C = 360° − ∠A − ∠B − ∠D", "∠C = 360° − ∠A − ∠B − ∠D"), bi("360° − 65° − 90° − 90° = 115°", "360° − 65° − 90° − 90° = 115°")],
      explain: bi("∠C = 360° − 65° − 180° = 115°.", "∠C = 360° − 65° − 180° = 115°."),
    },
    {
      id: "p6",
      type: "number",
      level: 3,
      skill: "math",
      unit: "°",
      answer: 100,
      prompt: bi(
        "ABCD has ∠A = 100°, ∠B = 80° and ∠C − ∠D = 20°. Find ∠C.",
        "Tứ giác ABCD có ∠A = 100°, ∠B = 80° và ∠C − ∠D = 20°. Tính ∠C.",
      ),
      hints: [bi("∠C − ∠D = 20° means ∠C is 20° bigger than ∠D.", "∠C − ∠D = 20° nghĩa là ∠C lớn hơn ∠D 20°."), bi("First find ∠C + ∠D = 360° − 100° − 80°. Then use “sum and difference”.", "Tìm trước ∠C + ∠D = 360° − 100° − 80°, rồi dùng bài toán tổng – hiệu."), bi("∠C + ∠D = 180°, ∠C − ∠D = 20° → ∠C = (180° + 20°) : 2 = 100°", "∠C + ∠D = 180°, ∠C − ∠D = 20° → ∠C = (180° + 20°) : 2 = 100°")],
      explain: bi("∠C + ∠D = 180° and ∠C − ∠D = 20°, so ∠C = (180° + 20°) : 2 = 100°.", "∠C + ∠D = 180° và ∠C − ∠D = 20° nên ∠C = (180° + 20°) : 2 = 100°."),
    },
  ],
  generators: [
    { level: 1, make: genFourth },
    { level: 1, make: genWord },
    { level: 2, make: genEqualPair },
    { level: 3, make: genRatio },
  ],
  speak: [
    { en: "A quadrilateral has four sides and four angles.", vi: "Tứ giác có bốn cạnh và bốn góc." },
    { en: "A diagonal joins two opposite vertices.", vi: "Đường chéo nối hai đỉnh đối nhau." },
    { en: "Adjacent sides share a common vertex.", vi: "Hai cạnh kề có chung một đỉnh." },
    { en: "The sum of the angles of a quadrilateral is 360 degrees.", vi: "Tổng các góc của một tứ giác bằng 360 độ." },
    { en: "Angle A and angle C are opposite angles.", vi: "Góc A và góc C là hai góc đối." },
  ],
  summary: [
    bi("Quadrilateral ABCD: 4 vertices, 4 sides, 4 angles, 2 diagonals (AC, BD).", "Tứ giác ABCD: 4 đỉnh, 4 cạnh, 4 góc, 2 đường chéo (AC, BD)."),
    bi("Convex: lies on one side of the line through any side.", "Tứ giác lồi: luôn nằm về một phía của đường thẳng chứa bất kì cạnh nào."),
    bi("∠A + ∠B + ∠C + ∠D = 360°", "Tổng các góc của tứ giác: ∠A + ∠B + ∠C + ∠D = 360°"),
  ],
};
