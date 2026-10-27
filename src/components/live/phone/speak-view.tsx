"use client";

// Luyện phát âm: nghe mẫu / nghe chậm, bấm micro đọc to, máy chấm từng từ (không lưu ghi âm)
import { useRef, useState } from "react";
import { Mic, Play, Snail } from "lucide-react";
import { cn } from "cn";
import { say, SPEECH_ERRORS, WebSpeechScorer } from "@/lib/live/speech";
import type { SpeechResult } from "@/lib/live/grading";
import type { Phase, ResponseDoc } from "@/lib/live/types";

export function SpeakView({
  target,
  phase,
  mine,
  onScore,
}: {
  target: string;
  phase: Phase;
  mine?: ResponseDoc;
  onScore: (r: SpeechResult) => void;
}) {
  const scorer = useRef<WebSpeechScorer | null>(null);
  const stop = useRef<(() => void) | null>(null);
  const [listening, setListening] = useState(false);
  const [res, setRes] = useState<SpeechResult | null>(null);
  const [msg, setMsg] = useState("");
  const words = target.split(" ");

  const mic = () => {
    if (listening) {
      stop.current?.();
      return;
    }
    scorer.current ??= new WebSpeechScorer();
    setMsg("");
    setListening(true);
    stop.current = scorer.current.start(
      target,
      (r) => {
        setListening(false);
        setRes(r);
        onScore(r);
      },
      (e) => {
        setListening(false);
        setMsg(SPEECH_ERRORS[e]);
      }
    );
  };

  const tip = !res
    ? null
    : res.score >= 85
      ? "Rất tốt! Phát âm rõ ràng."
      : res.score >= 60
        ? `Khá tốt. Luyện thêm: ${words
            .filter((_, i) => !res.ok[i])
            .map((w) => w.replace(/[^\w']/g, ""))
            .slice(0, 3)
            .join(", ")}`
        : "Nghe mẫu chậm rồi thử lại nhé.";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-present text-lg font-semibold">Read aloud</p>
        <p className="text-sm text-[var(--chalk-dim)] italic">Đọc to câu sau</p>
      </div>
      <p className="rounded-2xl bg-white p-4 font-present text-xl leading-relaxed text-ink">
        {words.map((w, i) => (
          <span
            key={i}
            className={cn(
              "rounded px-0.5",
              res && (res.ok[i] ? "text-success-fg" : "text-coral-dk underline decoration-coral decoration-wavy decoration-2 underline-offset-4")
            )}
          >
            {w}{" "}
          </span>
        ))}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => say(target, 0.9)} className="flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-white/20 font-semibold hover:bg-white/10">
          <Play className="size-4 fill-current" /> Nghe mẫu
        </button>
        <button onClick={() => say(target, 0.6)} className="flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-white/20 font-semibold hover:bg-white/10">
          <Snail className="size-4" /> Nghe chậm
        </button>
      </div>

      {phase === "open" ? (
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            onClick={mic}
            aria-label={listening ? "Đang nghe — bấm để dừng" : "Bấm để nói"}
            className={cn(
              "relative grid size-24 place-items-center rounded-full bg-sun text-ink shadow-[0_6px_0_var(--color-sun-dk)] active:translate-y-[4px] active:shadow-none",
              listening && "after:absolute after:-inset-2 after:animate-ping after:rounded-full after:border-4 after:border-sun"
            )}
          >
            <Mic className="size-10" />
          </button>
          <p className="text-sm text-[var(--chalk-dim)]">{listening ? "Đang nghe… hãy đọc to và rõ" : "Bấm micro rồi đọc câu trên"}</p>
        </div>
      ) : (
        <p className="rounded-2xl border border-white/15 p-3 text-sm text-[var(--chalk-dim)]">
          {phase === "idle" ? "Nghe mẫu trước nhé — thầy cô sắp mở lượt luyện nói." : "Lượt luyện nói đã kết thúc."}
        </p>
      )}

      {msg && <p className="rounded-2xl border border-sun/60 bg-sun/10 p-3 text-sm">{msg}</p>}

      {res && (
        <div className="flex items-center gap-3">
          <div className="grid size-16 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--hi) ${res.score}%, rgba(255,255,255,.12) 0)` }}>
            <span className="grid size-12 place-items-center rounded-full bg-ink-tv font-display text-xl font-extrabold">{res.score}</span>
          </div>
          <p className="text-sm text-[var(--chalk-dim)]">
            <b className="text-[var(--chalk)]">{tip}</b>
            <br />
            Máy nghe được: “{res.transcript}”
          </p>
        </div>
      )}
      {mine && (
        <p className="text-center text-xs text-[var(--chalk-dim)]">
          Điểm cao nhất đã gửi lên lớp: <b className="text-[var(--hi)]">{mine.score}</b> · {mine.attempts} lần thử
        </p>
      )}
    </div>
  );
}
