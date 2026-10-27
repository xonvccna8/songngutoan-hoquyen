// Ngân hàng KHUNG CÂU (sentence frames) theo chức năng ngôn ngữ (CLIL) + cặp tư duy Cambridge TWM.
// Mỗi khung có 3 mức: E1 (cụm ngắn) · E2 (câu đầy đủ) · E3 (câu học thuật). "___" = chỗ trống HS điền.
import type { Bi } from "@/lib/live/types";

export type FrameFn = "describe" | "compare" | "classify" | "explain" | "justify" | "conjecture" | "generalise" | "critique" | "sequence" | "ask";

export const FRAME_FNS: Record<FrameFn, Bi & { twm?: string; hint: string }> = {
  describe: { vi: "Mô tả", en: "Describing", hint: "Nói hình, số, đồ thị, biểu đồ là gì, có gì" },
  compare: { vi: "So sánh", en: "Comparing", hint: "Lớn hơn, bằng nhau, giống và khác" },
  classify: { vi: "Phân loại", en: "Classifying", twm: "Characterising & Classifying", hint: "Xếp nhóm, nhận dạng, phản ví dụ" },
  explain: { vi: "Giải thích", en: "Explaining", hint: "Vì sao, làm thế nào, nghĩa là gì" },
  justify: { vi: "Lập luận, chứng minh", en: "Justifying & proving", twm: "Conjecturing & Convincing", hint: "Giả thiết, kết luận, căn cứ" },
  conjecture: { vi: "Dự đoán, ước lượng", en: "Predicting & estimating", twm: "Conjecturing & Convincing", hint: "Đoán, thử, khả năng xảy ra" },
  generalise: { vi: "Khái quát hoá", en: "Generalising", twm: "Specialising & Generalising", hint: "Quy luật, công thức, trường hợp đặc biệt" },
  critique: { vi: "Nhận xét, phản biện", en: "Critiquing & improving", twm: "Critiquing & Improving", hint: "Đồng ý, không đồng ý, tìm lỗi, cách khác" },
  sequence: { vi: "Trình bày lời giải", en: "Presenting a solution", hint: "Bước 1, phương trình, đáp số" },
  ask: { vi: "Hỏi, xin hỗ trợ", en: "Asking for help", hint: "Hỏi thầy cô và bạn bằng tiếng Anh" },
};

export interface Frame {
  id: string;
  fn: FrameFn;
  e1: Bi;
  e2: Bi;
  e3: Bi;
}

type Row = [e1en: string, e1vi: string, e2en: string, e2vi: string, e3en: string, e3vi: string];

const RAW: Record<FrameFn, Row[]> = {
  describe: [
    ["It is a ___.", "Đây là ___.", "This shape is a ___ because it has ___.", "Hình này là ___ vì nó có ___.", "This figure is a ___: it has ___ sides, and ___ of them are equal.", "Hình này là ___: nó có ___ cạnh, trong đó ___ cạnh bằng nhau."],
    ["___ has ___ sides.", "___ có ___ cạnh.", "A ___ has ___ sides and ___ angles.", "Một ___ có ___ cạnh và ___ góc.", "Every ___ has ___ sides, ___ angles and ___ diagonals.", "Mọi ___ đều có ___ cạnh, ___ góc và ___ đường chéo."],
    ["The angle is ___ degrees.", "Góc này bằng ___ độ.", "Angle ___ measures ___ degrees.", "Góc ___ có số đo ___ độ.", "The measure of angle ___ is ___ degrees, so it is a(n) ___ angle.", "Góc ___ có số đo ___ độ, nên nó là góc ___."],
    ["x equals ___.", "x bằng ___.", "The value of ___ is ___.", "Giá trị của ___ là ___.", "When x = ___, the value of the expression ___ is ___.", "Khi x = ___, giá trị của biểu thức ___ là ___."],
    ["The graph goes up.", "Đồ thị đi lên.", "The graph of ___ is a straight line through ___.", "Đồ thị của ___ là một đường thẳng đi qua ___.", "The graph of y = ___ is a straight line with slope ___ that cuts the y-axis at ___.", "Đồ thị của y = ___ là đường thẳng có hệ số góc ___, cắt trục tung tại ___."],
    ["The chart shows ___.", "Biểu đồ cho biết ___.", "The ___ chart shows the number of ___.", "Biểu đồ ___ cho biết số ___.", "According to the ___ chart, ___ is the highest, at ___.", "Theo biểu đồ ___, ___ cao nhất, với ___."],
  ],
  compare: [
    ["___ is bigger than ___.", "___ lớn hơn ___.", "___ is greater than ___ because ___.", "___ lớn hơn ___ vì ___.", "Since ___, we can conclude that ___ is greater than ___.", "Vì ___, ta kết luận được ___ lớn hơn ___."],
    ["They are equal.", "Chúng bằng nhau.", "___ and ___ are equal because ___.", "___ và ___ bằng nhau vì ___.", "___ is equal to ___, since both ___.", "___ bằng ___, vì cả hai đều ___."],
    ["Same: ___. Different: ___.", "Giống: ___. Khác: ___.", "___ and ___ are alike because they both ___.", "___ và ___ giống nhau vì cả hai đều ___.", "Both ___ and ___ have ___; however, only ___ has ___.", "Cả ___ và ___ đều có ___; tuy nhiên chỉ ___ có ___."],
    ["___ is different.", "___ khác.", "The difference between ___ and ___ is ___.", "Điểm khác nhau giữa ___ và ___ là ___.", "Unlike a ___, a ___ has ___.", "Khác với ___, một ___ có ___."],
    ["___ is the smallest.", "___ nhỏ nhất.", "From smallest to largest: ___, ___, ___.", "Từ nhỏ đến lớn: ___, ___, ___.", "Arranging the values in ascending order gives ___, ___, ___.", "Sắp xếp các giá trị theo thứ tự tăng dần ta được ___, ___, ___."],
    ["___ times more.", "Gấp ___ lần.", "___ is ___ times as large as ___.", "___ gấp ___ lần ___.", "The ratio of ___ to ___ is ___, so ___ is ___ times ___.", "Tỉ số giữa ___ và ___ là ___, nên ___ gấp ___ lần ___."],
  ],
  classify: [
    ["Yes, it is a ___. / No, it isn't.", "Có, nó là ___. / Không phải.", "___ is a ___ because it has ___.", "___ là ___ vì nó có ___.", "___ belongs to the group of ___ because it satisfies ___.", "___ thuộc nhóm ___ vì nó thoả mãn ___."],
    ["Group A: ___. Group B: ___.", "Nhóm A: ___. Nhóm B: ___.", "We can sort them into two groups: ___ and ___.", "Ta có thể chia chúng thành hai nhóm: ___ và ___.", "We classified the ___ by ___: those that ___ and those that ___.", "Chúng em phân loại các ___ theo ___: những cái ___ và những cái ___."],
    ["Every ___ is a ___.", "Mọi ___ đều là ___.", "Every ___ is a ___, but not every ___ is a ___.", "Mọi ___ đều là ___, nhưng không phải ___ nào cũng là ___.", "A ___ is a special kind of ___ in which ___.", "___ là một dạng đặc biệt của ___, trong đó ___."],
    ["It is not a ___.", "Nó không phải ___.", "___ is not a ___ because it does not have ___.", "___ không phải ___ vì nó không có ___.", "Here is a counterexample: ___ has ___, but it is not a ___.", "Đây là phản ví dụ: ___ có ___ nhưng không phải ___."],
    ["The odd one out is ___.", "Cái khác nhóm là ___.", "___ is the odd one out because ___.", "___ khác nhóm vì ___.", "All of them are ___ except ___, which ___.", "Tất cả đều là ___ trừ ___, vì nó ___."],
    ["Type: ___.", "Loại: ___.", "This is ___ data (numbers / categories).", "Đây là dữ liệu ___ (là số / không phải số).", "We collected ___ data, which can be grouped by ___.", "Chúng em thu thập dữ liệu ___, có thể nhóm theo ___."],
  ],
  explain: [
    ["Because ___.", "Vì ___.", "I think ___ because ___.", "Em nghĩ ___ vì ___.", "In my opinion, ___, because ___ and ___.", "Theo em, ___, vì ___ và ___."],
    ["First ___, then ___.", "Đầu tiên ___, sau đó ___.", "First, I ___. Then, I ___.", "Đầu tiên em ___. Sau đó em ___.", "To solve this, I first ___, then ___, and finally ___.", "Để giải bài này, em ___ trước, sau đó ___ và cuối cùng ___."],
    ["I used ___.", "Em dùng ___.", "I used the formula ___ to find ___.", "Em dùng công thức ___ để tìm ___.", "Applying ___ to ___, we get ___.", "Áp dụng ___ cho ___, ta được ___."],
    ["So ___.", "Vậy ___.", "So, the answer is ___.", "Vậy đáp án là ___.", "Therefore, ___ = ___ (unit: ___).", "Do đó ___ = ___ (đơn vị: ___)."],
    ["It means ___.", "Nghĩa là ___.", "___ means ___.", "___ có nghĩa là ___.", "In other words, ___, which shows that ___.", "Nói cách khác, ___, điều đó cho thấy ___."],
    ["Look: ___.", "Nhìn này: ___.", "From the figure, we can see that ___.", "Từ hình vẽ, ta thấy ___.", "As shown in the diagram, ___ and ___, so ___.", "Như hình vẽ cho thấy, ___ và ___, nên ___."],
  ],
  justify: [
    ["Given: ___. Prove: ___.", "Giả thiết: ___. Kết luận: ___.", "We know that ___. We need to prove that ___.", "Ta đã biết ___. Ta cần chứng minh ___.", "Given ___, we will prove that ___ by showing ___.", "Cho ___, ta sẽ chứng minh ___ bằng cách chỉ ra ___."],
    ["___ = ___ (given).", "___ = ___ (giả thiết).", "___ = ___ because ___ (given / theorem).", "___ = ___ vì ___ (giả thiết / định lí).", "Since ___ (by ___), it follows that ___.", "Vì ___ (theo ___), suy ra ___."],
    ["So △___ = △___ (SSS).", "Vậy △___ = △___ (c.c.c).", "Triangles ___ and ___ are congruent (the ___ case).", "Hai tam giác ___ và ___ bằng nhau (trường hợp ___).", "Therefore triangle ___ is congruent to triangle ___ by the ___ case, so ___ = ___.", "Do đó tam giác ___ bằng tam giác ___ theo trường hợp ___, suy ra ___ = ___."],
    ["If ___, then ___.", "Nếu ___ thì ___.", "If ___, then ___, because ___.", "Nếu ___ thì ___, vì ___.", "Suppose that ___. Then ___, which means ___.", "Giả sử ___. Khi đó ___, nghĩa là ___."],
    ["This is true.", "Điều này đúng.", "This is true because ___.", "Điều này đúng vì ___.", "This statement is always true, because for any ___, ___.", "Mệnh đề này luôn đúng, vì với mọi ___, ___."],
    ["Check: ___.", "Thử lại: ___.", "Let's check: when x = ___, ___ = ___. Correct!", "Thử lại: khi x = ___ thì ___ = ___. Đúng!", "Substituting ___ back into the equation gives ___ = ___, so the solution is correct.", "Thay ___ vào phương trình ta được ___ = ___, nên nghiệm đúng."],
  ],
  conjecture: [
    ["Maybe ___.", "Có lẽ ___.", "I predict that ___.", "Em dự đoán rằng ___.", "My conjecture is that ___; let's test it with ___.", "Giả thuyết của em là ___; hãy kiểm tra với ___."],
    ["I guess ___.", "Em đoán ___.", "I think the answer is about ___.", "Em nghĩ đáp án khoảng ___.", "My estimate is about ___, because ___ is close to ___.", "Em ước lượng khoảng ___, vì ___ gần bằng ___."],
    ["What if ___?", "Nếu ___ thì sao?", "What happens if we change ___?", "Điều gì xảy ra nếu ta thay đổi ___?", "If we increase ___, I expect ___ to ___.", "Nếu ta tăng ___, em cho rằng ___ sẽ ___."],
    ["It is likely / unlikely.", "Có khả năng / ít khả năng.", "It is ___ (likely / unlikely / certain) that ___.", "Việc ___ là ___ (có khả năng / ít khả năng / chắc chắn).", "The probability of ___ is ___, so it is ___ to happen.", "Xác suất của ___ là ___, nên ___ xảy ra."],
    ["Test: ___.", "Thử: ___.", "Let's try ___ to see if it works.", "Hãy thử ___ xem có đúng không.", "To test this idea, we can try ___ and compare the results.", "Để kiểm tra ý này, ta có thể thử ___ và so sánh kết quả."],
    ["I am sure / not sure.", "Em chắc chắn / chưa chắc.", "I am (not) sure because ___.", "Em (chưa) chắc chắn vì ___.", "I am convinced that ___, because every example we tried ___.", "Em tin chắc rằng ___, vì mọi ví dụ đã thử đều ___."],
  ],
  generalise: [
    ["Pattern: ___.", "Quy luật: ___.", "I notice that ___ always ___.", "Em nhận thấy ___ luôn ___.", "In every case, ___; so in general, ___.", "Trong mọi trường hợp, ___; vậy tổng quát, ___."],
    ["Next: ___.", "Tiếp theo: ___.", "The next number is ___ because ___.", "Số tiếp theo là ___ vì ___.", "Each term is ___ more than the previous one, so the n-th term is ___.", "Mỗi số hạng hơn số trước ___, nên số hạng thứ n là ___."],
    ["For example, ___.", "Ví dụ, ___.", "For example, when ___ = ___, ___.", "Ví dụ, khi ___ = ___ thì ___.", "Let's take a special case: if ___, then ___.", "Xét một trường hợp đặc biệt: nếu ___ thì ___."],
    ["Rule: ___.", "Quy tắc: ___.", "The rule is: ___.", "Quy tắc là: ___.", "We can write the rule as a formula: ___ = ___.", "Ta có thể viết quy tắc thành công thức: ___ = ___."],
    ["It works for all ___.", "Đúng với mọi ___.", "This works for all ___ because ___.", "Điều này đúng với mọi ___ vì ___.", "This holds for every ___, not only for our examples, because ___.", "Điều này đúng với mọi ___, không chỉ các ví dụ, vì ___."],
    ["In real life: ___.", "Trong thực tế: ___.", "We can use this to ___ in real life.", "Ta có thể dùng điều này để ___ trong thực tế.", "This idea is useful in real life, for example when ___.", "Ý tưởng này hữu ích trong thực tế, ví dụ khi ___."],
  ],
  critique: [
    ["I agree.", "Em đồng ý.", "I agree with ___ because ___.", "Em đồng ý với ___ vì ___.", "I agree with ___'s idea, and I would like to add that ___.", "Em đồng ý với ý của ___, và em muốn bổ sung rằng ___."],
    ["I disagree.", "Em không đồng ý.", "I disagree with ___ because ___.", "Em không đồng ý với ___ vì ___.", "I see your point, but I think ___, because ___.", "Em hiểu ý bạn, nhưng em nghĩ ___, vì ___."],
    ["Mistake: ___.", "Lỗi sai: ___.", "The mistake is ___. It should be ___.", "Lỗi sai là ___. Đúng ra phải là ___.", "There is an error in step ___: ___ should be ___ because ___.", "Có lỗi ở bước ___: ___ phải là ___ vì ___."],
    ["Better: ___.", "Tốt hơn: ___.", "A better way is to ___.", "Một cách tốt hơn là ___.", "We could improve this solution by ___, which is quicker because ___.", "Có thể cải thiện lời giải bằng cách ___, nhanh hơn vì ___."],
    ["Another way: ___.", "Cách khác: ___.", "Another way to solve it is ___.", "Một cách giải khác là ___.", "Alternatively, we can ___ and get the same result.", "Ngoài ra, ta có thể ___ và được cùng kết quả."],
    ["Good job!", "Bạn làm tốt!", "I like ___'s answer because ___.", "Em thích câu trả lời của ___ vì ___.", "___'s method is clear because ___; next time we could also ___.", "Cách làm của ___ rõ ràng vì ___; lần sau có thể ___."],
  ],
  sequence: [
    ["Step 1: ___.", "Bước 1: ___.", "Step 1: Let ___ be ___.", "Bước 1: Gọi ___ là ___.", "Step 1: Let ___ be ___ (condition: ___).", "Bước 1: Gọi ___ là ___ (điều kiện: ___)."],
    ["Equation: ___.", "Phương trình: ___.", "We have the equation ___.", "Ta có phương trình ___.", "From the problem, we can set up the equation ___.", "Từ đề bài, ta lập được phương trình ___."],
    ["x = ___.", "x = ___.", "Solving the equation, we get x = ___.", "Giải phương trình, ta được x = ___.", "Solving it, we find x = ___, which satisfies the condition ___.", "Giải ra x = ___, thoả mãn điều kiện ___."],
    ["Answer: ___.", "Trả lời: ___.", "So the answer is ___.", "Vậy đáp số là ___.", "Hence, ___ is ___ (unit: ___).", "Vậy ___ là ___ (đơn vị: ___)."],
    ["Draw ___.", "Vẽ ___.", "First, draw ___. Then mark ___.", "Đầu tiên vẽ ___. Sau đó đánh dấu ___.", "Draw ___, then construct ___ so that ___.", "Vẽ ___, rồi dựng ___ sao cho ___."],
    ["Next / Finally ___.", "Tiếp theo / Cuối cùng ___.", "Next, ___. Finally, ___.", "Tiếp theo, ___. Cuối cùng, ___.", "After that, we ___; finally, we check that ___.", "Sau đó ta ___; cuối cùng kiểm tra rằng ___."],
  ],
  ask: [
    ["Help, please.", "Giúp em với ạ.", "Can you help me with ___, please?", "Thầy/cô giúp em phần ___ được không ạ?", "I don't understand ___. Could you explain it again, please?", "Em chưa hiểu ___. Thầy/cô giảng lại giúp em được không ạ?"],
    ["Again, please.", "Nhắc lại giúp em ạ.", "Can you say that again, please?", "Thầy/cô nói lại được không ạ?", "Could you say it more slowly, please?", "Thầy/cô nói chậm hơn được không ạ?"],
    ["What is ___?", "___ là gì ạ?", "What does ___ mean?", "___ nghĩa là gì ạ?", "How do you say ___ in English?", "___ tiếng Anh nói thế nào ạ?"],
    ["I'm done.", "Em xong rồi.", "I have finished. What should I do next?", "Em làm xong rồi. Em làm gì tiếp ạ?", "I have finished; can I check my answer with ___?", "Em làm xong rồi; em so đáp án với ___ được không ạ?"],
    ["Is it right?", "Đúng không ạ?", "Is my answer correct?", "Đáp án của em đúng không ạ?", "I got ___. Is that correct, or did I make a mistake?", "Em ra ___. Đúng không ạ, hay em sai ở đâu?"],
    ["Why?", "Tại sao ạ?", "Why is ___ equal to ___?", "Tại sao ___ bằng ___ ạ?", "Why can we use ___ here?", "Tại sao ở đây dùng được ___ ạ?"],
  ],
};

export const FRAMES: Frame[] = (Object.keys(RAW) as FrameFn[]).flatMap((fn) =>
  RAW[fn].map(([a, b, c, d, e, f], i) => ({ id: `${fn}-${i + 1}`, fn, e1: { en: a, vi: b }, e2: { en: c, vi: d }, e3: { en: e, vi: f } }))
);
