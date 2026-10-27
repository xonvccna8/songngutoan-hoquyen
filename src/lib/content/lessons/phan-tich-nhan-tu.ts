// Bài 9. Phân tích đa thức thành nhân tử — Factorising polynomials (Toán 8 KNTT, Chương II)
import { bin, mono, nz, pick, S } from "@/lib/content/alg";
import { bi, int, shuffle } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Đặt nhân tử chung: g·xᵖ·(ax + b) */
function genCommon(r: () => number): Question {
  const g = int(r, 2, 6);
  const p = int(r, 1, 2);
  let a = nz(r, 1, 5);
  const b = nz(r, -7, 7);
  if (gcd(a, b) !== 1) a = 1;
  const m = mono(g, p);
  const inner = S(`${a}x + ${b}`.replace("+ -", "- "));
  const src = S(`(${m})*(${a}x + ${b})`.replace("+ -", "- "));
  const ans = `${S(m)}(${inner})`;
  return {
    id: `g-com-${g}-${p}-${a}-${b}`,
    type: "expr",
    form: "factored",
    level: 1,
    skill: "math",
    answer: ans,
    prompt: bi(`Factorise: ${src}`, `Phân tích thành nhân tử: ${src}`),
    hints: [
      bi("common factor = nhân tử chung", "Tìm nhân tử chung: ƯCLN của các hệ số và luỹ thừa nhỏ nhất của x."),
      bi(`The common factor is ${S(m)}.`, `Nhân tử chung là ${S(m)}.`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Nhóm hạng tử: (x ± y)(x + a) khai triển rồi đảo thứ tự */
function genGroup(r: () => number): Question {
  const a = nz(r, -6, 6);
  const plusY = r() < 0.5;
  const f1 = plusY ? "x + y" : "x − y";
  const f2 = bin(a);
  const src = S(`(${f1})(${f2})`);
  const ans = `(${f1})(${f2})`;
  return {
    id: `g-grp-${a}-${plusY}`,
    type: "expr",
    form: "factored",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Factorise by grouping: ${src}`, `Phân tích thành nhân tử (nhóm hạng tử): ${src}`),
    hints: [
      bi("grouping = nhóm hạng tử", "Nhóm các hạng tử có nhân tử chung với nhau (thử nhóm hạng tử 1 với 2, 3 với 4)."),
      bi(`Each group then has the common factor (${f1}) or (${f2}).`, `Mỗi nhóm sẽ có nhân tử chung (${f1}) hoặc (${f2}).`),
      bi(`= ${ans}`, `= ${ans}`),
    ],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Dùng hằng đẳng thức */
function genIdentity(r: () => number): Question {
  const kind = int(r, 0, 2);
  const a = int(r, 1, 7);
  const k = pick(r, [1, 2, 3]);
  let src: string, ans: string, how: string;
  if (kind === 0) {
    src = S(`(x - ${a})^2`);
    ans = `(x − ${a})²`;
    how = "A² − 2AB + B² = (A − B)²";
  } else if (kind === 1) {
    src = S(`(x + ${a})^2`);
    ans = `(x + ${a})²`;
    how = "A² + 2AB + B² = (A + B)²";
  } else {
    src = S(`(${k}x)^2 - ${a * a}`);
    ans = `(${bin(a, "x", k)})(${bin(-a, "x", k)})`;
    how = "A² − B² = (A + B)(A − B)";
  }
  return {
    id: `g-idf-${kind}-${a}-${k}`,
    type: "expr",
    form: "factored",
    level: 2,
    skill: "math",
    answer: ans,
    prompt: bi(`Factorise using an identity: ${src}`, `Phân tích thành nhân tử (dùng hằng đẳng thức): ${src}`),
    hints: [bi("Which identity has this shape?", "Đa thức có dạng hằng đẳng thức nào?"), bi(how, how), bi(`= ${ans}`, `= ${ans}`)],
    explain: bi(`${src} = ${ans}`, `${src} = ${ans}`),
  };
}

/** Phối hợp nhiều phương pháp */
function genCombo(r: () => number): Question {
  const kind = int(r, 0, 2);
  const a = int(r, 1, 5);
  let src: string, ans: string, steps: [string, string];
  if (kind === 0) {
    src = S(`x^3 - ${a * a}x`);
    ans = `x(x + ${a})(x − ${a})`;
    steps = [`= x(x² − ${a * a})`, `= x(x + ${a})(x − ${a})`];
  } else if (kind === 1) {
    const g = int(r, 2, 5);
    src = S(`${g}x^2 - ${g * a * a}`);
    ans = `${g}(x + ${a})(x − ${a})`;
    steps = [`= ${g}(x² − ${a * a})`, `= ${g}(x + ${a})(x − ${a})`];
  } else {
    src = S(`x(x + ${a})^2`);
    ans = `x(x + ${a})²`;
    steps = [`= x(x² + ${2 * a}x + ${a * a})`, `= x(x + ${a})²`];
  }
  return {
    id: `g-cmb-${kind}-${a}-${src}`,
    type: "expr",
    form: "factored",
    level: 3,
    skill: "math",
    answer: ans,
    prompt: bi(`Factorise completely: ${src}`, `Phân tích triệt để thành nhân tử: ${src}`),
    hints: [bi("First take out the common factor, then look for an identity.", "Đặt nhân tử chung trước, sau đó xem trong ngoặc có hằng đẳng thức không."), bi(steps[0], steps[0]), bi(steps[1], steps[1])],
    explain: bi(`${src} ${steps[0]} ${steps[1]}`, `${src} ${steps[0]} ${steps[1]}`),
  };
}

/** Tính nhanh nhờ đặt nhân tử chung */
function genMental(r: () => number): Question {
  const a = int(r, 11, 49);
  const b = int(r, 11, 89);
  const c = 100 - b;
  return {
    id: `g-mfac-${a}-${b}`,
    type: "number",
    level: 3,
    skill: "math",
    answer: a * 100,
    prompt: bi(`Calculate quickly: ${a} · ${b} + ${a} · ${c}`, `Tính nhanh: ${a} · ${b} + ${a} · ${c}`),
    hints: [bi("Take out the common factor.", "Đặt nhân tử chung."), bi(`= ${a} · (${b} + ${c})`, `= ${a} · (${b} + ${c})`), bi(`= ${a} · 100 = ${a * 100}`, `= ${a} · 100 = ${a * 100}`)],
    explain: bi(`${a}·(${b} + ${c}) = ${a}·100 = ${a * 100}.`, `${a}·(${b} + ${c}) = ${a}·100 = ${a * 100}.`),
  };
}

/** Chọn phương pháp phù hợp */
function genMethod(r: () => number): Question {
  const cases: [string, number][] = [
    ["6x² − 9x", 0],
    ["x² − 25", 1],
    ["x² + 10x + 25", 1],
    ["x² − xy + 3x − 3y", 2],
    ["4x³ + 8x", 0],
    ["x³ − 8", 1],
  ];
  const [p, ans] = pick(r, cases);
  const methods = ["Common factor", "Using an identity", "Grouping"];
  const methodsVi = ["Đặt nhân tử chung", "Dùng hằng đẳng thức", "Nhóm hạng tử"];
  const order = shuffle([0, 1, 2], r);
  return {
    id: `g-meth-${p}`,
    type: "mcq",
    level: 1,
    skill: "lang",
    answer: order.indexOf(ans),
    options: order.map((i) => bi(methods[i], methodsVi[i])),
    prompt: bi(`Which method should you use first to factorise ${p}?`, `Nên dùng phương pháp nào trước để phân tích ${p}?`),
    hints: [bi("common factor = nhân tử chung; identity = hằng đẳng thức; grouping = nhóm hạng tử", "Xem các hạng tử có chung gì không, hay có dạng hằng đẳng thức, hay có 4 hạng tử?"), bi("Common factor first if every term shares one.", "Nếu mọi hạng tử có nhân tử chung thì đặt nhân tử chung trước."), bi(`${methods[ans]}`, `${methodsVi[ans]}`)],
    explain: bi(`${p}: ${methods[ans]}.`, `${p}: ${methodsVi[ans]}.`),
  };
}

export const PHAN_TICH_NHAN_TU: LessonContent = {
  id: "k8-9",
  slug: "phan-tich-nhan-tu",
  title: bi("Factorising polynomials", "Phân tích đa thức thành nhân tử"),
  intro: bi(
    "Factorising is multiplying backwards: we turn a sum into a product. It is the key skill for solving equations and simplifying fractions later in grade 8.",
    "Phân tích thành nhân tử là “nhân ngược lại”: biến một tổng thành một tích. Đây là kĩ năng chìa khoá để giải phương trình và rút gọn phân thức ở các chương sau.",
  ),
  goals: [
    bi("Take out a common factor.", "Đặt nhân tử chung."),
    bi("Factorise using identities.", "Phân tích bằng hằng đẳng thức."),
    bi("Factorise by grouping, and combine methods.", "Nhóm hạng tử và phối hợp nhiều phương pháp."),
  ],
  terms: [
    { id: "factorise", en: "factorise", ipa: "/ˈfæktəraɪz/", vi: "phân tích thành nhân tử", example: bi("Factorise x² − 9.", "Phân tích x² − 9 thành nhân tử.") },
    { id: "factor", en: "factor", ipa: "/ˈfæktə(r)/", vi: "nhân tử", example: bi("x − 3 is a factor of x² − 9.", "x − 3 là một nhân tử của x² − 9.") },
    { id: "common-factor", en: "common factor", ipa: "/ˈkɒmən ˈfæktə(r)/", vi: "nhân tử chung", example: bi("3x is a common factor of 6x² and 9x.", "3x là nhân tử chung của 6x² và 9x.") },
    { id: "take-out", en: "take out", ipa: "/teɪk aʊt/", vi: "đặt ra ngoài (nhân tử chung)", example: bi("Take out the common factor 3x.", "Đặt nhân tử chung 3x ra ngoài.") },
    { id: "grouping", en: "grouping", ipa: "/ˈɡruːpɪŋ/", vi: "nhóm hạng tử", example: bi("Factorise by grouping.", "Phân tích bằng cách nhóm hạng tử.") },
    { id: "completely", en: "completely", ipa: "/kəmˈpliːtli/", vi: "triệt để, hoàn toàn", example: bi("Factorise x³ − x completely.", "Phân tích triệt để x³ − x.") },
    { id: "method", en: "method", ipa: "/ˈmeθəd/", vi: "phương pháp", example: bi("Choose the best method.", "Chọn phương pháp phù hợp nhất.") },
    { id: "gcd", en: "greatest common divisor", ipa: "/ˈɡreɪtɪst ˈkɒmən dɪˈvaɪzə(r)/", vi: "ước chung lớn nhất", example: bi("The GCD of 6 and 9 is 3.", "ƯCLN của 6 và 9 là 3.") },
    { id: "combine", en: "combine", ipa: "/kəmˈbaɪn/", vi: "phối hợp", example: bi("Combine several methods.", "Phối hợp nhiều phương pháp.") },
  ],
  sections: [
    {
      id: "nhan-tu-chung",
      title: bi("Taking out a common factor", "Đặt nhân tử chung"),
      blocks: [
        { kind: "key", tag: bi("Definition", "Định nghĩa"), text: bi("Factorising a polynomial means writing it as a product of polynomials.", "Phân tích đa thức thành nhân tử là biến đổi đa thức đó thành một tích của những đa thức.") },
        { kind: "key", tag: bi("Method 1", "Cách 1"), tone: "sun", text: bi("AB + AC = A(B + C): take out the common factor A.", "AB + AC = A(B + C): đặt nhân tử chung A ra ngoài.") },
        {
          kind: "example",
          problem: bi("Factorise 6x² − 9x.", "Phân tích 6x² − 9x thành nhân tử."),
          steps: [bi("GCD(6, 9) = 3; lowest power of x: x → common factor 3x", "ƯCLN(6, 9) = 3; luỹ thừa nhỏ nhất của x là x → nhân tử chung 3x"), bi("6x² − 9x = 3x·2x − 3x·3", "6x² − 9x = 3x·2x − 3x·3"), bi("= 3x(2x − 3)", "= 3x(2x − 3)")],
        },
        { kind: "key", tag: bi("Watch out!", "Chú ý!"), tone: "coral", text: bi("Sometimes we must change signs to see the common factor: A = −(−A). E.g. x(y − 1) + 2(1 − y) = (y − 1)(x − 2).", "Đôi khi phải đổi dấu để thấy nhân tử chung: A = −(−A). Ví dụ: x(y − 1) + 2(1 − y) = (y − 1)(x − 2).") },
        {
          kind: "check",
          question: {
            id: "c1",
            type: "expr",
            form: "factored",
            level: 1,
            skill: "math",
            answer: "5x(x − 2)",
            prompt: bi("Factorise: 5x² − 10x", "Phân tích thành nhân tử: 5x² − 10x"),
            hints: [bi("common factor = nhân tử chung", "ƯCLN(5, 10) = 5; có chung x."), bi("Common factor 5x", "Nhân tử chung 5x"), bi("5x(x − 2)", "5x(x − 2)")],
            explain: bi("5x² − 10x = 5x(x − 2).", "5x² − 10x = 5x(x − 2)."),
          },
        },
      ],
    },
    {
      id: "hang-dang-thuc",
      title: bi("Using identities", "Dùng hằng đẳng thức"),
      blocks: [
        { kind: "key", tag: bi("Method 2", "Cách 2"), tone: "sun", text: bi("If the polynomial has the shape of an identity, write it as a product.", "Nếu đa thức có dạng một hằng đẳng thức thì viết nó thành tích.") },
        { kind: "list", tag: bi("Most used", "Hay dùng nhất"), items: [bi("A² − B² = (A + B)(A − B)", "A² − B² = (A + B)(A − B)"), bi("A² ± 2AB + B² = (A ± B)²", "A² ± 2AB + B² = (A ± B)²"), bi("A³ ± B³ = (A ± B)(A² ∓ AB + B²)", "A³ ± B³ = (A ± B)(A² ∓ AB + B²)")] },
        {
          kind: "check",
          question: {
            id: "c2",
            type: "expr",
            form: "factored",
            level: 2,
            skill: "math",
            answer: "(x − 6)²",
            prompt: bi("Factorise: x² − 12x + 36", "Phân tích thành nhân tử: x² − 12x + 36"),
            hints: [bi("36 = 6², 12x = 2·x·6", "36 = 6², 12x = 2·x·6"), bi("A² − 2AB + B²", "A² − 2AB + B²"), bi("(x − 6)²", "(x − 6)²")],
            explain: bi("x² − 12x + 36 = (x − 6)².", "x² − 12x + 36 = (x − 6)²."),
          },
        },
      ],
    },
    {
      id: "nhom",
      title: bi("Grouping and combining methods", "Nhóm hạng tử và phối hợp"),
      blocks: [
        { kind: "key", tag: bi("Method 3", "Cách 3"), tone: "sun", text: bi("Group terms so that each group has a common factor; then a new common factor appears.", "Nhóm các hạng tử sao cho mỗi nhóm có nhân tử chung; khi đó xuất hiện nhân tử chung mới.") },
        {
          kind: "example",
          problem: bi("Factorise x² − xy + 3x − 3y.", "Phân tích x² − xy + 3x − 3y thành nhân tử."),
          steps: [bi("= (x² − xy) + (3x − 3y)", "= (x² − xy) + (3x − 3y)"), bi("= x(x − y) + 3(x − y)", "= x(x − y) + 3(x − y)"), bi("= (x − y)(x + 3)", "= (x − y)(x + 3)")],
        },
        {
          kind: "example",
          problem: bi("Factorise completely x³ − 4x.", "Phân tích triệt để x³ − 4x."),
          steps: [bi("Common factor: x³ − 4x = x(x² − 4)", "Đặt nhân tử chung: x³ − 4x = x(x² − 4)"), bi("Identity: x² − 4 = (x + 2)(x − 2)", "Hằng đẳng thức: x² − 4 = (x + 2)(x − 2)"), bi("= x(x + 2)(x − 2)", "= x(x + 2)(x − 2)")],
        },
        { kind: "key", tag: bi("Tip", "Mẹo"), tone: "teal", text: bi("Order: 1) common factor, 2) identity, 3) grouping. Check every bracket: can it still be factorised?", "Thứ tự nên thử: 1) nhân tử chung, 2) hằng đẳng thức, 3) nhóm hạng tử. Kiểm tra từng ngoặc: còn phân tích tiếp được không?") },
      ],
    },
  ],
  practice: [
    {
      id: "p1",
      type: "term",
      level: 1,
      skill: "lang",
      accept: ["factorise", "factorize", "factor"],
      prompt: bi("Type the English verb for “phân tích thành nhân tử”.", "Gõ động từ tiếng Anh của “phân tích thành nhân tử”."),
      hints: [bi("It comes from “factor”.", "Từ gốc là “factor” (nhân tử)."), bi("factor + ise", "factor + ise"), bi("factorise (US: factorize)", "factorise (Mỹ: factorize)")],
      explain: bi("factorise /ˈfæktəraɪz/ (US: factorize) = phân tích thành nhân tử", "factorise (Mỹ: factorize) = phân tích thành nhân tử"),
    },
    {
      id: "p2",
      type: "expr",
      form: "factored",
      level: 3,
      skill: "math",
      answer: "(y − 1)(x − 2)",
      prompt: bi("Factorise: x(y − 1) + 2(1 − y)", "Phân tích thành nhân tử: x(y − 1) + 2(1 − y)"),
      hints: [bi("change the sign = đổi dấu", "1 − y = −(y − 1)."), bi("= x(y − 1) − 2(y − 1)", "= x(y − 1) − 2(y − 1)"), bi("(y − 1)(x − 2)", "(y − 1)(x − 2)")],
      explain: bi("x(y − 1) − 2(y − 1) = (y − 1)(x − 2).", "x(y − 1) − 2(y − 1) = (y − 1)(x − 2)."),
    },
  ],
  generators: [
    { level: 1, make: genCommon },
    { level: 1, make: genMethod },
    { level: 2, make: genGroup },
    { level: 2, make: genIdentity },
    { level: 3, make: genCombo },
    { level: 3, make: genMental },
  ],
  speak: [
    { en: "Take out the common factor.", vi: "Đặt nhân tử chung ra ngoài." },
    { en: "Factorise the polynomial completely.", vi: "Phân tích triệt để đa thức thành nhân tử." },
    { en: "Group the terms in pairs.", vi: "Nhóm các hạng tử thành từng cặp." },
    { en: "Use an identity to write it as a product.", vi: "Dùng hằng đẳng thức để viết thành tích." },
    { en: "Check whether each bracket can be factorised again.", vi: "Kiểm tra từng ngoặc còn phân tích tiếp được không." },
  ],
  summary: [
    bi("Factorise = write as a product.", "Phân tích thành nhân tử = viết thành một tích."),
    bi("1) Common factor: AB + AC = A(B + C)", "1) Đặt nhân tử chung: AB + AC = A(B + C)"),
    bi("2) Identities: A² − B², (A ± B)², A³ ± B³", "2) Dùng hằng đẳng thức: A² − B², (A ± B)², A³ ± B³"),
    bi("3) Grouping: group terms to create a common factor.", "3) Nhóm hạng tử để xuất hiện nhân tử chung."),
    bi("Factorise completely: check every bracket again.", "Phân tích triệt để: kiểm tra lại từng ngoặc."),
  ],
};
