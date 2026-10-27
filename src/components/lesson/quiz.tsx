"use client";

// Bước 5 — Kiểm tra 5 câu (1 từ vựng + 4 câu Toán ba mức): 3/5 qua bài, 4/5 → 2 sao, 5/5 → 3 sao
import { useState } from "react";
import confetti from "canvas-confetti";
import { RotateCcw } from "lucide-react";
import { Stars } from "@/components/common";
import { StepDone } from "@/components/lesson/step-done";
import { Progress } from "@/components/lesson/vocab";
import { QuestionCard } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { buildQuiz } from "@/lib/content";
import type { LessonContent } from "@/lib/content/types";
import { finishQuiz, QUIZ_SIZE, recordAnswer, starsOf } from "@/lib/progress/logic";
import { update, useProgress } from "@/lib/progress/store";

export function QuizStep({ lesson }: { lesson: LessonContent }) {
  const best = useProgress().lessons[lesson.id]?.quizBest ?? 0;
  const [round, setRound] = useState(0);
  const [qs, setQs] = useState(() => buildQuiz(lesson));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);

  const restart = () => {
    setQs(buildQuiz(lesson));
    setI(0);
    setScore(0);
    setRound((r) => r + 1);
  };

  if (i >= QUIZ_SIZE) {
    const stars = starsOf(score);
    const result = (
      <div className="space-y-2">
        <p className="font-display text-4xl font-extrabold">
          {score}/{QUIZ_SIZE}
        </p>
        <Stars n={stars} className="[&_svg]:size-8" />
        <p className="text-ink-2">Điểm cao nhất của em: {best}/{QUIZ_SIZE}</p>
        <Button variant="outline" onClick={restart}>
          <RotateCcw /> Làm đề khác
        </Button>
      </div>
    );
    return score >= 3 ? (
      <StepDone lesson={lesson} step="kiem-tra">
        {result}
      </StepDone>
    ) : (
      <div className="card-lsn flex flex-col items-center gap-3 p-8 text-center">
        <h2 className="text-2xl font-extrabold">Gần được rồi!</h2>
        <p className="max-w-md text-ink-2">Cần đúng ít nhất 3/5 câu để qua bài. Em xem lại phần Hiểu bài, làm lại các câu trong Sổ lỗi sai rồi thử đề khác nhé.</p>
        {result}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Progress label={`Câu ${i + 1}/${QUIZ_SIZE} · Đúng ${score}`} value={i / QUIZ_SIZE} />
      <QuestionCard
        key={`${round}-${i}`}
        q={qs[i]}
        onAnswer={(ok, hints) => {
          const s2 = score + (ok ? 1 : 0);
          setScore(s2);
          update((s, now) => recordAnswer(s, { lessonId: lesson.id, q: qs[i], correct: ok, hints, source: "quiz" }, now));
          if (i === QUIZ_SIZE - 1) {
            update((s, now) => finishQuiz(s, lesson.id, s2, now));
            if (s2 >= 4) confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
          }
        }}
        onNext={() => setI(i + 1)}
        nextLabel={i === QUIZ_SIZE - 1 ? "Xem kết quả" : "Câu tiếp"}
      />
    </div>
  );
}
