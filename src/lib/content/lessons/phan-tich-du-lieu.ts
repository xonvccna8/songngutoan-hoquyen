// Bài 20. Phân tích dữ liệu thống kê dựa vào biểu đồ — Analysing statistical data from charts (Toán 8 KNTT, Chương V)
import { pick } from "@/lib/content/alg";
import { bi, int, shuffle, vn } from "@/lib/content/helpers";
import type { ChartSpec, LessonContent, Question } from "@/lib/content/types";

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025"];

const line = (title: [string, string], values: number[], unit = ""): ChartSpec => ({
  kind: "line",
  title: bi(title[0], title[1]),
  categories: YEARS.slice(0, values.length),
  series: [{ name: bi(title[0], title[1]), values }],
  unit,
});

/** Năm tăng nhiều nhất so với năm trước */
function genMaxIncrease(r: () => number): Question {
  const v = [int(r, 20, 40)];
  for (let i = 1; i < 6; i++) v.push(v[i - 1] + int(r, -3, 9));
  const inc = v.slice(1).map((x, i) => x - v[i]);
  const best = Math.max(...inc);
  if (inc.filter((d) => d === best).length > 1 || best <= 0) return genMaxIncrease(r);
  const k = inc.indexOf(best) + 1;
  const opts = shuffle(YEARS.slice(1), r).slice(0, 3);
  if (!opts.includes(YEARS[k])) opts[0] = YEARS[k];
  const order = shuffle(opts, r);
  return {
    id: `g-maxinc-${v.join("_")}`,
    type: "mcq",
    level: 1,
    skill: "math",
    answer: order.indexOf(YEARS[k]),
    options: order.map((y) => bi(y, y)),
    prompt: bi("In which year did the number of books increase the most compared with the year before?", "Năm nào số sách của thư viện tăng nhiều nhất so với năm trước?"),
    chart: line(["Library books (hundreds)", "Số sách thư viện (trăm cuốn)"], v),
    hints: [bi("increase = tăng; compared with = so với", "Tính hiệu giữa mỗi năm và năm trước đó."), bi("The steepest upward segment is the biggest increase.", "Đoạn thẳng đi lên dốc nhất ứng với mức tăng nhiều nhất."), bi(`${YEARS[k]}: +${best}`, `${YEARS[k]}: tăng ${best}`)],
    explain: bi(`From ${YEARS[k - 1]} to ${YEARS[k]} it rose by ${best} — the biggest increase.`, `Từ ${YEARS[k - 1]} đến ${YEARS[k]} tăng ${best} — nhiều nhất.`),
  };
}

/** Phần trăm tăng giữa hai năm */
function genPercentChange(r: () => number): Question {
  const a = pick(r, [20, 25, 40, 50, 80]);
  const p = pick(r, [10, 20, 25, 50]);
  const b = (a * (100 + p)) / 100;
  if (!Number.isInteger(b)) return genPercentChange(r);
  const v = [a - int(r, 1, 4), a, b, b + int(r, -2, 3)];
  return {
    id: `g-pchg-${v.join("_")}`,
    type: "number",
    level: 2,
    skill: "math",
    unit: "%",
    answer: p,
    prompt: bi(`By what percentage did the number of members increase from ${YEARS[1]} to ${YEARS[2]}?`, `Từ năm ${YEARS[1]} đến năm ${YEARS[2]}, số thành viên câu lạc bộ tăng bao nhiêu phần trăm?`),
    chart: line(["Club members", "Số thành viên câu lạc bộ"], v),
    hints: [bi("percentage increase = phần trăm tăng", "Phần trăm tăng = (mới − cũ) : cũ × 100%."), bi(`(${b} − ${a}) : ${a} × 100%`, `(${b} − ${a}) : ${a} × 100%`), bi(`= ${p}%`, `= ${p}%`)],
    explain: bi(`(${b} − ${a})/${a} × 100% = ${p}%.`, `(${b} − ${a}) : ${a} × 100% = ${p}%.`),
  };
}

/** Biểu đồ gây hiểu lầm: trục dọc không bắt đầu từ 0 */
function genMisleading(r: () => number): Question {
  const lo = int(r, 40, 46);
  const hi = lo + int(r, 3, 6);
  const yMin = lo - 2;
  const claim = Math.round((hi - yMin) / (lo - yMin));
  return {
    id: `g-mis-${lo}-${hi}`,
    type: "tf",
    level: 2,
    skill: "math",
    answer: false,
    prompt: bi(`Looking at the chart, Minh says: “Class 8A has about ${claim} times as many books as 8B.” True or false?`, `Nhìn biểu đồ, Minh nói: “Lớp 8A có số sách gấp khoảng ${claim} lần lớp 8B.” Đúng hay sai?`),
    chart: { kind: "bar", title: bi("Books donated", "Số sách quyên góp"), categories: ["8A", "8B"], series: [{ name: bi("Books", "Số sách"), values: [hi, lo] }], yMin },
    hints: [bi("misleading = gây hiểu lầm; axis = trục", "Xem trục dọc bắt đầu từ số mấy."), bi(`The axis starts at ${yMin}, not 0 — the bars look more different than they are.`, `Trục dọc bắt đầu từ ${yMin}, không phải 0 — các cột trông chênh lệch hơn thực tế.`), bi(`${hi} : ${lo} ≈ ${vn(+(hi / lo).toFixed(2))}`, `${hi} : ${lo} ≈ ${vn(+(hi / lo).toFixed(2))}`)],
    explain: bi(`False. ${hi} is only about ${vn(+(hi / lo).toFixed(2))} times ${lo}. The axis does not start at 0.`, `Sai. ${hi} chỉ gấp khoảng ${vn(+(hi / lo).toFixed(2))} lần ${lo}. Trục dọc không bắt đầu từ 0 nên biểu đồ gây hiểu lầm.`),
  };
}

/** Biểu đồ hình quạt sai: tổng khác 100% */
function genPieSum(r: () => number): Question {
  const ok = r() < 0.5;
  const a = int(r, 4, 8) * 5,
    b = int(r, 2, 5) * 5,
    c = int(r, 1, 3) * 5;
  const d = ok ? 100 - a - b - c : 100 - a - b - c + int(r, 1, 3) * 5;
  if (100 - a - b - c <= 0) return genPieSum(r);
  return {
    id: `g-pies-${a}-${b}-${c}-${d}`,
    type: "tf",
    level: 2,
    skill: "math",
    answer: ok,
    prompt: bi("True or false: the numbers on this pie chart are correct.", "Đúng hay sai: các số trên biểu đồ hình quạt này hợp lí."),
    chart: { kind: "pie", title: bi("Ways to go to school (%)", "Phương tiện đến trường (%)"), categories: ["Xe đạp", "Đi bộ", "Xe buýt", "Bố mẹ đưa"], series: [{ name: bi("Percent", "Tỉ lệ"), values: [a, b, c, d] }], unit: "%" },
    hints: [bi("A whole is 100%.", "Toàn bộ tương ứng 100%."), bi(`${a} + ${b} + ${c} + ${d} = ${a + b + c + d}`, `${a} + ${b} + ${c} + ${d} = ${a + b + c + d}`), bi(ok ? "= 100% ✓" : "≠ 100% ✗", ok ? "= 100% ✓" : "≠ 100% ✗")],
    explain: bi(`The parts add up to ${a + b + c + d}%, ${ok ? "so the chart is fine." : "not 100% — the chart is wrong."}`, `Các phần cộng lại được ${a + b + c + d}%, ${ok ? "nên hợp lí." : "khác 100% — biểu đồ sai."}`),
  };
}

/** Trung bình cộng các cột */
function genAverage(r: () => number): Question {
  const n = 4;
  const vals = Array.from({ length: n }, () => int(r, 10, 30));
  const s = vals.reduce((a, b) => a + b, 0);
  if (s % n) vals[0] += n - (s % n);
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  return {
    id: `g-avg-${vals.join("_")}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: mean,
    prompt: bi("What is the average number of trees planted per class?", "Trung bình mỗi lớp trồng được bao nhiêu cây?"),
    chart: { kind: "bar", title: bi("Trees planted by grade-8 classes", "Số cây khối 8 đã trồng"), categories: ["8A", "8B", "8C", "8D"], series: [{ name: bi("Trees", "Số cây"), values: vals }] },
    hints: [bi("average (mean) = trung bình cộng", "Trung bình = tổng : số lớp."), bi(`(${vals.join(" + ")}) : 4`, `(${vals.join(" + ")}) : 4`), bi(`= ${mean}`, `= ${mean}`)],
    explain: bi(`${vals.reduce((a, b) => a + b, 0)} : 4 = ${mean} trees.`, `${vals.reduce((a, b) => a + b, 0)} : 4 = ${mean} cây.`),
  };
}

/** Xu hướng */
function genTrend(r: () => number): Question {
  const kind = int(r, 0, 1);
  const v = [int(r, 30, 50)];
  for (let i = 1; i < 6; i++) v.push(v[i - 1] + (kind === 0 ? int(r, 1, 6) : -int(r, 1, 6)));
  const opts = [bi("It keeps increasing.", "Tăng dần."), bi("It keeps decreasing.", "Giảm dần."), bi("It stays the same.", "Không đổi.")];
  return {
    id: `g-trend-${v.join("_")}`,
    type: "mcq",
    level: 1,
    skill: "lang",
    answer: kind,
    options: opts,
    prompt: bi("Describe the trend of plastic bags used by the school canteen.", "Nhận xét xu hướng số túi ni lông căng tin trường sử dụng qua các năm."),
    chart: line(["Plastic bags (thousands)", "Số túi ni lông (nghìn chiếc)"], v),
    hints: [bi("trend = xu hướng; increase = tăng; decrease = giảm", "Nhìn đường đi lên hay đi xuống từ trái sang phải."), bi("Look from the first year to the last year.", "So sánh từ năm đầu đến năm cuối."), bi(opts[kind].en, opts[kind].vi)],
    explain: bi(`The line goes ${kind === 0 ? "up" : "down"} every year.`, `Đường ${kind === 0 ? "đi lên" : "đi xuống"} qua từng năm: ${opts[kind].vi.toLowerCase()}`),
  };
}

export const PHAN_TICH_DU_LIEU: LessonContent = {
  id: "k8-20",
  slug: "phan-tich-du-lieu",
  title: bi("Analysing statistical data from charts", "Phân tích dữ liệu thống kê dựa vào biểu đồ"),
  intro: bi(
    "Charts tell stories — but sometimes they trick us! Learn to find trends, calculate changes and spot misleading charts like a real data detective.",
    "Biểu đồ kể chuyện — nhưng đôi khi cũng “lừa” chúng ta! Hãy học cách tìm xu hướng, tính mức thay đổi và phát hiện biểu đồ gây hiểu lầm như một thám tử dữ liệu.",
  ),
  goals: [bi("Find trends and extreme values.", "Tìm xu hướng, giá trị lớn nhất, nhỏ nhất."), bi("Calculate changes and averages from charts.", "Tính mức thay đổi, trung bình từ biểu đồ."), bi("Spot wrong or misleading charts.", "Phát hiện biểu đồ sai hoặc gây hiểu lầm.")],
  terms: [
    { id: "trend", en: "trend", ipa: "/trend/", vi: "xu hướng", example: bi("The trend is increasing.", "Xu hướng là tăng dần.") },
    { id: "increase", en: "increase", ipa: "/ɪnˈkriːs/", vi: "tăng", example: bi("Sales increased by 20%.", "Doanh số tăng 20%.") },
    { id: "decrease", en: "decrease", ipa: "/dɪˈkriːs/", vi: "giảm", example: bi("The number of bags decreased.", "Số túi ni lông giảm.") },
    { id: "average", en: "average (mean)", ipa: "/ˈævərɪdʒ/", vi: "trung bình (cộng)", example: bi("The average is 20 trees.", "Trung bình là 20 cây.") },
    { id: "highest-lowest", en: "highest / lowest", ipa: "/ˈhaɪɪst/ /ˈləʊɪst/", vi: "cao nhất / thấp nhất", example: bi("Find the highest temperature.", "Tìm nhiệt độ cao nhất.") },
    { id: "misleading", en: "misleading", ipa: "/ˌmɪsˈliːdɪŋ/", vi: "gây hiểu lầm", example: bi("This chart is misleading.", "Biểu đồ này gây hiểu lầm.") },
    { id: "percent-increase", en: "percentage increase", ipa: "/pəˈsentɪdʒ ˈɪnkriːs/", vi: "phần trăm tăng", example: bi("The percentage increase is 25%.", "Phần trăm tăng là 25%.") },
    { id: "compared-with", en: "compared with", ipa: "/kəmˈpeəd wɪð/", vi: "so với", example: bi("Compared with 2023, it rose.", "So với năm 2023, nó tăng.") },
    { id: "conclusion", en: "conclusion", ipa: "/kənˈkluːʒn/", vi: "kết luận", example: bi("Write a conclusion from the chart.", "Viết kết luận từ biểu đồ.") },
  ],
  sections: [
    {
      id: "xu-huong",
      title: bi("Trends and changes", "Xu hướng và mức thay đổi"),
      blocks: [
        { kind: "chart", chart: line(["Club members", "Số thành viên câu lạc bộ"], [18, 20, 25, 24, 30, 36]), caption: bi("Mostly increasing; a small drop in 2023", "Nhìn chung tăng; giảm nhẹ năm 2023") },
        { kind: "key", tag: bi("Percentage change", "Phần trăm thay đổi"), tone: "sun", text: bi("Percentage change = (new − old) : old × 100%", "Phần trăm thay đổi = (mới − cũ) : cũ × 100%") },
        {
          kind: "example",
          problem: bi("From 2021 to 2022 members went from 20 to 25. By what percentage?", "Từ 2021 đến 2022 số thành viên tăng từ 20 lên 25. Tăng bao nhiêu phần trăm?"),
          steps: [bi("Increase: 25 − 20 = 5", "Mức tăng: 25 − 20 = 5"), bi("5 : 20 × 100% = 25%", "5 : 20 × 100% = 25%")],
        },
      ],
    },
    {
      id: "hieu-lam",
      title: bi("Spot the problem!", "Phát hiện điểm bất hợp lí"),
      blocks: [
        { kind: "chart", chart: { kind: "bar", title: bi("Books donated", "Số sách quyên góp"), categories: ["8A", "8B"], series: [{ name: bi("Books", "Số sách"), values: [48, 44] }], yMin: 42 } },
        { kind: "key", tag: bi("Watch out!", "Cẩn thận!"), tone: "coral", text: bi("The vertical axis starts at 42, not 0: 8A looks 3 times bigger, but 48 is only a little more than 44.", "Trục dọc bắt đầu từ 42 chứ không phải 0: cột 8A trông gấp 3 lần, nhưng thực ra 48 chỉ hơn 44 một chút.") },
        { kind: "list", tag: bi("Checklist", "Kiểm tra nhanh"), items: [bi("Does the axis start at 0?", "Trục dọc có bắt đầu từ 0 không?"), bi("Do pie percentages add up to 100%?", "Các phần trăm hình quạt có cộng lại bằng 100% không?"), bi("Are the units and the title clear?", "Đơn vị và tên biểu đồ có rõ ràng không?")] },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "tf",
            level: 2,
            skill: "math",
            answer: false,
            prompt: bi("True or false: a pie chart with parts 40%, 35%, 30% is correct.", "Đúng hay sai: biểu đồ hình quạt có các phần 40%, 35%, 30% là hợp lí."),
            hints: [bi("A whole = 100%", "Tổng thể = 100%."), bi("40 + 35 + 30 = 105", "40 + 35 + 30 = 105"), bi("105% ≠ 100%", "105% ≠ 100%")],
            explain: bi("False: the parts add up to 105%.", "Sai: các phần cộng lại được 105%."),
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
      accept: ["trend", "a trend"],
      prompt: bi("Type the English word for “xu hướng”.", "Gõ từ tiếng Anh của “xu hướng”."),
      hints: [bi("It starts with “tr-”.", "Bắt đầu bằng “tr-”."), bi("t r _ _ d", "t r _ _ d"), bi("trend", "trend")],
      explain: bi("trend /trend/ = xu hướng", "trend /trend/ = xu hướng"),
    },
  ],
  generators: [
    { level: 1, make: genMaxIncrease },
    { level: 1, make: genTrend },
    { level: 2, make: genPercentChange },
    { level: 2, make: genMisleading },
    { level: 2, make: genPieSum },
    { level: 3, make: genAverage },
  ],
  speak: [
    { en: "The number of members increased by twenty five percent.", vi: "Số thành viên tăng hai mươi lăm phần trăm." },
    { en: "The trend is decreasing.", vi: "Xu hướng là giảm dần." },
    { en: "This chart is misleading.", vi: "Biểu đồ này gây hiểu lầm." },
    { en: "The vertical axis does not start at zero.", vi: "Trục dọc không bắt đầu từ số không." },
    { en: "The percentages should add up to one hundred.", vi: "Các tỉ lệ phần trăm phải cộng lại bằng một trăm." },
  ],
  summary: [
    bi("Trend: increasing / decreasing / no change.", "Xu hướng: tăng / giảm / không đổi."),
    bi("Percentage change = (new − old) : old × 100%", "Phần trăm thay đổi = (mới − cũ) : cũ × 100%"),
    bi("Average = total : number of values.", "Trung bình = tổng : số giá trị."),
    bi("Misleading charts: axis not from 0, pie not 100%, missing units.", "Biểu đồ gây hiểu lầm: trục không từ 0, hình quạt không đủ 100%, thiếu đơn vị."),
  ],
};
