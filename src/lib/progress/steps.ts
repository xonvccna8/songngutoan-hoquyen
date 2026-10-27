// Thông tin hiển thị 5 bước học của mỗi bài
import { BookOpen, ClipboardCheck, Dumbbell, Languages, Mic } from "lucide-react";
import type { StepId } from "@/lib/progress/logic";

export const STEP_INFO: Record<StepId, { label: { en: string; vi: string }; desc: string; icon: typeof BookOpen; bg: string; fg: string }> = {
  "tu-vung": { label: { en: "Words", vi: "Từ vựng" }, desc: "Thẻ từ có phát âm, IPA và câu ví dụ", icon: Languages, bg: "#FFF1D2", fg: "#8A5A00" },
  "hieu-bai": { label: { en: "Learn", vi: "Hiểu bài" }, desc: "Lý thuyết song ngữ, hình kéo thả, ví dụ giải từng bước", icon: BookOpen, bg: "#E7ECFF", fg: "#1E3FB8" },
  "luyen-tap": { label: { en: "Practice", vi: "Luyện tập" }, desc: "3 mức, gợi ý 3 tầng, câu mới không giới hạn", icon: Dumbbell, bg: "#DDF7EE", fg: "#0A7565" },
  noi: { label: { en: "Speak", vi: "Luyện nói" }, desc: "Đọc to câu Toán tiếng Anh, máy chấm phát âm", icon: Mic, bg: "#FFE3DD", fg: "#B23620" },
  "kiem-tra": { label: { en: "Quiz", vi: "Kiểm tra" }, desc: "5 câu — đạt 3/5 là qua, 5/5 được 3 sao", icon: ClipboardCheck, bg: "#EFECFB", fg: "#1C1B3A" },
};
