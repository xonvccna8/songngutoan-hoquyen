"use client";

// Thẻ câu hỏi tự chấm: trắc nghiệm / đúng-sai / nhập số / gõ thuật ngữ / gõ biểu thức.
// Gợi ý 3 tầng (Từ vựng → Cách làm → Lời giải); trả lời xong hiện đúng/sai + giải thích song ngữ.
import { useState } from "react";
import { ArrowRight, Check, Lightbulb, X } from "lucide-react";
import { ExprInput } from "@/components/expr-input";
import { cn } from "cn";
import { ShapeIcon, SHAPE_COLORS, type ShapeKind } from "@/components/brand/shapes";
import { Tam } from "@/components/brand/tam";
import { SayButtons } from "@/components/common";
import { GeoFigure } from "@/components/geo/figure";
import { T } from "@/components/lang";
import { Button } from "@/components/ui/button";
import { answerText, bi, checkAnswer, checkExpr } from "@/lib/content/helpers";
import type { Bi, Question } from "@/lib/content/types";

const SHAPES: ShapeKind[] = ["triangle", "diamond", "circle", "square"];
const LEVEL = { 1: bi("Recognise", "Nhận biết"), 2: bi("Understand", "Thông hiểu"), 3: bi("Apply", "Vận dụng") } as const;
const HINT_TAG = [bi("Words", "Từ vựng"), bi("Method", "Cách làm"), bi("Solution", "Lời giải")];

export function QuestionCard({
  q,
  onAnswer,
  onNext,
  nextLabel = "Câu tiếp",
  compact,
}: {
  q: Question;
  /** Gọi ngay khi em trả lời (để ghi tiến độ) */
  onAnswer?: (correct: boolean, hints: number) => void;
  onNext?: () => void;
  nextLabel?: string;
  compact?: boolean;
}) {
  const [hints, setHints] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<null | { correct: boolean; value: string; note?: Bi }>(null);
  const [shake, setShake] = useState(false);

  const submit = (v: string) => {
    if (result || !v.trim()) return;
    // Câu biểu thức: kèm lời nhắc khi đúng giá trị nhưng sai dạng (chưa phá ngoặc, chưa thu gọn…)
    const detail = q.type === "expr" ? checkExpr(q, v) : { ok: checkAnswer(q, v) };
    const correct = detail.ok;
    setResult({ correct, value: v, note: detail.note });
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
    onAnswer?.(correct, hints);
  };

  const done = !!result;

  return (
    <div className={cn("card-lsn overflow-hidden", shake && "animate-shake")}>
      <div className={cn("space-y-4", compact ? "p-4" : "p-5")}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-blue-soft px-2.5 py-1 text-blue-dk">Mức {q.level} · {LEVEL[q.level].vi}</span>
          <span className={cn("rounded-full px-2.5 py-1", q.skill === "math" ? "bg-teal-soft text-teal-dk" : "bg-sun-soft text-[#8A5A00]")}>{q.skill === "math" ? "Toán" : "Ngôn ngữ"}</span>
        </div>

        <div className="flex items-start gap-3">
          <T v={q.prompt} block strong className="flex-1 text-lg leading-snug" />
          <SayButtons text={q.prompt.en} />
        </div>

        {q.figure && (
          <div className="flex justify-center rounded-2xl bg-paper p-2">
            <GeoFigure spec={q.figure} className="max-w-sm" />
          </div>
        )}

        {q.type === "mcq" && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {q.options.map((o, i) => {
              const s = SHAPE_COLORS[SHAPES[i % 4]];
              const picked = result?.value === String(i);
              const right = done && i === q.answer;
              return (
                <button
                  key={i}
                  disabled={done}
                  onClick={() => submit(String(i))}
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-2xl border-2 bg-white px-3 py-2 text-left transition-all",
                    !done && "border-line hover:-translate-y-0.5 hover:border-line-2 hover:shadow-[0_4px_0_var(--color-line-2)]",
                    right && "border-teal bg-success-bg",
                    picked && !right && "border-coral bg-coral-soft",
                    done && !right && !picked && "border-line opacity-60",
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: s.bg, boxShadow: `0 3px 0 ${s.dk}` }}>
                    <ShapeIcon kind={SHAPES[i % 4]} className="size-4" color={s.text} />
                  </span>
                  <T v={o} className="font-semibold" />
                  {right && <Check className="ml-auto size-5 text-teal-dk" />}
                  {picked && !right && <X className="ml-auto size-5 text-coral-dk" />}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "tf" && (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((b) => {
              const right = done && b === q.answer;
              const picked = result?.value === String(b);
              return (
                <button
                  key={String(b)}
                  disabled={done}
                  onClick={() => submit(String(b))}
                  className={cn(
                    "flex h-16 items-center justify-center gap-2 rounded-2xl border-2 text-lg font-extrabold transition-all",
                    !done && (b ? "border-teal/40 bg-teal-soft text-teal-dk hover:-translate-y-0.5" : "border-coral/40 bg-coral-soft text-coral-dk hover:-translate-y-0.5"),
                    right && "border-teal bg-teal text-white",
                    picked && !right && "border-coral bg-coral text-white",
                    done && !right && !picked && "opacity-50",
                  )}
                >
                  {b ? <Check className="size-6" /> : <X className="size-6" />}
                  <T v={b ? bi("True", "Đúng") : bi("False", "Sai")} />
                </button>
              );
            })}
          </div>
        )}

        {(q.type === "number" || q.type === "term") && (
          <form
            className="flex flex-wrap items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
          >
            <div className="flex min-w-0 flex-1 items-center rounded-2xl border-2 border-line-2 bg-white focus-within:border-blue">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={done}
                inputMode={q.type === "number" ? "decimal" : "text"}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                lang={q.type === "term" ? "en" : undefined}
                placeholder={q.type === "number" ? "Nhập số" : "Gõ tiếng Anh…"}
                aria-label="Câu trả lời của em"
                className="h-14 min-w-0 flex-1 bg-transparent px-4 font-display text-xl font-bold outline-none"
              />
              {q.type === "number" && q.unit && <span className="pr-4 font-display text-lg font-bold text-ink-2">{q.unit.trim()}</span>}
            </div>
            {q.type === "number" && !done && (
              // Bàn phím số của điện thoại thường không có dấu trừ → nút đổi dấu
              <button
                type="button"
                onClick={() => setValue((v) => (v.trim().startsWith("−") || v.trim().startsWith("-") ? v.trim().slice(1) : "−" + v.trim()))}
                className="grid h-14 w-12 place-items-center rounded-2xl border-2 border-line-2 bg-white font-display text-xl font-extrabold"
                aria-label="Đổi dấu âm / dương"
                title="Đổi dấu"
              >
                ±
              </button>
            )}
            {!done && (
              <Button type="submit" size="lg" disabled={!value.trim()}>
                Kiểm tra
              </Button>
            )}
          </form>
        )}

        {q.type === "expr" && <ExprInput value={value} onChange={setValue} onSubmit={() => submit(value)} disabled={done} />}

        {/* Gợi ý 3 tầng */}
        {hints > 0 && (
          <ol className="space-y-2">
            {q.hints.slice(0, hints).map((h, i) => (
              <li key={i} className="rounded-2xl border-2 border-sun/50 bg-sun-soft px-4 py-3">
                <div className="mb-1 text-xs font-extrabold tracking-wide text-[#8A5A00] uppercase">Gợi ý {i + 1} · {HINT_TAG[i].vi}</div>
                <T v={h} block />
              </li>
            ))}
          </ol>
        )}
        {!done && hints < 3 && (
          <button onClick={() => setHints((h) => h + 1)} className="inline-flex h-10 items-center gap-2 rounded-xl px-2 text-sm font-bold text-[#8A5A00] hover:bg-sun-soft">
            <Lightbulb className="size-4" /> {hints === 0 ? "Cần gợi ý?" : `Gợi ý tiếp (${HINT_TAG[hints].vi})`}
          </button>
        )}
      </div>

      {result && (
        <div className={cn("flex flex-col gap-3 border-t-2 p-5 sm:flex-row sm:items-center", result.correct ? "border-teal/30 bg-success-bg" : "border-coral/30 bg-coral-soft")} role="status">
          <Tam mood={result.correct ? "cheer" : "alert"} className="size-14 shrink-0 max-sm:hidden" />
          <div className="flex-1 space-y-1">
            <p className={cn("font-display text-xl font-extrabold", result.correct ? "text-success-fg" : "text-coral-dk")}>
              {result.correct ? `Chính xác! +${hints >= 2 ? 5 : 10} XP` : "Chưa đúng rồi"}
            </p>
            {result.note && <T v={result.note} block className="text-sm font-bold" />}
            {!result.correct && (
              <p className="text-sm font-semibold">
                Đáp án: <T v={answerText(q)} />
              </p>
            )}
            <T v={q.explain} block className="text-sm" />
          </div>
          {onNext && (
            <Button onClick={onNext} size="lg" variant={result.correct ? "teal" : "default"} autoFocus>
              {nextLabel} <ArrowRight />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
