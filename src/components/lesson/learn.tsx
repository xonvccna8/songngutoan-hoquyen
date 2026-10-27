"use client";

// Bước 2 — Hiểu bài: từng phần lý thuyết song ngữ; ví dụ giải từng bước; hình kéo thả; câu hỏi nhanh xen giữa
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "cn";
import { SayButtons } from "@/components/common";
import { GeoFigure } from "@/components/geo/figure";
import { Playground } from "@/components/geo/playground";
import { T } from "@/components/lang";
import { StepDone } from "@/components/lesson/step-done";
import { Progress } from "@/components/lesson/vocab";
import { QuestionCard } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import type { Block, LessonContent } from "@/lib/content/types";
import { completeStep, recordAnswer } from "@/lib/progress/logic";
import { update } from "@/lib/progress/store";

const TONES = {
  blue: "border-blue/40 bg-blue-soft",
  teal: "border-teal/40 bg-teal-soft",
  sun: "border-sun/60 bg-sun-soft",
  coral: "border-coral/40 bg-coral-soft",
};

export function LearnStep({ lesson }: { lesson: LessonContent }) {
  const [i, setI] = useState(0);
  const n = lesson.sections.length;

  if (i >= n) {
    return (
      <StepDone lesson={lesson} step="hieu-bai">
        <ul className="max-w-md space-y-1 text-left text-sm">
          {lesson.summary.map((s, k) => (
            <li key={k} className="flex gap-2">
              <span className="text-teal">✓</span>
              <T v={s} />
            </li>
          ))}
        </ul>
      </StepDone>
    );
  }

  const sec = lesson.sections[i];
  return (
    <div className="space-y-4">
      <Progress label={`Phần ${i + 1}/${n}`} value={i / n} />
      <section className="space-y-4">
        <h2 className="flex flex-wrap items-baseline gap-x-3 text-2xl font-extrabold">
          {sec.title.vi} <span className="text-en text-base font-semibold">{sec.title.en}</span>
        </h2>
        {sec.blocks.map((b, k) => (
          <BlockView key={`${sec.id}-${k}`} block={b} lessonId={lesson.id} />
        ))}
      </section>
      <div className="flex justify-between gap-3 pt-2">
        <Button variant="outline" size="lg" disabled={i === 0} onClick={() => setI(i - 1)}>
          <ArrowLeft /> Phần trước
        </Button>
        <Button
          size="lg"
          onClick={() => {
            if (i === n - 1) update((s, now) => completeStep(s, lesson.id, "hieu-bai", now));
            setI(i + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {i === n - 1 ? "Hoàn thành" : "Phần tiếp"} <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function BlockView({ block: b, lessonId }: { block: Block; lessonId: string }) {
  switch (b.kind) {
    case "text":
      return <T v={b.text} block className="text-[17px] leading-relaxed" />;
    case "key":
      return (
        <div className={cn("rounded-2xl border-2 p-4", TONES[b.tone ?? "blue"])}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold tracking-wide text-ink uppercase">
              {b.tag.vi} · <span className="text-en">{b.tag.en}</span>
            </span>
            <SayButtons text={b.text.en} />
          </div>
          <T v={b.text} block strong className="text-lg leading-snug" />
        </div>
      );
    case "list":
      return (
        <div className="card-lsn p-4">
          {b.tag && (
            <div className="mb-2 font-bold">
              <T v={b.tag} />
            </div>
          )}
          <ul className="space-y-2">
            {b.items.map((it, k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-blue" />
                <T v={it} />
              </li>
            ))}
          </ul>
        </div>
      );
    case "figure":
      return (
        <figure className="card-lsn flex flex-col items-center gap-1 p-3">
          <GeoFigure spec={b.figure} />
          {b.caption && (
            <figcaption className="text-center text-sm">
              <T v={b.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "play":
      return <Playground mode={b.mode} />;
    case "example":
      return <Example block={b} />;
    case "check":
      return (
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8A5A00]">
            <Lightbulb className="size-4" /> Kiểm tra nhanh · Quick check
          </div>
          <QuestionCard q={b.question} compact onAnswer={(correct, hints) => update((s, now) => recordAnswer(s, { lessonId, q: b.question, correct, hints, source: "check" }, now))} />
        </div>
      );
  }
}

/** Ví dụ: hiện lời giải từng bước, em tự nghĩ trước rồi mới bấm */
function Example({ block: b }: { block: Extract<Block, { kind: "example" }> }) {
  const [shown, setShown] = useState(0);
  return (
    <div className="card-lsn overflow-hidden">
      <div className="border-b-2 border-line bg-paper px-4 py-3">
        <div className="mb-1 text-xs font-extrabold tracking-wide text-ink-2 uppercase">Ví dụ · Example</div>
        <T v={b.problem} block strong />
      </div>
      <div className="space-y-3 p-4">
        {b.figure && (
          <div className="flex justify-center">
            <GeoFigure spec={b.figure} className="max-w-sm" />
          </div>
        )}
        <ol className="space-y-2">
          {b.steps.slice(0, shown).map((s, k) => (
            <li key={k} className="flex gap-3 rounded-xl bg-teal-soft/60 p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal font-display text-sm font-extrabold text-white">{k + 1}</span>
              <T v={s} />
            </li>
          ))}
        </ol>
        {shown < b.steps.length ? (
          <Button variant="outline" onClick={() => setShown(shown + 1)}>
            <ChevronDown /> {shown === 0 ? "Em nghĩ xong rồi — xem bước 1" : `Xem bước ${shown + 1}`}
          </Button>
        ) : (
          <p className="text-sm font-bold text-success-fg">Xong lời giải ✓</p>
        )}
      </div>
    </div>
  );
}
