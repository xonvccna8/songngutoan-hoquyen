"use client";

// Bước 3 — Luyện tập 3 mức: câu soạn sẵn trước, hết thì máy sinh câu mới (không giới hạn).
// Đúng đủ PRACTICE_GOAL câu thì xong bước; vẫn luyện tiếp được.
import { useState } from "react";
import { cn } from "cn";
import { Progress } from "@/components/lesson/vocab";
import { QuestionCard } from "@/components/question-card";
import { nextPractice } from "@/lib/content";
import { bi } from "@/lib/content/helpers";
import type { LessonContent, Question } from "@/lib/content/types";
import { PRACTICE_GOAL, recordAnswer } from "@/lib/progress/logic";
import { update, useProgress } from "@/lib/progress/store";

const LEVELS = [
  { lv: 1 as const, t: bi("Recognise", "Nhận biết") },
  { lv: 2 as const, t: bi("Understand", "Thông hiểu") },
  { lv: 3 as const, t: bi("Apply", "Vận dụng") },
];

export function PracticeStep({ lesson }: { lesson: LessonContent }) {
  const prog = useProgress().lessons[lesson.id];
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [seen] = useState(() => new Set<string>());
  const [q, setQ] = useState<Question>(() => nextPractice(lesson, 1, seen));
  const [n, setN] = useState(0);
  const correct = prog?.practiceCorrect ?? 0;

  const go = (lv: 1 | 2 | 3) => {
    seen.add(q.id);
    setLevel(lv);
    setQ(nextPractice(lesson, lv, seen));
    setN((x) => x + 1);
  };

  return (
    <div className="space-y-4">
      <Progress label={correct >= PRACTICE_GOAL ? `Đã đạt mục tiêu (${correct} câu đúng) — luyện thêm thoải mái!` : `Mục tiêu: ${correct}/${PRACTICE_GOAL} câu đúng`} value={Math.min(1, correct / PRACTICE_GOAL)} />
      <div role="tablist" aria-label="Mức độ" className="grid grid-cols-3 gap-2">
        {LEVELS.map((x) => (
          <button
            key={x.lv}
            role="tab"
            aria-selected={level === x.lv}
            onClick={() => go(x.lv)}
            className={cn("flex h-14 flex-col items-center justify-center rounded-2xl border-2 text-sm font-extrabold transition-colors", level === x.lv ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-2 hover:text-ink")}
          >
            Mức {x.lv}
            <span className={cn("text-[11px] font-semibold", level === x.lv ? "text-white/70" : "text-ink-2")}>
              {x.t.vi} · <span className={level === x.lv ? "" : "text-blue-dk"}>{x.t.en}</span>
            </span>
          </button>
        ))}
      </div>
      <QuestionCard
        key={`${n}-${q.id}`}
        q={q}
        onAnswer={(ok, hints) => update((s, now) => recordAnswer(s, { lessonId: lesson.id, q, correct: ok, hints, source: "practice" }, now))}
        onNext={() => go(level)}
      />
      <p className="text-center text-sm text-ink-2">Câu sai được lưu vào <b>Sổ lỗi sai</b> trong mục Ôn tập để em làm lại sau.</p>
    </div>
  );
}
