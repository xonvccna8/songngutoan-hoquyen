// Bài 15. Định lí Thalès trong tam giác — Thales' theorem in a triangle (Toán 8 KNTT, Chương IV)
import { bi, int, THALES, vn } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const tri = (extra: Partial<FigureSpec> = {}): FigureSpec => ({ points: THALES, polygon: ["A", "B", "C"], segments: [["D", "E"]], dots: ["D", "E"], ...extra });

/** Bộ số đẹp: AD = k·p, DB = k·q, AE = m·p, EC = m·q (các đoạn tương ứng tỉ lệ) */
function nums(r: () => number) {
  const p = int(r, 1, 4);
  let q = int(r, 1, 5);
  if (q === p) q++;
  const k = int(r, 1, 3);
  let m = int(r, 1, 3);
  if (m === k) m++;
  return { AD: k * p, DB: k * q, AE: m * p, EC: m * q };
}

/** Biết AD, DB, AE → tìm EC */
function genEC(r: () => number): Question {
  const { AD, DB, AE, EC } = nums(r);
  return {
    id: `g-th-ec-${AD}-${DB}-${AE}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: " cm",
    answer: EC,
    prompt: bi(`In triangle ABC, DE ∥ BC (D ∈ AB, E ∈ AC). AD = ${AD} cm, DB = ${DB} cm, AE = ${AE} cm. Find EC.`, `Tam giác ABC có DE ∥ BC (D ∈ AB, E ∈ AC). AD = ${AD} cm, DB = ${DB} cm, AE = ${AE} cm. Tính EC.`),
    figure: tri({ sideLabels: [["A", "D", `${AD}`], ["D", "B", `${DB}`], ["A", "E", `${AE}`], ["E", "C", "?"]] }),
    hints: [
      bi("Thales' theorem = định lí Thalès; proportional = tỉ lệ", "DE ∥ BC → các đoạn thẳng tương ứng tỉ lệ."),
      bi("AD/DB = AE/EC", "AD/DB = AE/EC"),
      bi(`EC = AE·DB/AD = ${AE}·${DB}/${AD} = ${EC} cm`, `EC = AE·DB : AD = ${AE}·${DB} : ${AD} = ${EC} cm`),
    ],
    explain: bi(`AD/DB = AE/EC ⇒ ${AD}/${DB} = ${AE}/EC ⇒ EC = ${EC} cm.`, `AD/DB = AE/EC ⇒ ${AD}/${DB} = ${AE}/EC ⇒ EC = ${EC} cm.`),
  };
}

/** Biết AD, AB, AC → tìm AE */
function genAE(r: () => number): Question {
  const { AD, DB, AE, EC } = nums(r);
  return {
    id: `g-th-ae-${AD}-${DB}-${AE}-${EC}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: " cm",
    answer: AE,
    prompt: bi(`In triangle ABC, DE ∥ BC (D ∈ AB, E ∈ AC). AD = ${AD} cm, AB = ${AD + DB} cm, AC = ${AE + EC} cm. Find AE.`, `Tam giác ABC có DE ∥ BC (D ∈ AB, E ∈ AC). AD = ${AD} cm, AB = ${AD + DB} cm, AC = ${AE + EC} cm. Tính AE.`),
    figure: tri(),
    hints: [
      bi("Use the whole sides: AD/AB = AE/AC.", "Dùng cả cạnh: AD/AB = AE/AC."),
      bi(`${AD}/${AD + DB} = AE/${AE + EC}`, `${AD}/${AD + DB} = AE/${AE + EC}`),
      bi(`AE = ${AD}·${AE + EC}/${AD + DB} = ${AE} cm`, `AE = ${AD}·${AE + EC} : ${AD + DB} = ${AE} cm`),
    ],
    explain: bi(`AD/AB = AE/AC ⇒ AE = ${AE} cm.`, `AD/AB = AE/AC ⇒ AE = ${AE} cm.`),
  };
}

/** Định lí đảo: DE có song song BC không? */
function genConverse(r: () => number): Question {
  const { AD, DB, AE, EC } = nums(r);
  const ok = r() < 0.5;
  const ec = ok ? EC : EC + 1;
  return {
    id: `g-th-conv-${AD}-${DB}-${AE}-${ec}`,
    type: "tf",
    level: 2,
    skill: "math",
    answer: ok,
    prompt: bi(`Triangle ABC has D ∈ AB, E ∈ AC with AD = ${AD}, DB = ${DB}, AE = ${AE}, EC = ${ec} (cm). True or false: DE ∥ BC.`, `Tam giác ABC có D ∈ AB, E ∈ AC với AD = ${AD}, DB = ${DB}, AE = ${AE}, EC = ${ec} (cm). Đúng hay sai: DE ∥ BC.`),
    figure: tri(),
    hints: [
      bi("converse = định lí đảo", "Định lí Thalès đảo: nếu AD/DB = AE/EC thì DE ∥ BC."),
      bi(`Compare ${AD}/${DB} and ${AE}/${ec}.`, `So sánh ${AD}/${DB} và ${AE}/${ec}.`),
      bi(ok ? "They are equal → parallel." : "They are different → not parallel.", ok ? "Bằng nhau → song song." : "Khác nhau → không song song."),
    ],
    explain: bi(`${AD}/${DB} ${ok ? "=" : "≠"} ${AE}/${ec}, so DE ${ok ? "∥" : "is not parallel to"} BC.`, `${AD}/${DB} ${ok ? "=" : "≠"} ${AE}/${ec} nên DE ${ok ? "∥ BC" : "không song song BC"}.`),
  };
}

/** Tìm x trong tỉ lệ thức */
function genX(r: () => number): Question {
  const { AD, DB, AE, EC } = nums(r);
  return {
    id: `g-th-x-${AD}-${DB}-${AE}-${EC}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: AD,
    prompt: bi(`In triangle ABC, DE ∥ BC with AD = x, DB = ${DB}, AE = ${AE}, EC = ${EC} (cm). Find x.`, `Tam giác ABC có DE ∥ BC, AD = x, DB = ${DB}, AE = ${AE}, EC = ${EC} (cm). Tìm x.`),
    figure: tri({ sideLabels: [["A", "D", "x"], ["D", "B", `${DB}`], ["A", "E", `${AE}`], ["E", "C", `${EC}`]] }),
    hints: [bi("Write the proportion first.", "Viết tỉ lệ thức trước."), bi(`x/${DB} = ${AE}/${EC}`, `x/${DB} = ${AE}/${EC}`), bi(`x = ${DB}·${AE}/${EC} = ${AD}`, `x = ${DB}·${AE} : ${EC} = ${AD}`)],
    explain: bi(`x = ${DB}·${AE}/${EC} = ${AD} cm.`, `x = ${DB}·${AE} : ${EC} = ${AD} cm.`),
  };
}

/** Ứng dụng: đo khoảng cách không đến được (tỉ lệ có số thập phân) */
function genApply(r: () => number): Question {
  const ad = int(r, 2, 6) * 2;
  const db = int(r, 10, 30);
  const ae = int(r, 3, 9);
  const ec = (ae * db) / ad;
  return {
    id: `g-th-app-${ad}-${db}-${ae}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: " m",
    answer: +ec.toFixed(2),
    prompt: bi(
      `To measure the width EC of a pond, a student marks points so that DE ∥ BC, AD = ${ad} m, DB = ${db} m, AE = ${ae} m. Find EC (to 2 decimal places if needed).`,
      `Để đo chiều rộng EC của một cái ao, bạn An cắm mốc sao cho DE ∥ BC, AD = ${ad} m, DB = ${db} m, AE = ${ae} m. Tính EC (làm tròn 2 chữ số thập phân nếu cần).`,
    ),
    figure: tri(),
    hints: [bi("This is Thales' theorem in real life.", "Đây là định lí Thalès trong thực tế."), bi("AD/DB = AE/EC", "AD/DB = AE/EC"), bi(`EC = ${ae}·${db}/${ad} = ${vn(+ec.toFixed(2))} m`, `EC = ${ae}·${db} : ${ad} = ${vn(+ec.toFixed(2))} m`)],
    explain: bi(`EC = ${ae}·${db}/${ad} ≈ ${vn(+ec.toFixed(2))} m.`, `EC = ${ae}·${db} : ${ad} ≈ ${vn(+ec.toFixed(2))} m.`),
  };
}

export const DINH_LI_THALES: LessonContent = {
  id: "k8-15",
  slug: "dinh-li-thales",
  title: bi("Thales' theorem in a triangle", "Định lí Thalès trong tam giác"),
  intro: bi(
    "Over 2,500 years ago, Thales measured the height of a pyramid using only a stick and shadows! His theorem about parallel lines and proportional segments is still used to measure things we cannot reach.",
    "Hơn 2 500 năm trước, Thalès đo chiều cao kim tự tháp chỉ bằng một cây gậy và bóng nắng! Định lí của ông về đường song song và đoạn thẳng tỉ lệ đến nay vẫn dùng để đo những khoảng cách không đến được.",
  ),
  goals: [bi("Understand proportional segments.", "Hiểu đoạn thẳng tỉ lệ."), bi("Use Thales' theorem and its converse.", "Vận dụng định lí Thalès và định lí đảo."), bi("Calculate lengths with proportions.", "Tính độ dài bằng tỉ lệ thức.")],
  terms: [
    { id: "thales", en: "Thales' theorem", ipa: "/ˈθeɪliːz ˈθɪərəm/", vi: "định lí Thalès", example: bi("Use Thales' theorem to find EC.", "Dùng định lí Thalès để tính EC.") },
    { id: "ratio", en: "ratio", ipa: "/ˈreɪʃiəʊ/", vi: "tỉ số", example: bi("The ratio of AD to AB is 2/5.", "Tỉ số của AD và AB là 2/5.") },
    { id: "proportional", en: "proportional", ipa: "/prəˈpɔːʃənl/", vi: "tỉ lệ", example: bi("The segments are proportional.", "Các đoạn thẳng tỉ lệ với nhau.") },
    { id: "proportion", en: "proportion", ipa: "/prəˈpɔːʃn/", vi: "tỉ lệ thức", example: bi("AD/DB = AE/EC is a proportion.", "AD/DB = AE/EC là một tỉ lệ thức.") },
    { id: "segment", en: "segment", ipa: "/ˈseɡmənt/", vi: "đoạn thẳng", example: bi("AD is a segment.", "AD là một đoạn thẳng.") },
    { id: "parallel-line", en: "parallel line", ipa: "/ˈpærəlel laɪn/", vi: "đường thẳng song song", example: bi("DE is parallel to BC.", "DE song song với BC.") },
    { id: "converse", en: "converse", ipa: "/ˈkɒnvɜːs/", vi: "định lí đảo", example: bi("The converse of Thales' theorem.", "Định lí Thalès đảo.") },
    { id: "corresponding", en: "corresponding", ipa: "/ˌkɒrəˈspɒndɪŋ/", vi: "tương ứng", example: bi("Corresponding segments are proportional.", "Các đoạn thẳng tương ứng tỉ lệ.") },
    { id: "intersect-sides", en: "cut two sides", ipa: "/kʌt tuː saɪdz/", vi: "cắt hai cạnh", example: bi("The line cuts two sides of the triangle.", "Đường thẳng cắt hai cạnh của tam giác.") },
  ],
  sections: [
    {
      id: "ti-le",
      title: bi("Proportional segments", "Đoạn thẳng tỉ lệ"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("AB and CD are proportional to A'B' and C'D' if AB/CD = A'B'/C'D'.", "Hai đoạn thẳng AB và CD gọi là tỉ lệ với hai đoạn thẳng A'B' và C'D' nếu AB/CD = A'B'/C'D'.") },
        { kind: "text", text: bi("The ratio of two segments is the ratio of their lengths (same unit), e.g. AB = 2 cm, CD = 5 cm ⇒ AB/CD = 2/5.", "Tỉ số của hai đoạn thẳng là tỉ số độ dài của chúng (cùng đơn vị đo), ví dụ AB = 2 cm, CD = 5 cm ⇒ AB/CD = 2/5.") },
      ],
    },
    {
      id: "dinh-li",
      title: bi("Thales' theorem", "Định lí Thalès"),
      blocks: [
        { kind: "key", tag: bi("Theorem", "Định lí"), tone: "sun", text: bi("If a line is parallel to one side of a triangle and cuts the other two sides, it divides them into proportional segments.", "Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.") },
        { kind: "text", text: bi("DE ∥ BC ⇒ AD/AB = AE/AC;  AD/DB = AE/EC;  DB/AB = EC/AC", "DE ∥ BC ⇒ AD/AB = AE/AC;  AD/DB = AE/EC;  DB/AB = EC/AC") },
        { kind: "play", mode: "thales" },
        {
          kind: "example",
          problem: bi("DE ∥ BC, AD = 3 cm, DB = 6 cm, AE = 4 cm. Find EC.", "DE ∥ BC, AD = 3 cm, DB = 6 cm, AE = 4 cm. Tính EC."),
          figure: tri({ sideLabels: [["A", "D", "3"], ["D", "B", "6"], ["A", "E", "4"], ["E", "C", "?"]] }),
          steps: [bi("Thales: AD/DB = AE/EC", "Theo định lí Thalès: AD/DB = AE/EC"), bi("3/6 = 4/EC", "3/6 = 4/EC"), bi("EC = 4·6/3 = 8 cm", "EC = 4·6 : 3 = 8 cm")],
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
            prompt: bi("DE ∥ BC, AD = 2 cm, DB = 4 cm, AE = 3 cm. Find EC.", "DE ∥ BC, AD = 2 cm, DB = 4 cm, AE = 3 cm. Tính EC."),
            figure: tri({ sideLabels: [["A", "D", "2"], ["D", "B", "4"], ["A", "E", "3"], ["E", "C", "?"]] }),
            hints: [bi("proportional = tỉ lệ", "AD/DB = AE/EC"), bi("2/4 = 3/EC", "2/4 = 3/EC"), bi("EC = 6 cm", "EC = 6 cm")],
            explain: bi("EC = 3·4/2 = 6 cm.", "EC = 3·4 : 2 = 6 cm."),
          },
        },
      ],
    },
    {
      id: "dao",
      title: bi("The converse", "Định lí đảo"),
      blocks: [
        { kind: "key", tag: bi("Converse", "Định lí đảo"), tone: "teal", text: bi("If a line cuts two sides of a triangle into corresponding proportional segments, it is parallel to the third side.", "Nếu một đường thẳng cắt hai cạnh của một tam giác và định ra trên hai cạnh này những đoạn thẳng tương ứng tỉ lệ thì đường thẳng đó song song với cạnh còn lại của tam giác.") },
        { kind: "text", text: bi("AD/DB = AE/EC ⇒ DE ∥ BC", "AD/DB = AE/EC ⇒ DE ∥ BC") },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "tf",
            level: 2,
            skill: "math",
            answer: true,
            prompt: bi("AD = 2, DB = 3, AE = 4, EC = 6 (cm). True or false: DE ∥ BC.", "AD = 2, DB = 3, AE = 4, EC = 6 (cm). Đúng hay sai: DE ∥ BC."),
            figure: tri(),
            hints: [bi("converse = định lí đảo", "So sánh AD/DB với AE/EC."), bi("2/3 and 4/6", "2/3 và 4/6"), bi("4/6 = 2/3 → parallel", "4/6 = 2/3 → song song")],
            explain: bi("2/3 = 4/6, so DE ∥ BC (converse of Thales' theorem).", "2/3 = 4/6 nên DE ∥ BC (định lí Thalès đảo)."),
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
      answer: 1,
      prompt: bi("“Các đoạn thẳng tương ứng tỉ lệ” in English is…", "“Các đoạn thẳng tương ứng tỉ lệ” trong tiếng Anh là…"),
      options: ["The segments are parallel.", "The corresponding segments are proportional.", "The segments are equal.", "The ratio is one."].map((t) => bi(t, t)),
      hints: [bi("tỉ lệ = proportional", "tỉ lệ = proportional"), bi("tương ứng = corresponding", "tương ứng = corresponding"), bi("The corresponding segments are proportional.", "The corresponding segments are proportional.")],
      explain: bi("corresponding = tương ứng; proportional = tỉ lệ", "corresponding = tương ứng; proportional = tỉ lệ"),
    },
  ],
  generators: [
    { level: 1, make: genEC },
    { level: 2, make: genAE },
    { level: 2, make: genConverse },
    { level: 3, make: genX },
    { level: 3, make: genApply },
  ],
  speak: [
    { en: "DE is parallel to BC.", vi: "DE song song với BC." },
    { en: "The corresponding segments are proportional.", vi: "Các đoạn thẳng tương ứng tỉ lệ." },
    { en: "We use Thales' theorem to find the length.", vi: "Chúng ta dùng định lí Thalès để tính độ dài." },
    { en: "This is the converse of the theorem.", vi: "Đây là định lí đảo." },
    { en: "The ratio of the two segments is two fifths.", vi: "Tỉ số của hai đoạn thẳng là hai phần năm." },
  ],
  summary: [
    bi("DE ∥ BC (D ∈ AB, E ∈ AC) ⇒ AD/AB = AE/AC, AD/DB = AE/EC, DB/AB = EC/AC", "DE ∥ BC (D ∈ AB, E ∈ AC) ⇒ AD/AB = AE/AC, AD/DB = AE/EC, DB/AB = EC/AC"),
    bi("Converse: AD/DB = AE/EC ⇒ DE ∥ BC", "Định lí đảo: AD/DB = AE/EC ⇒ DE ∥ BC"),
  ],
};
