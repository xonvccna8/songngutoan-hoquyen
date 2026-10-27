// Bài 18. Thu thập và phân loại dữ liệu — Collecting and classifying data (Toán 8 KNTT, Chương V)
import { pick } from "@/lib/content/alg";
import { bi, int } from "@/lib/content/helpers";
import type { Bi, LessonContent, Question } from "@/lib/content/types";

type Kind = 0 | 1 | 2; // 0 định tính · 1 định lượng rời rạc · 2 định lượng liên tục
const KINDS: Bi[] = [bi("Qualitative", "Định tính"), bi("Quantitative – discrete", "Định lượng – rời rạc"), bi("Quantitative – continuous", "Định lượng – liên tục")];
const EXAMPLES: [Bi, Kind][] = [
  [bi("favourite colour of each student", "màu sắc yêu thích của mỗi học sinh"), 0],
  [bi("favourite subject", "môn học yêu thích"), 0],
  [bi("place of birth", "nơi sinh"), 0],
  [bi("type of transport to school", "phương tiện đến trường"), 0],
  [bi("number of siblings", "số anh chị em ruột"), 1],
  [bi("number of goals in each match", "số bàn thắng trong mỗi trận đấu"), 1],
  [bi("number of books read this month", "số sách đọc trong tháng"), 1],
  [bi("height of each student (cm)", "chiều cao của mỗi học sinh (cm)"), 2],
  [bi("time to run 100 m (seconds)", "thời gian chạy 100 m (giây)"), 2],
  [bi("weight of each student (kg)", "cân nặng của mỗi học sinh (kg)"), 2],
  [bi("daily temperature (°C)", "nhiệt độ mỗi ngày (°C)"), 2],
];

function genKind(r: () => number): Question {
  const [ex, k] = pick(r, EXAMPLES);
  return {
    id: `g-kind-${ex.en}`,
    type: "mcq",
    level: 1,
    skill: "math",
    answer: k,
    options: KINDS,
    prompt: bi(`What type of data is “${ex.en}”?`, `“${ex.vi[0].toUpperCase() + ex.vi.slice(1)}” là loại dữ liệu nào?`),
    hints: [
      bi("qualitative = định tính (words, categories); quantitative = định lượng (numbers)", "Định tính: chữ, phân loại. Định lượng: số."),
      bi("Discrete: counted (0, 1, 2…). Continuous: measured (can be 1,5; 1,55…).", "Rời rạc: đếm được (0, 1, 2…). Liên tục: đo được (có thể 1,5; 1,55…)."),
      bi(KINDS[k].en, KINDS[k].vi),
    ],
    explain: bi(`“${ex.en}” is ${KINDS[k].en.toLowerCase()} data.`, `“${ex.vi}” là dữ liệu ${KINDS[k].vi.toLowerCase()}.`),
  };
}

const METHODS: [Bi, boolean][] = [
  [bi("Interview each classmate", "Phỏng vấn từng bạn trong lớp"), true],
  [bi("Hand out a questionnaire", "Phát phiếu hỏi"), true],
  [bi("Observe and count cars at the school gate", "Quan sát, đếm số xe ở cổng trường"), true],
  [bi("Do an experiment and record the results", "Làm thí nghiệm và ghi kết quả"), true],
  [bi("Look up population figures on a website", "Tra số liệu dân số trên một trang web"), false],
  [bi("Read data in a newspaper", "Đọc số liệu trên báo"), false],
  [bi("Use a table in a textbook", "Dùng bảng số liệu trong sách"), false],
];

function genMethod(r: () => number): Question {
  const [m, direct] = pick(r, METHODS);
  return {
    id: `g-meth-${m.en}`,
    type: "mcq",
    level: 1,
    skill: "lang",
    answer: direct ? 0 : 1,
    options: [bi("Direct collection", "Thu thập trực tiếp"), bi("Indirect collection", "Thu thập gián tiếp")],
    prompt: bi(`“${m.en}” — is this direct or indirect data collection?`, `“${m.vi}” — đây là cách thu thập trực tiếp hay gián tiếp?`),
    hints: [
      bi("direct = trực tiếp (you get the data yourself)", "Trực tiếp: tự mình quan sát, phỏng vấn, phát phiếu, làm thí nghiệm."),
      bi("indirect = gián tiếp (from books, newspapers, the internet)", "Gián tiếp: lấy từ sách, báo, internet…"),
      bi(direct ? "Direct" : "Indirect", direct ? "Trực tiếp" : "Gián tiếp"),
    ],
    explain: bi(direct ? "You collect it yourself: direct." : "It comes from another source: indirect.", direct ? "Em tự thu thập: trực tiếp." : "Lấy từ nguồn có sẵn: gián tiếp."),
  };
}

/** Dữ liệu có hợp lí không: mỗi bạn chọn đúng một môn, tổng phải bằng sĩ số */
function genReasonable(r: () => number): Question {
  const n = pick(r, [30, 35, 36, 40, 42, 45]);
  const a = int(r, 8, 15);
  const b = int(r, 6, 12);
  const ok = r() < 0.5;
  const c = ok ? n - a - b : n - a - b + int(r, 3, 8);
  return {
    id: `g-reas-${n}-${a}-${b}-${c}`,
    type: "tf",
    level: 2,
    skill: "math",
    answer: ok,
    prompt: bi(
      `Class 8A has ${n} students. Each student chose exactly one sport: football ${a}, badminton ${b}, swimming ${c}. True or false: this data is reasonable.`,
      `Lớp 8A có ${n} học sinh. Mỗi bạn chọn đúng một môn thể thao: bóng đá ${a}, cầu lông ${b}, bơi ${c}. Đúng hay sai: dữ liệu này hợp lí.`,
    ),
    hints: [bi("reasonable = hợp lí", "Mỗi bạn chọn đúng một môn → tổng số phải bằng sĩ số."), bi(`${a} + ${b} + ${c} = ${a + b + c}`, `${a} + ${b} + ${c} = ${a + b + c}`), bi(ok ? `= ${n} ✓` : `≠ ${n} ✗`, ok ? `= ${n} ✓` : `≠ ${n} ✗`)],
    explain: bi(`The total is ${a + b + c}, ${ok ? "equal to" : "not equal to"} ${n} students.`, `Tổng là ${a + b + c}, ${ok ? "bằng" : "không bằng"} sĩ số ${n} nên dữ liệu ${ok ? "hợp lí" : "không hợp lí"}.`),
  };
}

/** Đếm tần số trong dãy dữ liệu thô */
function genCount(r: () => number): Question {
  const opts = ["A", "B", "C", "D"];
  const list = Array.from({ length: int(r, 12, 18) }, () => pick(r, opts));
  const target = pick(r, opts);
  const count = list.filter((x) => x === target).length;
  if (count === 0) return genCount(r);
  return {
    id: `g-count-${list.join("")}-${target}`,
    type: "number",
    level: 2,
    skill: "math",
    answer: count,
    prompt: bi(`Survey answers: ${list.join(", ")}. How many students answered ${target}?`, `Kết quả khảo sát: ${list.join(", ")}. Có bao nhiêu bạn trả lời ${target}?`),
    hints: [bi("frequency = tần số (how many times)", "Đếm số lần xuất hiện của " + target + "."), bi("Tick each one as you count.", "Gạch từng kết quả khi đếm để khỏi sót."), bi(`${count}`, `${count}`)],
    explain: bi(`${target} appears ${count} times.`, `${target} xuất hiện ${count} lần.`),
  };
}

/** Tỉ lệ phần trăm từ bảng */
function genPercent(r: () => number): Question {
  const n = pick(r, [20, 25, 40, 50]);
  const unit = 100 / n;
  const a = int(r, 2, n / 2);
  return {
    id: `g-pct-${n}-${a}`,
    type: "number",
    level: 3,
    skill: "math",
    unit: "%",
    answer: a * unit,
    prompt: bi(`In a survey of ${n} students, ${a} said they read books every day. What percentage is that?`, `Khảo sát ${n} học sinh, có ${a} bạn đọc sách mỗi ngày. Số đó chiếm bao nhiêu phần trăm?`),
    hints: [bi("percentage = tỉ lệ phần trăm", "Tỉ lệ phần trăm = phần : tổng × 100%."), bi(`${a} : ${n} × 100%`, `${a} : ${n} × 100%`), bi(`= ${a * unit}%`, `= ${a * unit}%`)],
    explain: bi(`${a}/${n} × 100% = ${a * unit}%.`, `${a} : ${n} × 100% = ${a * unit}%.`),
  };
}

export const THU_THAP_DU_LIEU: LessonContent = {
  id: "k8-18",
  slug: "thu-thap-du-lieu",
  title: bi("Collecting and classifying data", "Thu thập và phân loại dữ liệu"),
  intro: bi(
    "What is the favourite sport in your class? How tall are your classmates? To answer, we collect data — and first we must know what kind of data it is.",
    "Môn thể thao nào được yêu thích nhất lớp em? Các bạn cao bao nhiêu? Để trả lời, ta cần thu thập dữ liệu — và trước hết phải biết đó là loại dữ liệu gì.",
  ),
  goals: [bi("Collect data directly and indirectly.", "Thu thập dữ liệu trực tiếp, gián tiếp."), bi("Classify data: qualitative / quantitative (discrete, continuous).", "Phân loại dữ liệu: định tính / định lượng (rời rạc, liên tục)."), bi("Check whether data is reasonable.", "Kiểm tra tính hợp lí của dữ liệu.")],
  terms: [
    { id: "data", en: "data", ipa: "/ˈdeɪtə/", vi: "dữ liệu", example: bi("We collect data about our class.", "Chúng em thu thập dữ liệu về lớp mình.") },
    { id: "survey", en: "survey", ipa: "/ˈsɜːveɪ/", vi: "cuộc khảo sát", example: bi("We did a survey of 40 students.", "Chúng em khảo sát 40 học sinh.") },
    { id: "questionnaire", en: "questionnaire", ipa: "/ˌkwestʃəˈneə(r)/", vi: "phiếu hỏi", example: bi("Fill in the questionnaire.", "Điền vào phiếu hỏi.") },
    { id: "interview", en: "interview", ipa: "/ˈɪntəvjuː/", vi: "phỏng vấn", example: bi("Interview five classmates.", "Phỏng vấn năm bạn cùng lớp.") },
    { id: "qualitative", en: "qualitative data", ipa: "/ˈkwɒlɪtətɪv ˈdeɪtə/", vi: "dữ liệu định tính", example: bi("Favourite colour is qualitative data.", "Màu yêu thích là dữ liệu định tính.") },
    { id: "quantitative", en: "quantitative data", ipa: "/ˈkwɒntɪtətɪv ˈdeɪtə/", vi: "dữ liệu định lượng", example: bi("Height is quantitative data.", "Chiều cao là dữ liệu định lượng.") },
    { id: "discrete", en: "discrete", ipa: "/dɪˈskriːt/", vi: "rời rạc", example: bi("The number of siblings is discrete.", "Số anh chị em là số liệu rời rạc.") },
    { id: "continuous", en: "continuous", ipa: "/kənˈtɪnjuəs/", vi: "liên tục", example: bi("Weight is continuous.", "Cân nặng là số liệu liên tục.") },
    { id: "reasonable", en: "reasonable", ipa: "/ˈriːznəbl/", vi: "hợp lí", example: bi("Is this data reasonable?", "Dữ liệu này có hợp lí không?") },
    { id: "frequency", en: "frequency", ipa: "/ˈfriːkwənsi/", vi: "tần số", example: bi("The frequency of A is 5.", "Tần số của A là 5.") },
  ],
  sections: [
    {
      id: "thu-thap",
      title: bi("Collecting data", "Thu thập dữ liệu"),
      blocks: [
        {
          kind: "list",
          tag: bi("Two ways to collect data", "Hai cách thu thập dữ liệu"),
          items: [
            bi("Direct: observe, interview, hand out questionnaires, do experiments.", "Trực tiếp: quan sát, phỏng vấn, phát phiếu hỏi, làm thí nghiệm."),
            bi("Indirect: from books, newspapers, the internet, other people's surveys.", "Gián tiếp: từ sách, báo, internet, kết quả khảo sát có sẵn."),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "mcq",
            level: 1,
            skill: "lang",
            answer: 1,
            prompt: bi("Looking up the population of Vietnam on a website is…", "Tra dân số Việt Nam trên một trang web là cách thu thập…"),
            options: [bi("Direct collection", "Thu thập trực tiếp"), bi("Indirect collection", "Thu thập gián tiếp")],
            hints: [bi("Who collected the data first?", "Ai là người thu thập số liệu đầu tiên?"), bi("Someone else did; you only look it up.", "Người khác; em chỉ tra lại."), bi("Indirect", "Gián tiếp")],
            explain: bi("The data comes from an existing source: indirect.", "Số liệu lấy từ nguồn có sẵn: gián tiếp."),
          },
        },
      ],
    },
    {
      id: "phan-loai",
      title: bi("Classifying data", "Phân loại dữ liệu"),
      blocks: [
        {
          kind: "list",
          tag: bi("Types of data", "Các loại dữ liệu"),
          items: [
            bi("Qualitative (not numbers): colour, subject, place of birth…", "Định tính (không phải số): màu sắc, môn học, nơi sinh…"),
            bi("Quantitative – discrete (counted): number of siblings, goals…", "Định lượng – rời rạc (đếm được): số anh chị em, số bàn thắng…"),
            bi("Quantitative – continuous (measured): height, weight, time…", "Định lượng – liên tục (đo được): chiều cao, cân nặng, thời gian…"),
          ],
        },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "mcq",
            level: 1,
            skill: "math",
            answer: 2,
            prompt: bi("“Time to run 100 m” is…", "“Thời gian chạy 100 m” là dữ liệu…"),
            options: KINDS,
            hints: [bi("Is it a number?", "Có phải là số không?"), bi("Is it counted or measured?", "Đếm được hay đo được?"), bi("Measured → continuous", "Đo được → liên tục")],
            explain: bi("Time is measured: quantitative, continuous.", "Thời gian đo được: định lượng, liên tục."),
          },
        },
      ],
    },
    {
      id: "hop-li",
      title: bi("Is the data reasonable?", "Tính hợp lí của dữ liệu"),
      blocks: [
        { kind: "key", tag: bi("Check", "Kiểm tra"), tone: "coral", text: bi("Data must make sense: totals, percentages (sum 100%), units and ranges (a student cannot be 3 m tall!).", "Dữ liệu phải hợp lí: tổng số, tỉ lệ phần trăm (tổng 100%), đơn vị, phạm vi (học sinh không thể cao 3 m!).") },
        {
          kind: "example",
          problem: bi("Class 8B has 40 students. Survey: like maths 25, do not like maths 18. Reasonable?", "Lớp 8B có 40 học sinh. Khảo sát: thích Toán 25 bạn, không thích Toán 18 bạn. Có hợp lí không?"),
          steps: [bi("Each student gives one answer, so the total should be 40.", "Mỗi bạn trả lời một lần nên tổng phải là 40."), bi("25 + 18 = 43 ≠ 40 → not reasonable.", "25 + 18 = 43 ≠ 40 → không hợp lí.")],
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
      accept: ["survey", "a survey"],
      prompt: bi("Type the English word for “cuộc khảo sát”.", "Gõ từ tiếng Anh của “cuộc khảo sát”."),
      hints: [bi("It starts with “sur-”.", "Bắt đầu bằng “sur-”."), bi("sur-vey", "sur-vey"), bi("survey", "survey")],
      explain: bi("survey /ˈsɜːveɪ/ = cuộc khảo sát", "survey /ˈsɜːveɪ/ = cuộc khảo sát"),
    },
  ],
  generators: [
    { level: 1, make: genKind },
    { level: 1, make: genMethod },
    { level: 2, make: genReasonable },
    { level: 2, make: genCount },
    { level: 3, make: genPercent },
  ],
  speak: [
    { en: "We collected data with a questionnaire.", vi: "Chúng em thu thập dữ liệu bằng phiếu hỏi." },
    { en: "Favourite colour is qualitative data.", vi: "Màu yêu thích là dữ liệu định tính." },
    { en: "Height is continuous data.", vi: "Chiều cao là số liệu liên tục." },
    { en: "The number of siblings is discrete data.", vi: "Số anh chị em là số liệu rời rạc." },
    { en: "This data is not reasonable.", vi: "Dữ liệu này không hợp lí." },
  ],
  summary: [
    bi("Direct: observe, interview, questionnaire, experiment. Indirect: books, internet…", "Trực tiếp: quan sát, phỏng vấn, phiếu hỏi, thí nghiệm. Gián tiếp: sách, internet…"),
    bi("Qualitative (words) · Quantitative: discrete (counted) / continuous (measured).", "Định tính (chữ) · Định lượng: rời rạc (đếm) / liên tục (đo)."),
    bi("Check totals, percentages (100%), units and ranges.", "Kiểm tra tổng, tỉ lệ phần trăm (100%), đơn vị, phạm vi."),
  ],
};

