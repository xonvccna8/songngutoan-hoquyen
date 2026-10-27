// Bài 19. Biểu diễn dữ liệu bằng bảng, biểu đồ — Representing data in tables and charts (Toán 8 KNTT, Chương V)
import { pick } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { ChartSpec, LessonContent, Question } from "@/lib/content/types";

const SPORTS = ["Bóng đá", "Cầu lông", "Bơi", "Bóng rổ", "Cờ vua"];
const FRUITS = ["Cam", "Xoài", "Táo", "Chuối", "Dưa hấu"];

/** Biểu đồ cột một dãy */
const bar = (title: [string, string], cats: string[], values: number[], showValues = true, unit = ""): ChartSpec => ({
  kind: "bar",
  title: bi(title[0], title[1]),
  categories: cats,
  series: [{ name: bi("Students", "Số học sinh"), values }],
  showValues,
  unit,
});

/** Đọc biểu đồ cột: loại nhiều nhất / giá trị một cột */
function genReadBar(r: () => number): Question {
  const cats = shuffle(SPORTS, r).slice(0, 4);
  const values = shuffle([int(r, 3, 6), int(r, 7, 9), int(r, 10, 12), int(r, 13, 16)], r);
  const askMax = r() < 0.5;
  if (askMax) {
    const iMax = values.indexOf(Math.max(...values));
    return {
      id: `g-rbar-max-${cats.join("")}-${values.join("")}`,
      type: "mcq",
      level: 1,
      skill: "math",
      answer: iMax,
      options: cats.map((c) => bi(c, c)),
      prompt: bi("Which sport is the most popular in class 8A?", "Môn thể thao nào được lớp 8A yêu thích nhất?"),
      chart: bar(["Favourite sports of class 8A", "Môn thể thao yêu thích của lớp 8A"], cats, values),
      hints: [bi("bar chart = biểu đồ cột", "Cột cao nhất ứng với số học sinh nhiều nhất."), bi("Compare the heights of the bars.", "So sánh chiều cao các cột."), bi(cats[iMax], cats[iMax])],
      explain: bi(`${cats[iMax]} has the tallest bar (${values[iMax]} students).`, `${cats[iMax]} có cột cao nhất (${values[iMax]} học sinh).`),
    };
  }
  const i = int(r, 0, 3);
  // Đọc trên trục: giá trị là bội của 5 (trùng vạch chia 5) nên đọc chính xác được
  const ticksVals = shuffle([5, 10, 15, 20, 25], r).slice(0, 4);
  return {
    id: `g-rbar-v-${cats.join("")}-${ticksVals.join("")}-${i}`,
    type: "number",
    level: 2,
    skill: "math",
    answer: ticksVals[i],
    prompt: bi(`Read the chart: how many students chose ${cats[i]}?`, `Đọc biểu đồ: có bao nhiêu học sinh chọn ${cats[i]}?`),
    chart: bar(["Favourite sports (students in grade 8)", "Môn thể thao yêu thích (học sinh khối 8)"], cats, ticksVals, false),
    hints: [bi("Read the top of the bar against the vertical axis.", "Gióng đỉnh cột sang trục dọc."), bi("Each grid line is one step on the axis; tap/hover the bar to check.", "Mỗi vạch lưới là một bước chia; chạm vào cột để xem số."), bi(`${ticksVals[i]}`, `${ticksVals[i]}`)],
    explain: bi(`The ${cats[i]} bar reaches ${ticksVals[i]}.`, `Cột ${cats[i]} cao tới ${ticksVals[i]}.`),
  };
}

/** Biểu đồ hình quạt: số học sinh từ tỉ lệ phần trăm */
function genPie(r: () => number): Question {
  const n = pick(r, [20, 40, 60, 80]);
  const step = 100 / n;
  // Các phần trăm là bội của 5 và của step để số học sinh là số nguyên
  const base = Math.max(5, step);
  const a = base * int(r, 2, 4),
    b = base * int(r, 1, 3),
    c = base * int(r, 1, 3);
  const d = 100 - a - b - c;
  if (d <= 0) return genPie(r);
  const cats = shuffle(FRUITS, r).slice(0, 4);
  const pcts = [a, b, c, d];
  const i = int(r, 0, 3);
  return {
    id: `g-pie-${n}-${pcts.join("_")}-${i}`,
    type: "number",
    level: 2,
    skill: "math",
    answer: (n * pcts[i]) / 100,
    prompt: bi(`${n} students were asked about their favourite fruit. How many chose ${cats[i]}?`, `Hỏi ${n} học sinh về loại quả yêu thích. Có bao nhiêu bạn chọn ${cats[i]}?`),
    chart: { kind: "pie", title: bi("Favourite fruit (%)", "Loại quả yêu thích (%)"), categories: cats, series: [{ name: bi("Percent", "Tỉ lệ"), values: pcts }], unit: "%" },
    hints: [bi("pie chart = biểu đồ hình quạt tròn", "Số học sinh = tổng × tỉ lệ phần trăm."), bi(`${n} × ${pcts[i]}%`, `${n} × ${pcts[i]}%`), bi(`= ${(n * pcts[i]) / 100}`, `= ${(n * pcts[i]) / 100}`)],
    explain: bi(`${n} × ${pcts[i]}/100 = ${(n * pcts[i]) / 100} students.`, `${n} × ${pcts[i]} : 100 = ${(n * pcts[i]) / 100} học sinh.`),
  };
}

/** Chọn loại biểu đồ phù hợp */
const PURPOSES: [string, string, number][] = [
  ["the percentage of each part in the whole", "tỉ lệ phần trăm của từng phần trong tổng thể", 1],
  ["how the temperature changes over a week", "sự thay đổi nhiệt độ trong một tuần", 2],
  ["the number of students in each class", "số học sinh của mỗi lớp", 0],
  ["the share of each type of rubbish in a bin", "tỉ lệ từng loại rác trong thùng rác", 1],
  ["the population of a city from 2015 to 2025", "dân số một thành phố từ 2015 đến 2025", 2],
  ["the number of books of each type in the library", "số sách mỗi loại trong thư viện", 0],
];
function genChoose(r: () => number): Question {
  const [en, vi, k] = pick(r, PURPOSES);
  return {
    id: `g-choose-${en}`,
    type: "mcq",
    level: 1,
    skill: "lang",
    answer: k,
    options: [bi("Bar chart", "Biểu đồ cột"), bi("Pie chart", "Biểu đồ hình quạt tròn"), bi("Line graph", "Biểu đồ đoạn thẳng")],
    prompt: bi(`Which chart is best to show ${en}?`, `Biểu đồ nào phù hợp nhất để biểu diễn ${vi}?`),
    hints: [
      bi("Pie: parts of a whole (%). Line: change over time. Bar: compare amounts.", "Hình quạt: các phần của tổng thể (%). Đoạn thẳng: thay đổi theo thời gian. Cột: so sánh số lượng."),
      bi("Is it about time, parts of a whole, or comparing groups?", "Dữ liệu nói về thời gian, các phần của tổng, hay so sánh các nhóm?"),
      bi(["Bar chart", "Pie chart", "Line graph"][k], ["Biểu đồ cột", "Biểu đồ hình quạt tròn", "Biểu đồ đoạn thẳng"][k]),
    ],
    explain: bi(["Bar chart: to compare amounts.", "Pie chart: parts of a whole.", "Line graph: change over time."][k], ["Biểu đồ cột: so sánh số lượng.", "Biểu đồ hình quạt tròn: các phần của tổng thể.", "Biểu đồ đoạn thẳng: thay đổi theo thời gian."][k]),
  };
}

/** Biểu đồ cột kép: tổng hoặc hiệu */
function genDouble(r: () => number): Question {
  const cats = ["8A", "8B", "8C", "8D"];
  const boys = cats.map(() => int(r, 12, 22));
  const girls = cats.map(() => int(r, 12, 22));
  const i = int(r, 0, 3);
  const total = r() < 0.5;
  return {
    id: `g-dbl-${boys.join("")}-${girls.join("")}-${i}-${total}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: total ? boys[i] + girls[i] : Math.abs(boys[i] - girls[i]),
    prompt: total ? bi(`How many students are there in class ${cats[i]}?`, `Lớp ${cats[i]} có tất cả bao nhiêu học sinh?`) : bi(`In class ${cats[i]}, what is the difference between the numbers of boys and girls?`, `Ở lớp ${cats[i]}, số học sinh nam và nữ chênh nhau bao nhiêu?`),
    chart: { kind: "bar", title: bi("Boys and girls in grade 8", "Học sinh nam, nữ khối 8"), categories: cats, series: [{ name: bi("Boys", "Nam"), values: boys }, { name: bi("Girls", "Nữ"), values: girls }] },
    hints: [bi("double bar chart = biểu đồ cột kép", "Mỗi lớp có hai cột: nam (xanh) và nữ (đỏ) — xem chú giải."), bi(`${cats[i]}: boys ${boys[i]}, girls ${girls[i]}`, `${cats[i]}: nam ${boys[i]}, nữ ${girls[i]}`), bi(total ? `${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]}` : `|${boys[i]} − ${girls[i]}| = ${Math.abs(boys[i] - girls[i])}`, total ? `${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]}` : `|${boys[i]} − ${girls[i]}| = ${Math.abs(boys[i] - girls[i])}`)],
    explain: bi(total ? `${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]} students.` : `The difference is ${Math.abs(boys[i] - girls[i])}.`, total ? `${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]} học sinh.` : `Chênh nhau ${Math.abs(boys[i] - girls[i])} học sinh.`),
  };
}

/** Biểu đồ đoạn thẳng: chênh lệch cao nhất – thấp nhất */
function genLine(r: () => number): Question {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const temps = days.map(() => int(r, 22, 34));
  const range = Math.max(...temps) - Math.min(...temps);
  if (range === 0) return genLine(r);
  return {
    id: `g-line-${temps.join("_")}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: "°C",
    answer: range,
    prompt: bi("What is the difference between the highest and the lowest temperature of the week?", "Nhiệt độ cao nhất và thấp nhất trong tuần chênh nhau bao nhiêu độ?"),
    chart: { kind: "line", title: bi("Temperature in Hà Nội (°C)", "Nhiệt độ tại Hà Nội (°C)"), categories: days, series: [{ name: bi("Temperature", "Nhiệt độ"), values: temps }] },
    hints: [bi("line graph = biểu đồ đoạn thẳng", "Tìm điểm cao nhất và điểm thấp nhất."), bi(`Highest ${Math.max(...temps)}°C, lowest ${Math.min(...temps)}°C`, `Cao nhất ${Math.max(...temps)}°C, thấp nhất ${Math.min(...temps)}°C`), bi(`${Math.max(...temps)} − ${Math.min(...temps)} = ${range}`, `${Math.max(...temps)} − ${Math.min(...temps)} = ${range}`)],
    explain: bi(`${Math.max(...temps)} − ${Math.min(...temps)} = ${range}°C.`, `${Math.max(...temps)} − ${Math.min(...temps)} = ${range}°C.`),
  };
}

export const BIEU_DO: LessonContent = {
  id: "k8-19",
  slug: "bieu-do",
  title: bi("Representing data in tables and charts", "Biểu diễn dữ liệu bằng bảng, biểu đồ"),
  intro: bi(
    "A table keeps the numbers; a chart lets you SEE them. Bar charts compare, pie charts show parts of a whole, line graphs show change over time. Choosing the right chart is a real skill!",
    "Bảng lưu giữ các con số; biểu đồ giúp em NHÌN thấy chúng. Biểu đồ cột để so sánh, hình quạt để thấy các phần của tổng thể, đoạn thẳng để thấy sự thay đổi theo thời gian. Chọn đúng biểu đồ là một kĩ năng thật sự!",
  ),
  goals: [bi("Read tables, bar charts, double bar charts, pie charts and line graphs.", "Đọc bảng, biểu đồ cột, cột kép, hình quạt tròn, đoạn thẳng."), bi("Choose a suitable chart.", "Chọn biểu đồ phù hợp."), bi("Change data from one form to another.", "Chuyển dữ liệu từ dạng này sang dạng khác.")],
  terms: [
    { id: "table", en: "table", ipa: "/ˈteɪbl/", vi: "bảng (thống kê)", example: bi("The data is shown in a table.", "Dữ liệu được biểu diễn trong bảng.") },
    { id: "bar-chart", en: "bar chart", ipa: "/bɑː tʃɑːt/", vi: "biểu đồ cột", example: bi("The bar chart compares the classes.", "Biểu đồ cột so sánh các lớp.") },
    { id: "double-bar", en: "double bar chart", ipa: "/ˈdʌbl bɑː tʃɑːt/", vi: "biểu đồ cột kép", example: bi("A double bar chart shows boys and girls.", "Biểu đồ cột kép biểu diễn nam và nữ.") },
    { id: "pie-chart", en: "pie chart", ipa: "/paɪ tʃɑːt/", vi: "biểu đồ hình quạt tròn", example: bi("A pie chart shows percentages.", "Biểu đồ hình quạt tròn biểu diễn tỉ lệ phần trăm.") },
    { id: "line-graph", en: "line graph", ipa: "/laɪn ɡrɑːf/", vi: "biểu đồ đoạn thẳng", example: bi("A line graph shows change over time.", "Biểu đồ đoạn thẳng biểu diễn sự thay đổi theo thời gian.") },
    { id: "axis", en: "axis (axes)", ipa: "/ˈæksɪs/", vi: "trục (các trục)", example: bi("Read the value on the vertical axis.", "Đọc giá trị trên trục dọc.") },
    { id: "legend", en: "key / legend", ipa: "/kiː/ /ˈledʒənd/", vi: "chú giải", example: bi("The key shows which colour is which.", "Chú giải cho biết màu nào ứng với gì.") },
    { id: "percentage", en: "percentage", ipa: "/pəˈsentɪdʒ/", vi: "tỉ lệ phần trăm", example: bi("30% is a percentage.", "30% là một tỉ lệ phần trăm.") },
    { id: "over-time", en: "over time", ipa: "/ˈəʊvə taɪm/", vi: "theo thời gian", example: bi("The temperature changes over time.", "Nhiệt độ thay đổi theo thời gian.") },
  ],
  sections: [
    {
      id: "cac-loai",
      title: bi("Types of charts", "Các loại biểu đồ"),
      blocks: [
        { kind: "chart", chart: bar(["Favourite sports of class 8A", "Môn thể thao yêu thích của lớp 8A"], ["Bóng đá", "Cầu lông", "Bơi", "Cờ vua"], [14, 9, 6, 11]), caption: bi("Bar chart: compare amounts", "Biểu đồ cột: so sánh số lượng") },
        { kind: "chart", chart: { kind: "pie", title: bi("Favourite fruit (%)", "Loại quả yêu thích (%)"), categories: ["Cam", "Xoài", "Táo", "Chuối"], series: [{ name: bi("Percent", "Tỉ lệ"), values: [35, 30, 20, 15] }], unit: "%" }, caption: bi("Pie chart: parts of a whole (total 100%)", "Biểu đồ hình quạt tròn: các phần của tổng thể (tổng 100%)") },
        { kind: "chart", chart: { kind: "line", title: bi("Temperature in Hà Nội (°C)", "Nhiệt độ tại Hà Nội (°C)"), categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"], series: [{ name: bi("Temperature", "Nhiệt độ"), values: [24, 26, 25, 28, 30, 29, 27] }] }, caption: bi("Line graph: change over time", "Biểu đồ đoạn thẳng: thay đổi theo thời gian") },
        { kind: "key", tag: bi("Choose the right chart", "Chọn biểu đồ phù hợp"), tone: "sun", text: bi("Compare groups → bar chart · Parts of a whole → pie chart · Change over time → line graph", "So sánh các nhóm → cột · Các phần của tổng thể → hình quạt tròn · Thay đổi theo thời gian → đoạn thẳng") },
      ],
    },
    {
      id: "doc",
      title: bi("Reading and converting data", "Đọc và chuyển đổi dữ liệu"),
      blocks: [
        {
          kind: "example",
          problem: bi("40 students; pie chart: Cam 35%, Xoài 30%, Táo 20%, Chuối 15%. How many chose Táo?", "40 học sinh; biểu đồ hình quạt: Cam 35%, Xoài 30%, Táo 20%, Chuối 15%. Có bao nhiêu bạn chọn Táo?"),
          steps: [bi("Number = total × percentage", "Số học sinh = tổng × tỉ lệ phần trăm"), bi("40 × 20% = 40 × 20 : 100", "40 × 20% = 40 × 20 : 100"), bi("= 8 students", "= 8 học sinh")],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "number",
            level: 1,
            skill: "math",
            answer: 14,
            prompt: bi("How many students in class 8A chose Bóng đá?", "Có bao nhiêu bạn lớp 8A chọn Bóng đá?"),
            chart: bar(["Favourite sports of class 8A", "Môn thể thao yêu thích của lớp 8A"], ["Bóng đá", "Cầu lông", "Bơi", "Cờ vua"], [14, 9, 6, 11]),
            hints: [bi("Find the Bóng đá bar.", "Tìm cột Bóng đá."), bi("Read the number on top.", "Đọc số trên đỉnh cột."), bi("14", "14")],
            explain: bi("The Bóng đá bar shows 14.", "Cột Bóng đá ghi 14."),
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
      accept: ["pie chart", "a pie chart", "pie graph"],
      prompt: bi("Type the English name of “biểu đồ hình quạt tròn”.", "Gõ tên tiếng Anh của “biểu đồ hình quạt tròn”."),
      hints: [bi("It looks like a cake you share.", "Trông như chiếc bánh (pie) chia phần."), bi("p _ _   c h a r t", "p _ _   c h a r t"), bi("pie chart", "pie chart")],
      explain: bi("pie chart = biểu đồ hình quạt tròn", "pie chart = biểu đồ hình quạt tròn"),
    },
  ],
  generators: [
    { level: 1, make: genReadBar },
    { level: 1, make: genChoose },
    { level: 2, make: genPie },
    { level: 3, make: genDouble },
    { level: 3, make: genLine },
  ],
  speak: [
    { en: "The bar chart compares the classes.", vi: "Biểu đồ cột so sánh các lớp." },
    { en: "A pie chart shows parts of a whole.", vi: "Biểu đồ hình quạt tròn biểu diễn các phần của tổng thể." },
    { en: "A line graph shows change over time.", vi: "Biểu đồ đoạn thẳng biểu diễn sự thay đổi theo thời gian." },
    { en: "Read the value on the vertical axis.", vi: "Đọc giá trị trên trục dọc." },
    { en: "The key shows what each colour means.", vi: "Chú giải cho biết mỗi màu có nghĩa gì." },
  ],
  summary: [
    bi("Bar chart: compare amounts. Double bar chart: compare two groups.", "Biểu đồ cột: so sánh số lượng. Cột kép: so sánh hai nhóm."),
    bi("Pie chart: parts of a whole; percentages add up to 100%.", "Hình quạt tròn: các phần của tổng thể; tổng tỉ lệ = 100%."),
    bi("Line graph: change over time.", "Đoạn thẳng: thay đổi theo thời gian."),
    bi("Number = total × percentage.", "Số lượng = tổng × tỉ lệ phần trăm."),
  ],
};
