// Bài 17. Tính chất đường phân giác của tam giác — The angle bisector theorem (Toán 8 KNTT, Chương IV)
import { BISECT, bi, int, shuffle } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const tri = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: BISECT, polygon: ["A", "B", "C"], segments: [["A", "D"]], dots: ["D"], ...extra });

/**
 * Bộ số: AB = p·k, AC = q·k, DB = p·m, DC = q·m (DB/DC = AB/AC).
 * Phải là tam giác thật: |AB − AC| < BC < AB + AC (m < k bảo đảm vế phải; vòng lặp kiểm vế trái).
 */
function nums(r: () => number) {
  for (;;) {
    const p = int(r, 2, 5);
    let q = int(r, 2, 7);
    if (q === p) q++;
    const m = int(r, 1, 3);
    const k = m + int(r, 1, 2);
    const [AB, AC, DB, DC] = [p * k, q * k, p * m, q * m];
    if (DB + DC > Math.abs(AB - AC)) return { p, q, AB, AC, DB, DC };
  }
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Biết AB, AC, DB → DC */
function genDC(r: () => number): Question {
  const { AB, AC, DB, DC } = nums(r);
  return {
    id: `g-bis-dc-${AB}-${AC}-${DB}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: " cm",
    answer: DC,
    prompt: bi(`AD is the angle bisector of triangle ABC (D ∈ BC). AB = ${AB} cm, AC = ${AC} cm, DB = ${DB} cm. Find DC.`, `AD là đường phân giác của tam giác ABC (D ∈ BC). AB = ${AB} cm, AC = ${AC} cm, DB = ${DB} cm. Tính DC.`),
    figure: tri({ sideLabels: [["A", "B", `${AB}`], ["A", "C", `${AC}`], ["B", "D", `${DB}`]] }),
    hints: [
      bi("angle bisector = đường phân giác", "Đường phân giác chia cạnh đối diện thành hai đoạn tỉ lệ với hai cạnh kề."),
      bi("DB/DC = AB/AC", "DB/DC = AB/AC"),
      bi(`DC = DB·AC/AB = ${DB}·${AC}/${AB} = ${DC} cm`, `DC = DB·AC : AB = ${DB}·${AC} : ${AB} = ${DC} cm`),
    ],
    explain: bi(`DB/DC = AB/AC ⇒ DC = ${DC} cm.`, `DB/DC = AB/AC ⇒ DC = ${DC} cm.`),
  };
}

/** Biết AB, AC, BC → DB */
function genDB(r: () => number): Question {
  const { AB, AC, DB, DC } = nums(r);
  return {
    id: `g-bis-db-${AB}-${AC}-${DB + DC}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: " cm",
    answer: DB,
    prompt: bi(`AD is the angle bisector of triangle ABC. AB = ${AB} cm, AC = ${AC} cm, BC = ${DB + DC} cm. Find DB.`, `AD là đường phân giác của tam giác ABC. AB = ${AB} cm, AC = ${AC} cm, BC = ${DB + DC} cm. Tính DB.`),
    figure: tri(),
    hints: [
      bi("DB/DC = AB/AC, so DB/(DB + DC) = AB/(AB + AC).", "DB/DC = AB/AC nên DB/BC = AB/(AB + AC)."),
      bi(`DB/${DB + DC} = ${AB}/${AB + AC}`, `DB/${DB + DC} = ${AB}/${AB + AC}`),
      bi(`DB = ${DB + DC}·${AB}/${AB + AC} = ${DB} cm`, `DB = ${DB + DC}·${AB} : ${AB + AC} = ${DB} cm`),
    ],
    explain: bi(`DB = BC·AB/(AB + AC) = ${DB} cm.`, `DB = BC·AB : (AB + AC) = ${DB} cm.`),
  };
}

/** Tỉ số DB/DC (trắc nghiệm) */
function genRatio(r: () => number): Question {
  const { AB, AC } = nums(r);
  // Tỉ số tối giản
  const g = gcd(AB, AC);
  const [p, q] = [AB / g, AC / g];
  const right = `${p}/${q}`;
  const opts = [right, `${q}/${p}`, `${p}/${p + q}`, `${q}/${p + q}`];
  const order = shuffle([0, 1, 2, 3], r);
  return {
    id: `g-bis-r-${AB}-${AC}`,
    type: "mcq",
    level: 1,
    skill: "math",
    answer: order.indexOf(0),
    options: order.map((i) => bi(opts[i], opts[i])),
    prompt: bi(`AD bisects angle A of triangle ABC. AB = ${AB} cm, AC = ${AC} cm. What is DB/DC?`, `AD là phân giác góc A của tam giác ABC. AB = ${AB} cm, AC = ${AC} cm. Tỉ số DB/DC bằng bao nhiêu?`),
    figure: tri(),
    hints: [bi("DB/DC = AB/AC", "DB/DC = AB/AC"), bi(`${AB}/${AC} — simplify the fraction.`, `${AB}/${AC} — rút gọn phân số.`), bi(right, right)],
    explain: bi(`DB/DC = ${AB}/${AC} = ${right}.`, `DB/DC = ${AB}/${AC} = ${right}.`),
  };
}

/** Tìm cạnh AC khi biết AB, DB, DC */
function genSide(r: () => number): Question {
  const { AB, AC, DB, DC } = nums(r);
  return {
    id: `g-bis-s-${AB}-${DB}-${DC}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: " cm",
    answer: AC,
    prompt: bi(`AD is the angle bisector of triangle ABC. AB = ${AB} cm, DB = ${DB} cm, DC = ${DC} cm. Find AC.`, `AD là đường phân giác của tam giác ABC. AB = ${AB} cm, DB = ${DB} cm, DC = ${DC} cm. Tính AC.`),
    figure: tri({ sideLabels: [["A", "B", `${AB}`], ["B", "D", `${DB}`], ["D", "C", `${DC}`]] }),
    hints: [bi("Write the proportion with AC unknown.", "Viết tỉ lệ thức với AC là ẩn."), bi(`${DB}/${DC} = ${AB}/AC`, `${DB}/${DC} = ${AB}/AC`), bi(`AC = ${AB}·${DC}/${DB} = ${AC} cm`, `AC = ${AB}·${DC} : ${DB} = ${AC} cm`)],
    explain: bi(`AC = AB·DC/DB = ${AC} cm.`, `AC = AB·DC : DB = ${AC} cm.`),
  };
}

export const PHAN_GIAC: LessonContent = {
  id: "k8-17",
  slug: "phan-giac",
  title: bi("The angle bisector theorem", "Tính chất đường phân giác của tam giác"),
  intro: bi(
    "The bisector of an angle in a triangle splits the opposite side into two parts — and their lengths follow the two other sides exactly!",
    "Đường phân giác của một góc trong tam giác chia cạnh đối diện thành hai phần — và độ dài hai phần đó tỉ lệ đúng với hai cạnh kề!",
  ),
  goals: [bi("State the angle bisector theorem.", "Phát biểu tính chất đường phân giác."), bi("Calculate segments on the opposite side.", "Tính độ dài các đoạn trên cạnh đối diện.")],
  terms: [
    { id: "angle-bisector-t", en: "angle bisector (of a triangle)", ipa: "/ˈæŋɡl baɪˈsektə(r)/", vi: "đường phân giác (của tam giác)", example: bi("AD is the angle bisector from A.", "AD là đường phân giác xuất phát từ A.") },
    { id: "opposite-side", en: "opposite side", ipa: "/ˈɒpəzɪt saɪd/", vi: "cạnh đối diện", example: bi("D lies on the opposite side BC.", "D nằm trên cạnh đối diện BC.") },
    { id: "adjacent-side", en: "adjacent side", ipa: "/əˈdʒeɪsnt saɪd/", vi: "cạnh kề", example: bi("AB and AC are the adjacent sides of angle A.", "AB và AC là hai cạnh kề của góc A.") },
    { id: "divide-into", en: "divide into", ipa: "/dɪˈvaɪd ˈɪntə/", vi: "chia thành", example: bi("AD divides BC into two segments.", "AD chia BC thành hai đoạn.") },
    { id: "bisect-angle", en: "bisect an angle", ipa: "/baɪˈsekt ən ˈæŋɡl/", vi: "chia đôi một góc", example: bi("AD bisects angle A.", "AD chia đôi góc A.") },
    { id: "simplify-frac", en: "simplify a fraction", ipa: "/ˈsɪmplɪfaɪ ə ˈfrækʃn/", vi: "rút gọn phân số", example: bi("Simplify 6/9 to 2/3.", "Rút gọn 6/9 thành 2/3.") },
    { id: "unknown-side", en: "unknown side", ipa: "/ˌʌnˈnəʊn saɪd/", vi: "cạnh chưa biết", example: bi("Find the unknown side AC.", "Tìm cạnh chưa biết AC.") },
    { id: "equal-ratio", en: "equal ratios", ipa: "/ˈiːkwəl ˈreɪʃiəʊz/", vi: "các tỉ số bằng nhau", example: bi("DB/DC and AB/AC are equal ratios.", "DB/DC và AB/AC là hai tỉ số bằng nhau.") },
  ],
  sections: [
    {
      id: "dinh-li",
      title: bi("The theorem", "Định lí"),
      blocks: [
        { kind: "key", tag: bi("Theorem", "Định lí"), tone: "sun", text: bi("In a triangle, the angle bisector divides the opposite side into two segments proportional to the two adjacent sides.", "Trong tam giác, đường phân giác của một góc chia cạnh đối diện thành hai đoạn thẳng tỉ lệ với hai cạnh kề hai đoạn ấy.") },
        { kind: "text", text: bi("AD bisects angle A (D ∈ BC) ⇒ DB/DC = AB/AC", "AD là phân giác góc A (D ∈ BC) ⇒ DB/DC = AB/AC") },
        { kind: "figure", figure: tri(), caption: bi("AD is the angle bisector of angle BAC", "AD là đường phân giác của góc BAC") },
        {
          kind: "example",
          problem: bi("AB = 4 cm, AC = 6 cm, BC = 5 cm, AD bisects angle A. Find DB and DC.", "AB = 4 cm, AC = 6 cm, BC = 5 cm, AD là phân giác góc A. Tính DB, DC."),
          figure: tri({ sideLabels: [["A", "B", "4"], ["A", "C", "6"]] }),
          steps: [bi("DB/DC = AB/AC = 4/6 = 2/3", "DB/DC = AB/AC = 4/6 = 2/3"), bi("DB = 5·2/(2 + 3) = 2 cm", "DB = 5·2 : (2 + 3) = 2 cm"), bi("DC = 5 − 2 = 3 cm", "DC = 5 − 2 = 3 cm")],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "number",
            level: 1,
            skill: "math",
            unit: " cm",
            answer: 6,
            prompt: bi("AD bisects angle A. AB = 3 cm, AC = 6 cm, DB = 3 cm. Find DC.", "AD là phân giác góc A. AB = 3 cm, AC = 6 cm, DB = 3 cm. Tính DC."),
            figure: tri(),
            hints: [bi("DB/DC = AB/AC", "DB/DC = AB/AC"), bi("3/DC = 3/6", "3/DC = 3/6"), bi("DC = 6 cm", "DC = 6 cm")],
            explain: bi("DC = 3·6/3 = 6 cm.", "DC = 3·6 : 3 = 6 cm."),
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
      answer: 0,
      prompt: bi("“AD là đường phân giác của góc A” in English is…", "“AD là đường phân giác của góc A” trong tiếng Anh là…"),
      options: ["AD is the angle bisector of angle A.", "AD is the median of angle A.", "AD is the altitude of angle A.", "AD is the midsegment of angle A."].map((t) => bi(t, t)),
      hints: [bi("phân giác = bisector", "phân giác = bisector"), bi("median = trung tuyến; altitude = đường cao", "median = trung tuyến; altitude = đường cao"), bi("angle bisector", "angle bisector")],
      explain: bi("angle bisector = đường phân giác", "angle bisector = đường phân giác"),
    },
  ],
  generators: [
    { level: 1, make: genDC },
    { level: 1, make: genRatio },
    { level: 2, make: genDB },
    { level: 3, make: genSide },
  ],
  speak: [
    { en: "AD bisects angle A.", vi: "AD chia đôi góc A." },
    { en: "The angle bisector divides the opposite side.", vi: "Đường phân giác chia cạnh đối diện." },
    { en: "The segments are proportional to the adjacent sides.", vi: "Các đoạn thẳng tỉ lệ với hai cạnh kề." },
    { en: "D lies on side BC.", vi: "D nằm trên cạnh BC." },
    { en: "Simplify the fraction first.", vi: "Rút gọn phân số trước." },
  ],
  summary: [bi("AD bisects angle A (D ∈ BC) ⇒ DB/DC = AB/AC", "AD là phân giác góc A (D ∈ BC) ⇒ DB/DC = AB/AC"), bi("DB = BC·AB/(AB + AC)", "DB = BC·AB : (AB + AC)")],
};
