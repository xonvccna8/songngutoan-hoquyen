"use client";

// Bước 4 — Luyện nói: nghe mẫu → bấm micro đọc to → máy chấm từng từ (xanh = đúng, đỏ gạch sóng = chưa rõ).
// Không lưu ghi âm: chỉ giữ điểm cao nhất của mỗi câu trên máy.
import { useRef, useState } from "react";
import { Check, Mic, Square } from "lucide-react";
import { cn } from "cn";
import { Ring, SayButtons } from "@/components/common";
import { StepDone } from "@/components/lesson/step-done";
import { Button } from "@/components/ui/button";
import type { LessonContent } from "@/lib/content/types";
import { recordSpeak, SPEAK_GOAL, SPEAK_PASS } from "@/lib/progress/logic";
import { update, useProgress } from "@/lib/progress/store";
import type { SpeechResult } from "@/lib/speech/grading";
import { SPEECH_ERRORS, WebSpeechScorer, type SpeechError } from "@/lib/speech/speech";

export function SpeakStep({ lesson }: { lesson: LessonContent }) {
  const p = useProgress();
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [res, setRes] = useState<SpeechResult | null>(null);
  const [err, setErr] = useState<SpeechError | null>(null);
  const [scorer] = useState(() => new WebSpeechScorer());
  const stop = useRef<(() => void) | null>(null);
  const item = lesson.speak[i];
  const best = (k: number) => p.speak[`${lesson.id}:${k}`] ?? 0;
  const passed = lesson.speak.filter((_, k) => best(k) >= SPEAK_PASS).length;
  const done = !!p.lessons[lesson.id]?.steps.noi;

  const listen = () => {
    setErr(null);
    setRes(null);
    setListening(true);
    stop.current = scorer.start(
      item.en,
      (r) => {
        setListening(false);
        setRes(r);
        update((s, now) => recordSpeak(s, lesson.id, i, r.score, now));
      },
      (e) => {
        setListening(false);
        setErr(e);
      },
    );
  };

  const pick = (k: number) => {
    stop.current?.();
    setListening(false);
    setI(k);
    setRes(null);
    setErr(null);
  };

  const words = item.en.split(" ");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 text-sm font-bold text-ink-2">
        <span>
          Đạt từ {SPEAK_PASS} điểm: {passed}/{SPEAK_GOAL} câu cần có
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {lesson.speak.map((_, k) => (
          <button
            key={k}
            onClick={() => pick(k)}
            className={cn(
              "inline-flex h-10 items-center gap-1 rounded-xl border-2 px-3 font-display text-sm font-extrabold",
              k === i ? "border-ink bg-ink text-white" : best(k) >= SPEAK_PASS ? "border-teal bg-teal-soft text-teal-dk" : "border-line bg-white text-ink-2",
            )}
            aria-label={`Câu ${k + 1}`}
          >
            {best(k) >= SPEAK_PASS && k !== i && <Check className="size-4" />} {k + 1}
          </button>
        ))}
      </div>

      <div className="card-lsn space-y-5 p-5 text-center sm:p-7">
        <p className="font-display text-2xl leading-snug font-extrabold sm:text-3xl" lang="en">
          {res
            ? words.map((w, k) => (
                <span key={k} className={cn("mr-2 inline-block", res.ok[k] ? "text-success-fg" : "text-coral-dk underline decoration-wavy decoration-2 underline-offset-4")}>
                  {w}
                </span>
              ))
            : <span className="text-blue-dk">{item.en}</span>}
        </p>
        <p className="text-vi">{item.vi}</p>
        <div className="flex justify-center">
          <SayButtons text={item.en} />
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={listening ? () => stop.current?.() : listen}
            className={cn(
              "grid size-24 place-items-center rounded-full text-white shadow-[0_6px_0_var(--color-coral-dk)] transition-transform active:translate-y-1",
              listening ? "animate-pulse bg-coral" : "bg-coral hover:bg-[#ef5a40]",
            )}
            aria-label={listening ? "Dừng nghe" : "Bấm rồi đọc to câu tiếng Anh"}
          >
            {listening ? <Square className="size-9 fill-white" /> : <Mic className="size-10" />}
          </button>
          <span className="text-sm font-bold text-ink-2">{listening ? "Đang nghe… em đọc to nhé" : "Bấm micro rồi đọc to"}</span>
        </div>

        {res && (
          <div className="flex flex-col items-center gap-2">
            <Ring value={res.score / 100} size={86} stroke={10} color={res.score >= SPEAK_PASS ? "var(--color-teal)" : "var(--color-coral)"}>
              <span className="font-display text-2xl font-extrabold">{res.score}</span>
            </Ring>
            <p className="font-bold">{res.score >= 90 ? "Tuyệt vời! Excellent!" : res.score >= SPEAK_PASS ? "Tốt lắm! Good job!" : "Nghe mẫu chậm (nút rùa) rồi thử lại nhé."}</p>
            <p className="text-xs text-ink-2">Máy nghe được: “{res.transcript}”</p>
          </div>
        )}
        {err && <p className="rounded-xl bg-coral-soft p-3 text-sm font-semibold text-coral-dk">{SPEECH_ERRORS[err]}</p>}

        {!scorer.supported && (
          <div className="rounded-xl bg-sun-soft p-3 text-sm">
            <p className="font-semibold">{SPEECH_ERRORS.unsupported}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => update((s, now) => recordSpeak(s, lesson.id, i, SPEAK_PASS, now))}>
              Em đã nghe mẫu và đọc to câu này
            </Button>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {i < lesson.speak.length - 1 && (
            <Button variant="outline" onClick={() => pick(i + 1)}>
              Câu tiếp
            </Button>
          )}
        </div>
      </div>

      {done && passed >= SPEAK_GOAL && (
        <StepDone lesson={lesson} step="noi">
          <p className="text-ink-2">Em có {passed} câu đạt từ {SPEAK_PASS} điểm. Luyện thêm để lên 90+ nhé!</p>
        </StepDone>
      )}
    </div>
  );
}
