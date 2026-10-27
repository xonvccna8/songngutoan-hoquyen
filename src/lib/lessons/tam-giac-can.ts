// Tiết mẫu "Tam giác cân" (Toán 7 · Bài 16) — chuyển từ reference/lop-song-ngu.html
// Nạp vào Firestore bằng: npm run seed:lesson
import type { Slide, TeacherKey, Term } from "@/lib/live/types";

export const LESSON_ID = "toan7-tam-giac-can";

export const LESSON = {
  title: { en: "Isosceles triangles", vi: "Tam giác cân" },
  subtitle: "Toán 7 · Bài 16 · Tam giác cân",
  subject: "Toán",
  grade: 7,
  status: "approved" as const,
  /** Bài 16 SGK Toán 7 Kết nối tri thức (khung chương trình) */
  curLessonId: "k7-16",
};

export const TERMS: Term[] = [
  { en: "isosceles triangle", ipa: "/aɪˈsɒsəliːz ˈtraɪæŋɡl/", vi: "tam giác cân", at: 0 },
  { en: "leg", ipa: "/leɡ/", vi: "cạnh bên", at: 2 },
  { en: "base", ipa: "/beɪs/", vi: "cạnh đáy", at: 2 },
  { en: "vertex angle", ipa: "/ˈvɜːteks ˈæŋɡl/", vi: "góc ở đỉnh", at: 2 },
  { en: "base angle", ipa: "/beɪs ˈæŋɡl/", vi: "góc ở đáy", at: 2 },
  { en: "equal", ipa: "/ˈiːkwəl/", vi: "bằng nhau", at: 2 },
  { en: "fold", ipa: "/fəʊld/", vi: "gấp", at: 5 },
  { en: "measure", ipa: "/ˈmeʒə/", vi: "đo", at: 5 },
  { en: "angle bisector", ipa: "/ˈæŋɡl baɪˈsektə/", vi: "tia phân giác", at: 6 },
];

/** Câu ví dụ cho thẻ từ vựng (ngân hàng thuật ngữ lsn_terms) */
export const TERM_EXAMPLES: Record<string, { en: string; vi: string }> = {
  "isosceles triangle": { en: "Triangle ABC is an isosceles triangle.", vi: "Tam giác ABC là một tam giác cân." },
  leg: { en: "AB and AC are the legs.", vi: "AB và AC là các cạnh bên." },
  base: { en: "BC is the base.", vi: "BC là cạnh đáy." },
  "vertex angle": { en: "∠A is the vertex angle.", vi: "∠A là góc ở đỉnh." },
  "base angle": { en: "∠B and ∠C are the base angles.", vi: "∠B và ∠C là các góc ở đáy." },
  equal: { en: "The two base angles are equal.", vi: "Hai góc ở đáy bằng nhau." },
  fold: { en: "Fold the paper so that AB lies on AC.", vi: "Gấp tờ giấy sao cho AB nằm trên AC." },
  measure: { en: "Measure ∠B and ∠C.", vi: "Đo ∠B và ∠C." },
  "angle bisector": { en: "AD is the angle bisector of ∠A.", vi: "AD là tia phân giác của ∠A." },
};

/** ID tài liệu thuật ngữ: "angle bisector" → "angle-bisector" */
export const termId = (en: string) => en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Def = Omit<Slide, "order"> & { key: TeacherKey };

const DEFS: Def[] = [
  {
    id: "s0",
    type: "content",
    title: { en: "Today’s lesson", vi: "Bài học hôm nay" },
    blocks: [
      { kind: "hero", step: 0, text: { en: "Isosceles triangles", vi: "Tam giác cân" } },
      { kind: "join", step: 0 },
      {
        kind: "goals",
        step: 1,
        items: [
          { en: "Name the parts of an isosceles triangle.", vi: "Gọi tên các yếu tố của tam giác cân." },
          { en: "Explain why the two base angles are equal.", vi: "Giải thích vì sao hai góc ở đáy bằng nhau." },
          { en: "Say the key sentences in English.", vi: "Nói được các câu then chốt bằng tiếng Anh." },
        ],
      },
    ],
    key: {
      notes: [
        { vi: "Chào lớp, chờ học sinh vào lớp bằng mã trên tivi." },
        { en: "Good morning, class. Please open the class page on your phone." },
        { en: "Today we will learn about isosceles triangles." },
      ],
    },
  },
  {
    id: "s1",
    type: "mcq",
    title: { en: "Warm-up", vi: "Khởi động" },
    blocks: [
      {
        kind: "cols",
        left: [{ kind: "figure", step: 0, figure: "roof" }],
        right: [{ kind: "text", step: 1, text: { en: "Look at the rông house. What shape is the roof?", vi: "Quan sát nhà rông. Mái nhà có dạng hình gì?" } }],
      },
    ],
    question: {
      type: "mcq",
      time: 30,
      skill: "Ngôn ngữ",
      prompt: { en: "What shape is the roof?", vi: "Mái nhà có dạng hình gì?" },
      options: [
        { en: "A square", vi: "Hình vuông" },
        { en: "A triangle with two equal sides", vi: "Tam giác có hai cạnh bằng nhau" },
        { en: "A circle", vi: "Hình tròn" },
        { en: "A rectangle", vi: "Hình chữ nhật" },
      ],
    },
    key: {
      answer: 1,
      explain: {
        en: "The roof is a triangle with two equal sides. We call it an isosceles triangle.",
        vi: "Mái nhà là tam giác có hai cạnh bằng nhau, gọi là tam giác cân.",
      },
      notes: [
        { vi: "Cho học sinh quan sát ảnh nhà rông Tây Nguyên, rồi bấm Tiếp để mở câu hỏi trên điện thoại." },
        { en: "Look at the picture. What shape is the roof?" },
        { en: "A triangle with two equal sides is called an isosceles triangle." },
      ],
    },
  },
  {
    id: "s2",
    type: "content",
    title: { en: "Definition", vi: "Định nghĩa" },
    blocks: [
      {
        kind: "cols",
        left: [{ kind: "figure", step: 0, figure: "tri-def" }],
        right: [
          { kind: "text", step: 1, text: { en: "Triangle ABC is isosceles at A because AB = AC.", vi: "Tam giác ABC cân tại A vì AB = AC." } },
          {
            kind: "box",
            step: 6,
            highlight: true,
            tag: "Definition · Định nghĩa",
            text: { en: "An isosceles triangle is a triangle with two equal sides.", vi: "Tam giác cân là tam giác có hai cạnh bằng nhau." },
          },
        ],
      },
    ],
    key: {
      notes: [
        { vi: "Bấm Tiếp từng bước: hình vẽ hiện dần từng yếu tố. Bấm vào từ ở bảng từ để tivi đọc mẫu." },
        { en: "Triangle ABC has two equal sides, AB and AC." },
        { en: "These are the legs. This is the base." },
        { en: "This is the vertex angle. These are the base angles." },
        { en: "Repeat after me: isosceles triangle." },
      ],
    },
  },
  {
    id: "s3",
    type: "speak",
    title: { en: "Say it!", vi: "Luyện nói" },
    blocks: [
      { kind: "say", step: 0, text: { en: "An isosceles triangle is a triangle with two equal sides.", vi: "Tam giác cân là tam giác có hai cạnh bằng nhau." } },
      { kind: "ipa", step: 0, items: [{ word: "isosceles", ipa: "/aɪˈsɒsəliːz/" }, { word: "equal", ipa: "/ˈiːkwəl/" }] },
      {
        kind: "box",
        step: 1,
        text: {
          en: "On your phone: listen first, then tap the microphone and read the sentence aloud.",
          vi: "Trên điện thoại: nghe mẫu trước, rồi bấm micro và đọc to câu trên.",
        },
      },
    ],
    speak: { target: "An isosceles triangle is a triangle with two equal sides.", time: 75 },
    key: {
      notes: [
        { vi: "Bấm vào câu mẫu để tivi đọc cho cả lớp nghe 2 lần. Bấm Tiếp để mở lượt luyện nói. Máy chấm từng em; giáo viên không cần tự sửa phát âm." },
        { en: "Listen and repeat." },
        { en: "Now use your phone. Read the sentence aloud." },
      ],
    },
  },
  {
    id: "s4",
    type: "mcq",
    title: { en: "Check", vi: "Kiểm tra" },
    blocks: [
      {
        kind: "cols",
        left: [{ kind: "figure", step: 0, figure: "tri-mini" }],
        right: [{ kind: "text", step: 0, text: { en: "Triangle ABC is isosceles at A. Which side is the base?", vi: "Tam giác ABC cân tại A. Cạnh nào là cạnh đáy?" } }],
      },
    ],
    question: {
      type: "mcq",
      time: 25,
      skill: "Ngôn ngữ",
      prompt: { en: "Which side is the base?", vi: "Cạnh nào là cạnh đáy?" },
      options: [
        { en: "AB", vi: "AB" },
        { en: "AC", vi: "AC" },
        { en: "BC", vi: "BC" },
        { en: "There is no base", vi: "Không có cạnh đáy" },
      ],
    },
    key: {
      answer: 2,
      explain: { en: "The base is the side opposite vertex A: BC.", vi: "Cạnh đáy là cạnh đối diện đỉnh A: BC." },
      method: { en: "The two legs meet at vertex A. The base is the side opposite A.", vi: "Hai cạnh bên gặp nhau tại đỉnh A. Cạnh đáy là cạnh đối diện đỉnh A." },
      notes: [{ en: "Which side is the base?" }, { vi: "Nếu nhiều em chọn sai, chỉ lại trên hình: cạnh đáy đối diện đỉnh A." }],
    },
  },
  {
    id: "s5",
    type: "content",
    title: { en: "Fold and measure", vi: "Gấp và đo" },
    phonesDown: true,
    blocks: [
      {
        kind: "cols",
        left: [
          {
            kind: "steps",
            items: [
              { step: 0, text: { en: "Cut out an isosceles triangle ABC with AB = AC.", vi: "Cắt một tam giác cân ABC có AB = AC." } },
              { step: 1, text: { en: "Fold it so that side AB lies on side AC.", vi: "Gấp sao cho cạnh AB nằm trên cạnh AC." } },
              { step: 2, text: { en: "Measure ∠B and ∠C. What do you notice?", vi: "Đo ∠B và ∠C. Em nhận thấy gì?" } },
            ],
          },
        ],
        right: [{ kind: "figure", step: 0, figure: "tri-fold" }],
      },
      { kind: "box", step: 3, highlight: true, text: { en: "We notice that ∠B = ∠C.", vi: "Chúng em nhận thấy ∠B = ∠C." } },
    ],
    key: {
      notes: [
        { vi: "Úp điện thoại xuống. Học sinh làm theo nhóm 4 bạn, 4 phút." },
        { en: "Work in groups of four. Fold the paper so that AB lies on AC." },
        { en: "Measure angle B and angle C. What do you notice?" },
      ],
    },
  },
  {
    id: "s6",
    type: "content",
    title: { en: "Property", vi: "Tính chất" },
    blocks: [
      {
        kind: "box",
        step: 0,
        highlight: true,
        tag: "Theorem · Định lí",
        text: { en: "In an isosceles triangle, the two base angles are equal.", vi: "Trong một tam giác cân, hai góc ở đáy bằng nhau." },
      },
      {
        kind: "text",
        step: 1,
        text: {
          en: "Draw the angle bisector AD (D on BC). △ABD and △ACD have AB = AC, ∠BAD = ∠CAD and a common side AD, so △ABD = △ACD (SAS). Therefore ∠B = ∠C.",
          vi: "Kẻ tia phân giác AD (D thuộc BC). △ABD và △ACD có AB = AC, ∠BAD = ∠CAD, AD chung nên △ABD = △ACD (c.g.c). Suy ra ∠B = ∠C.",
        },
      },
      {
        kind: "box",
        step: 2,
        tag: "Converse · Dấu hiệu nhận biết",
        text: {
          en: "If a triangle has two equal angles, then it is an isosceles triangle.",
          vi: "Nếu một tam giác có hai góc bằng nhau thì tam giác đó là tam giác cân.",
        },
      },
    ],
    key: {
      notes: [
        { vi: "Nếp gấp chính là tia phân giác góc A. Phần chứng minh có thể giảng bằng tiếng Việt, cho học sinh đọc to câu định lí tiếng Anh." },
        { en: "In an isosceles triangle, the two base angles are equal." },
        { en: "If a triangle has two equal angles, then it is an isosceles triangle." },
      ],
    },
  },
  {
    id: "s7",
    type: "speak",
    title: { en: "Say it!", vi: "Luyện nói" },
    blocks: [
      { kind: "say", step: 0, text: { en: "In an isosceles triangle, the two base angles are equal.", vi: "Trong một tam giác cân, hai góc ở đáy bằng nhau." } },
      { kind: "ipa", step: 0, items: [{ word: "angles", ipa: "/ˈæŋɡlz/" }, { word: "equal", ipa: "/ˈiːkwəl/" }] },
    ],
    speak: { target: "In an isosceles triangle, the two base angles are equal.", time: 75 },
    key: {
      notes: [
        { en: "Listen and repeat." },
        { vi: "Sau khi khóa, bảng xếp hạng phát âm hiện trên tivi. Chỉ hiện 5 bạn cao nhất để khích lệ, không hiện ai thấp điểm." },
      ],
    },
  },
  {
    id: "s8",
    type: "number",
    title: { en: "Practice", vi: "Luyện tập" },
    blocks: [
      {
        kind: "cols",
        left: [{ kind: "figure", step: 0, figure: "tri-mini", labels: { top: "40°", left: "?" } }],
        right: [{ kind: "text", step: 0, text: { en: "Triangle ABC is isosceles at A and ∠A = 40°. Find ∠B.", vi: "Tam giác ABC cân tại A và ∠A = 40°. Tính ∠B." } }],
      },
    ],
    question: { type: "number", time: 60, skill: "Toán", unit: "°", prompt: { en: "Find ∠B.", vi: "Tính ∠B." } },
    key: {
      answer: 70,
      show: "∠B = 70°",
      method: {
        en: "The triangle is isosceles at A, so ∠B = ∠C. The three angles add up to 180°.",
        vi: "Tam giác cân tại A nên ∠B = ∠C. Tổng ba góc của tam giác bằng 180°.",
      },
      explain: { en: "∠B = ∠C = (180° − 40°) : 2 = 70°", vi: "∠B = ∠C = (180° − 40°) : 2 = 70°" },
      notes: [{ en: "Find angle B. You have one minute." }, { vi: "Nếu học sinh nhập 140 hoặc 40: các em chưa chia đôi hoặc nhầm góc ở đỉnh với góc ở đáy." }],
    },
  },
  {
    id: "s9",
    type: "text",
    title: { en: "Complete the sentence", vi: "Hoàn thành câu" },
    blocks: [
      {
        kind: "say",
        step: 0,
        text: { en: "If a triangle has two equal angles, then it is ______.", vi: "Nếu một tam giác có hai góc bằng nhau thì tam giác đó là ______." },
      },
    ],
    question: { type: "text", time: 60, skill: "Ngôn ngữ", prompt: { en: "Type the missing words.", vi: "Gõ phần còn thiếu bằng tiếng Anh." } },
    key: {
      accept: ["an isosceles triangle", "isosceles triangle", "isosceles", "an isosceles"],
      show: "an isosceles triangle",
      method: { en: "Use the converse on the “Property” page. Start with “an”.", vi: "Dùng dấu hiệu nhận biết ở trang “Tính chất”. Bắt đầu bằng “an”." },
      explain: {
        en: "If a triangle has two equal angles, then it is an isosceles triangle.",
        vi: "Nếu một tam giác có hai góc bằng nhau thì tam giác đó là tam giác cân.",
      },
      notes: [
        { vi: "Câu trả lời của học sinh hiện trên laptop. Bấm “Chiếu” để đưa câu hay lên tivi; câu không phù hợp sẽ không bao giờ lên tivi." },
        { en: "Type the missing words." },
      ],
    },
  },
  {
    id: "s10",
    type: "mcq",
    title: { en: "True or false?", vi: "Đúng hay sai?" },
    blocks: [
      {
        kind: "say",
        step: 0,
        text: {
          en: "In an isosceles triangle, the vertex angle is always equal to the base angles.",
          vi: "Trong tam giác cân, góc ở đỉnh luôn bằng các góc ở đáy.",
        },
      },
    ],
    question: {
      type: "mcq",
      time: 25,
      skill: "Toán",
      prompt: { en: "True or false?", vi: "Đúng hay sai?" },
      options: [
        { en: "True", vi: "Đúng" },
        { en: "False", vi: "Sai" },
      ],
    },
    key: {
      answer: 1,
      explain: { en: "False. All three angles are equal only in an equilateral triangle.", vi: "Sai. Ba góc chỉ bằng nhau khi tam giác là tam giác đều." },
      method: { en: "Try a counterexample: the triangle in “Practice” has ∠A = 40° and ∠B = 70°.", vi: "Thử một phản ví dụ: tam giác ở trang “Luyện tập” có ∠A = 40° và ∠B = 70°." },
      notes: [{ en: "True or false?" }],
    },
  },
  {
    id: "s11",
    type: "final",
    title: { en: "Great work!", vi: "Tổng kết" },
    blocks: [
      {
        kind: "box",
        step: 0,
        highlight: true,
        tag: "Key sentences · Câu then chốt",
        text: {
          en: "An isosceles triangle is a triangle with two equal sides. Its two base angles are equal.",
          vi: "Tam giác cân là tam giác có hai cạnh bằng nhau. Hai góc ở đáy của nó bằng nhau.",
        },
      },
      {
        kind: "text",
        step: 1,
        text: {
          en: "Homework: find 3 isosceles triangles around you and label their parts in English.",
          vi: "Về nhà: tìm 3 hình tam giác cân xung quanh em và ghi tên các yếu tố bằng tiếng Anh.",
        },
      },
    ],
    key: { notes: [{ vi: "Khen top 5, nhắc bài về nhà. Báo cáo chi tiết của tiết nằm ở bảng bên dưới." }, { en: "Great work today, everyone!" }] },
  },
];

// GĐ 4 — các câu hỏi / luyện nói đo YCCĐ "Mô tả tam giác cân, tính chất tam giác cân" (k7-16-1)
const OUTCOMES: Record<string, string[]> = { s1: ["k7-16-1"], s3: ["k7-16-1"], s4: ["k7-16-1"], s7: ["k7-16-1"], s8: ["k7-16-1"], s9: ["k7-16-1"], s10: ["k7-16-1"] };

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- tách đáp án (key) ra khỏi nội dung trang
export const SLIDES: Slide[] = DEFS.map(({ key, ...s }, i) => ({ ...s, order: i, ...(OUTCOMES[s.id] ? { outcomeIds: OUTCOMES[s.id] } : {}) }));
export const KEYS: Record<string, TeacherKey> = Object.fromEntries(DEFS.map((d) => [d.id, d.key]));
