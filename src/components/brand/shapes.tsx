// Hình học điểm nhấn + biểu tượng 4 ô đáp án (không chỉ phân biệt bằng màu)
import { cn } from "cn";

export type ShapeKind = "triangle" | "diamond" | "circle" | "square";

export const SHAPE_COLORS: Record<ShapeKind, { bg: string; dk: string; text: string; label: string }> = {
  triangle: { bg: "#E8492E", dk: "#B23620", text: "#fff", label: "A" },
  diamond: { bg: "#2F5BEA", dk: "#1E3FB8", text: "#fff", label: "B" },
  circle: { bg: "#FFC93C", dk: "#C9951A", text: "#1C1B3A", label: "C" },
  square: { bg: "#0E9F8A", dk: "#0A7565", text: "#fff", label: "D" },
};

export function ShapeIcon({ kind, className, color = "currentColor" }: { kind: ShapeKind; className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-5", className)} aria-hidden>
      {kind === "triangle" && <path d="M12 3 L22 20 H2 Z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />}
      {kind === "diamond" && <path d="M12 2 L22 12 L12 22 L2 12 Z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />}
      {kind === "circle" && <circle cx="12" cy="12" r="9.5" fill={color} />}
      {kind === "square" && <rect x="3" y="3" width="18" height="18" rx="3" fill={color} />}
    </svg>
  );
}

/** Các hình trôi nổi làm nền trang trí */
export function FloatingShapes({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const o = tone === "dark" ? 0.22 : 0.9;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <ShapeIcon kind="triangle" color="#E8492E" className="animate-float absolute top-[3%] left-[2%] size-10 opacity-90 [--r:-12deg]" />
      <ShapeIcon kind="circle" color="#FFC93C" className="animate-float absolute top-[16%] right-[8%] size-12 [animation-delay:-2s]" />
      <ShapeIcon kind="diamond" color="#2F5BEA" className="animate-float absolute bottom-[18%] left-[10%] size-8 [animation-delay:-4s]" />
      <ShapeIcon kind="square" color="#0E9F8A" className="animate-float absolute right-[14%] bottom-[10%] size-9 [--r:14deg] [animation-delay:-1s]" />
      <div className="absolute -top-24 -right-24 size-72 rounded-full bg-sun/30 blur-3xl" style={{ opacity: o }} />
      <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-blue/20 blur-3xl" style={{ opacity: o }} />
    </div>
  );
}
