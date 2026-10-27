"use client";

// Ô gõ biểu thức đại số: phím nhanh (x, y, ², ³, ngoặc…) chèn vào chỗ con trỏ + dòng xem trước dạng đẹp.
// Biểu thức chưa đọc được thì báo ngay và chưa cho nộp (tránh mất điểm vì gõ nhầm).
import { useRef } from "react";
import { Delete } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { parse, ParseError, prettyInput } from "@/lib/algebra/poly";

const KEYS = ["x", "y", "²", "³", "(", ")", "+", "−", "·"];

export function readable(v: string): { ok: boolean; msg?: string } {
  if (!v.trim()) return { ok: false };
  try {
    parse(v);
    return { ok: true };
  } catch (e) {
    return { ok: false, msg: e instanceof ParseError ? e.message : "Biểu thức chưa đọc được" };
  }
}

export function ExprInput({ value, onChange, onSubmit, disabled }: { value: string; onChange: (v: string) => void; onSubmit: () => void; disabled?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const r = readable(value);

  const insert = (k: string) => {
    const el = ref.current;
    const s = el?.selectionStart ?? value.length;
    const e = el?.selectionEnd ?? value.length;
    const next = value.slice(0, s) + k + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(s + k.length, s + k.length);
    });
  };
  const back = () => {
    const el = ref.current;
    const s = el?.selectionStart ?? value.length;
    const e = el?.selectionEnd ?? value.length;
    const from = s === e ? Math.max(0, s - 1) : s;
    onChange(value.slice(0, from) + value.slice(e));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(from, from);
    });
  };

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (r.ok) onSubmit();
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Ví dụ: 3x^2 - 2x + 1"
          aria-label="Biểu thức của em"
          className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-line-2 bg-white px-4 font-display text-xl font-bold outline-none focus:border-blue"
        />
        {!disabled && (
          <Button type="submit" size="lg" disabled={!r.ok}>
            Kiểm tra
          </Button>
        )}
      </div>
      {!disabled && (
        <div className="flex flex-wrap gap-1.5" aria-label="Phím nhanh">
          {KEYS.map((k) => (
            <button key={k} type="button" onClick={() => insert(k)} className="h-10 min-w-10 rounded-xl border-2 border-line bg-paper px-2 font-display text-lg font-bold hover:border-line-2 hover:bg-white">
              {k}
            </button>
          ))}
          <button type="button" onClick={back} className="grid h-10 w-12 place-items-center rounded-xl border-2 border-line bg-paper hover:bg-white" aria-label="Xoá một kí tự">
            <Delete className="size-5" />
          </button>
        </div>
      )}
      <p className={cn("min-h-6 text-sm", value.trim() && !r.ok ? "font-semibold text-coral-dk" : "text-ink-2")}>
        {!value.trim() ? (
          <>Mẹo: gõ <b>x2</b> hoặc <b>x^2</b> cho x², <b>3xy</b> cho 3·x·y.</>
        ) : r.ok ? (
          <>
            Máy đọc là: <span className="font-display text-base font-extrabold text-ink">{prettyInput(value)}</span>
          </>
        ) : (
          r.msg
        )}
      </p>
    </form>
  );
}
