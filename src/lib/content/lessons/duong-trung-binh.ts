// Bài 16. Đường trung bình của tam giác — Midsegments of a triangle (Toán 8 KNTT, Chương IV)
import { bi, int, THALES, vn } from "@/lib/content/helpers";
import type { FigureSpec, LessonContent, Question } from "@/lib/content/types";

const tri = (extra: Partial<FigureSpec> = {}): FigureSpec => ({
  points: THALES,
  polygon: ["A", "B", "C"],
  segments: [["M", "N"]],
  dots: ["M", "N"],
  ticks: [["A", "M", 1], ["M", "B", 1], ["A", "N", 2], ["N", "C", 2]],
  ...extra,
});

/** BC → MN hoặc MN → BC */
function genHalf(r: () => number): Question {
  const bc = int(r, 4, 30);
  const fromBC = r() < 0.6;
  const ans = fromBC ? bc / 2 : bc;
  return {
    id: `g-mid-${bc}-${fromBC}`,
    type: "number",
    level: 1,
    skill: "math",
    unit: " cm",
    answer: ans,
    prompt: fromBC
      ? bi(`M, N are the midpoints of AB and AC in triangle ABC. BC = ${bc} cm. Find MN.`, `Tam giác ABC có M, N lần lượt là trung điểm của AB, AC. BC = ${bc} cm. Tính MN.`)
      : bi(`M, N are the midpoints of AB and AC in triangle ABC. MN = ${vn(bc / 2)} cm. Find BC.`, `Tam giác ABC có M, N lần lượt là trung điểm của AB, AC. MN = ${vn(bc / 2)} cm. Tính BC.`),
    figure: tri({ sideLabels: fromBC ? [["B", "C", `${bc} cm`]] : [["M", "N", `${vn(bc / 2)} cm`]] }),
    hints: [
      bi("midsegment = đường trung bình", "MN nối trung điểm hai cạnh → MN là đường trung bình."),
      bi("MN ∥ BC and MN = BC : 2", "MN ∥ BC và MN = BC : 2"),
      fromBC ? bi(`MN = ${bc} : 2 = ${vn(ans)} cm`, `MN = ${bc} : 2 = ${vn(ans)} cm`) : bi(`BC = 2·MN = ${bc} cm`, `BC = 2·MN = ${bc} cm`),
    ],
    explain: bi(`MN is a midsegment: MN = BC/2, so ${fromBC ? `MN = ${vn(ans)}` : `BC = ${bc}`} cm.`, `MN là đường trung bình: MN = BC : 2, nên ${fromBC ? `MN = ${vn(ans)}` : `BC = ${bc}`} cm.`),
  };
}

/** Chu vi tam giác tạo bởi ba đường trung bình */
function genPerimeter(r: () => number): Question {
  const [a, b, c] = [int(r, 4, 12), int(r, 5, 13), int(r, 6, 14)];
  if (a + b <= c || a + c <= b || b + c <= a) return genPerimeter(r);
  const p = a + b + c;
  return {
    id: `g-midp-${a}-${b}-${c}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: " cm",
    answer: p / 2,
    prompt: bi(
      `Triangle ABC has sides ${a} cm, ${b} cm, ${c} cm. M, N, P are the midpoints of its sides. Find the perimeter of triangle MNP.`,
      `Tam giác ABC có các cạnh ${a} cm, ${b} cm, ${c} cm. M, N, P là trung điểm các cạnh. Tính chu vi tam giác MNP.`,
    ),
    hints: [
      bi("Each side of MNP is a midsegment.", "Mỗi cạnh của tam giác MNP là một đường trung bình."),
      bi("Each midsegment = half of a side, so the perimeter halves.", "Mỗi đường trung bình bằng nửa một cạnh → chu vi giảm một nửa."),
      bi(`(${a} + ${b} + ${c}) : 2 = ${vn(p / 2)} cm`, `(${a} + ${b} + ${c}) : 2 = ${vn(p / 2)} cm`),
    ],
    explain: bi(`Perimeter of MNP = ${p} : 2 = ${vn(p / 2)} cm.`, `Chu vi MNP = ${p} : 2 = ${vn(p / 2)} cm.`),
  };
}

/** Đường thẳng qua trung điểm, song song cạnh → đi qua trung điểm cạnh thứ ba */
function genThrough(r: () => number): Question {
  const ac = int(r, 3, 12) * 2;
  return {
    id: `g-midt-${ac}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: " cm",
    answer: ac / 2,
    prompt: bi(
      `In triangle ABC, M is the midpoint of AB. The line through M parallel to BC meets AC at N. AC = ${ac} cm. Find AN.`,
      `Tam giác ABC có M là trung điểm AB. Đường thẳng qua M song song với BC cắt AC tại N. AC = ${ac} cm. Tính AN.`,
    ),
    figure: tri({ ticks: [["A", "M", 1], ["M", "B", 1]] }),
    hints: [
      bi("A line through a midpoint, parallel to a side…", "Đường thẳng đi qua trung điểm một cạnh và song song cạnh thứ hai…"),
      bi("…passes through the midpoint of the third side: N is the midpoint of AC.", "…thì đi qua trung điểm cạnh thứ ba: N là trung điểm AC."),
      bi(`AN = ${ac} : 2 = ${ac / 2} cm`, `AN = ${ac} : 2 = ${ac / 2} cm`),
    ],
    explain: bi(`N is the midpoint of AC, so AN = ${ac / 2} cm.`, `N là trung điểm AC nên AN = ${ac / 2} cm.`),
  };
}

/** Ứng dụng: đo khoảng cách qua hồ */
function genLake(r: () => number): Question {
  const mn = int(r, 15, 60);
  return {
    id: `g-midl-${mn}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: " m",
    answer: 2 * mn,
    prompt: bi(
      `To find the distance BC across a lake, Nam picks a point A, then marks the midpoints M of AB and N of AC. He measures MN = ${mn} m. Find BC.`,
      `Để đo khoảng cách BC qua một hồ nước, Nam chọn điểm A, đánh dấu trung điểm M của AB và N của AC rồi đo được MN = ${mn} m. Tính BC.`,
    ),
    figure: tri({ sideLabels: [["M", "N", `${mn} m`]] }),
    hints: [bi("Is MN a midsegment?", "MN có phải đường trung bình không?"), bi("MN = BC : 2", "MN = BC : 2"), bi(`BC = 2·${mn} = ${2 * mn} m`, `BC = 2·${mn} = ${2 * mn} m`)],
    explain: bi(`BC = 2·MN = ${2 * mn} m.`, `BC = 2·MN = ${2 * mn} m.`),
  };
}

export const DUONG_TRUNG_BINH: LessonContent = {
  id: "k8-16",
  slug: "duong-trung-binh",
  title: bi("Midsegments of a triangle", "Đường trung bình của tam giác"),
  intro: bi(
    "Join the midpoints of two sides of a triangle: the segment you get is always parallel to the third side and exactly half as long. A simple idea with many uses!",
    "Nối trung điểm hai cạnh của một tam giác: đoạn thẳng nhận được luôn song song với cạnh thứ ba và dài đúng bằng một nửa. Ý tưởng đơn giản mà rất nhiều ứng dụng!",
  ),
  goals: [bi("Know the midsegment of a triangle.", "Nhận biết đường trung bình của tam giác."), bi("Use: MN ∥ BC and MN = BC : 2.", "Vận dụng: MN ∥ BC và MN = BC : 2.")],
  terms: [
    { id: "midsegment", en: "midsegment", ipa: "/ˈmɪdseɡmənt/", vi: "đường trung bình", example: bi("MN is a midsegment of triangle ABC.", "MN là đường trung bình của tam giác ABC.") },
    { id: "midpoint-t", en: "midpoint of a side", ipa: "/ˈmɪdpɔɪnt əv ə saɪd/", vi: "trung điểm của cạnh", example: bi("M is the midpoint of side AB.", "M là trung điểm của cạnh AB.") },
    { id: "join", en: "join", ipa: "/dʒɔɪn/", vi: "nối", example: bi("Join M and N.", "Nối M với N.") },
    { id: "third-side", en: "third side", ipa: "/θɜːd saɪd/", vi: "cạnh thứ ba", example: bi("MN is parallel to the third side.", "MN song song với cạnh thứ ba.") },
    { id: "half-as-long", en: "half as long as", ipa: "/hɑːf æz lɒŋ æz/", vi: "dài bằng một nửa", example: bi("MN is half as long as BC.", "MN dài bằng một nửa BC.") },
    { id: "passes-through", en: "pass through", ipa: "/pɑːs θruː/", vi: "đi qua", example: bi("The line passes through N.", "Đường thẳng đi qua N.") },
    { id: "distance", en: "distance", ipa: "/ˈdɪstəns/", vi: "khoảng cách", example: bi("Find the distance across the lake.", "Tìm khoảng cách qua hồ.") },
    { id: "perimeter-t", en: "perimeter of a triangle", ipa: "/pəˈrɪmɪtər əv ə ˈtraɪæŋɡl/", vi: "chu vi tam giác", example: bi("The perimeter of MNP is half.", "Chu vi MNP bằng một nửa.") },
  ],
  sections: [
    {
      id: "dinh-nghia",
      title: bi("What is a midsegment?", "Đường trung bình là gì?"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("A midsegment of a triangle is the segment joining the midpoints of two sides.", "Đường trung bình của tam giác là đoạn thẳng nối trung điểm hai cạnh của tam giác.") },
        { kind: "figure", figure: tri(), caption: bi("M, N are midpoints of AB, AC → MN is a midsegment", "M, N là trung điểm AB, AC → MN là đường trung bình") },
        { kind: "text", text: bi("Every triangle has 3 midsegments.", "Mỗi tam giác có 3 đường trung bình.") },
      ],
    },
    {
      id: "tinh-chat",
      title: bi("Properties", "Tính chất"),
      blocks: [
        { kind: "key", tag: bi("Theorem 1", "Định lí 1"), tone: "teal", text: bi("A line through the midpoint of one side, parallel to a second side, passes through the midpoint of the third side.", "Đường thẳng đi qua trung điểm một cạnh của tam giác và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba.") },
        { kind: "key", tag: bi("Theorem 2", "Định lí 2"), tone: "sun", text: bi("The midsegment is parallel to the third side and equal to half of it: MN ∥ BC, MN = BC/2.", "Đường trung bình của tam giác thì song song với cạnh thứ ba và bằng nửa cạnh ấy: MN ∥ BC, MN = BC : 2.") },
        { kind: "play", mode: "thales" },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "number",
            level: 1,
            skill: "math",
            unit: " cm",
            answer: 7,
            prompt: bi("M, N are midpoints of AB, AC. BC = 14 cm. Find MN.", "M, N là trung điểm AB, AC. BC = 14 cm. Tính MN."),
            figure: tri({ sideLabels: [["B", "C", "14 cm"]] }),
            hints: [bi("midsegment = đường trung bình", "MN là đường trung bình."), bi("MN = BC : 2", "MN = BC : 2"), bi("7 cm", "7 cm")],
            explain: bi("MN = 14 : 2 = 7 cm.", "MN = 14 : 2 = 7 cm."),
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
      accept: ["midsegment", "midline", "mid-segment"],
      prompt: bi("Type the English word for “đường trung bình” (of a triangle).", "Gõ từ tiếng Anh của “đường trung bình” (của tam giác)."),
      hints: [bi("mid + segment", "mid (giữa) + segment (đoạn thẳng)"), bi("mid-se…", "mid-se…"), bi("midsegment", "midsegment")],
      explain: bi("midsegment (also: midline) = đường trung bình", "midsegment (hoặc midline) = đường trung bình"),
    },
  ],
  generators: [
    { level: 1, make: genHalf },
    { level: 2, make: genPerimeter },
    { level: 2, make: genThrough },
    { level: 3, make: genLake },
  ],
  speak: [
    { en: "MN is a midsegment of the triangle.", vi: "MN là đường trung bình của tam giác." },
    { en: "The midsegment is parallel to the third side.", vi: "Đường trung bình song song với cạnh thứ ba." },
    { en: "It is half as long as the third side.", vi: "Nó dài bằng một nửa cạnh thứ ba." },
    { en: "Join the midpoints of two sides.", vi: "Nối trung điểm của hai cạnh." },
    { en: "Every triangle has three midsegments.", vi: "Mỗi tam giác có ba đường trung bình." },
  ],
  summary: [
    bi("Midsegment: joins the midpoints of two sides.", "Đường trung bình: nối trung điểm hai cạnh."),
    bi("MN ∥ BC and MN = BC : 2", "MN ∥ BC và MN = BC : 2"),
    bi("Line through a midpoint, parallel to a side → through the midpoint of the third side.", "Qua trung điểm một cạnh, song song cạnh thứ hai → đi qua trung điểm cạnh thứ ba."),
  ],
};
