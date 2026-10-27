"use client";

// Bước 1 — Từ vựng: lật lần lượt các thẻ từ của bài, rồi chơi nhanh 4 câu "chọn thuật ngữ đúng"
import { useState } from "react";
import { Flashcard } from "@/components/flashcard";
import { StepDone } from "@/components/lesson/step-done";
import { QuestionCard } from "@/components/question-card";
import { termQuestion } from "@/lib/content";
import { shuffle } from "@/lib/content/helpers";
import type { LessonContent } from "@/lib/content/types";
import { completeStep, recordAnswer, reviewCard } from "@/lib/progress/logic";
import { update } from "@/lib/progress/store";

const GAME = 4;

export function VocabStep({ lesson }: { lesson: LessonContent }) {
  const [i, setI] = useState(0);
  const [game] = useState(() => shuffle(lesson.terms).slice(0, GAME).map((t) => termQuestion(lesson, Math.random, t)));
  const [g, setG] = useState(0);
  const [right, setRight] = useState(0);
  const n = lesson.terms.length;

  if (i < n) {
    const t = lesson.terms[i];
    return (
      <div className="space-y-4">
        <Progress label={`Thẻ ${i + 1}/${n}`} value={i / (n + GAME)} />
        <Flashcard
          key={t.id}
          term={t}
          onGrade={(grade) => {
            update((s, now) => reviewCard(s, t.id, grade, now));
            setI(i + 1);
          }}
        />
      </div>
    );
  }

  if (g < GAME) {
    return (
      <div className="space-y-4">
        <Progress label={`Trò chơi nhanh ${g + 1}/${GAME}: chọn thuật ngữ đúng`} value={(n + g) / (n + GAME)} />
        <QuestionCard
          key={g}
          q={game[g]}
          onAnswer={(ok, hints) => {
            if (ok) setRight((r) => r + 1);
            update((s, now) => recordAnswer(s, { lessonId: lesson.id, q: game[g], correct: ok, hints, source: "vocab" }, now));
            if (g === GAME - 1) update((s, now) => completeStep(s, lesson.id, "tu-vung", now));
          }}
          onNext={() => setG(g + 1)}
          nextLabel={g === GAME - 1 ? "Xem kết quả" : "Câu tiếp"}
        />
      </div>
    );
  }

  return (
    <StepDone lesson={lesson} step="tu-vung">
      <p className="text-ink-2">
        Em đã xem {n} thẻ từ và đúng {right}/{GAME} câu. Các thẻ sẽ được nhắc lại đúng lúc trong mục <b>Ôn tập</b>.
      </p>
    </StepDone>
  );
}

export function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-bold text-ink-2">{label}</div>
      <div className="h-2.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-teal transition-[width] duration-300" style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  );
}
