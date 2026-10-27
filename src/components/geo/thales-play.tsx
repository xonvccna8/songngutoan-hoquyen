"use client";

// Hình kéo thả Thalès: kéo D trên cạnh AB; E trên AC luôn sao cho DE ∥ BC.
// Thấy ngay AD/AB = AE/AC và AD/DB = AE/EC; D ở trung điểm thì DE là đường trung bình (DE = BC : 2).
import { useRef, useState } from "react";
import { Hand, RotateCcw } from "lucide-react";
import { STROKE } from "@/components/geo/figure";
import { T } from "@/components/lang";
import { bi, THALES, vn } from "@/lib/content/helpers";

type P = [number, number];
const A = THALES.A as P,
  B = THALES.B as P,
  C = THALES.C as P;
const lerp = (p: P, q: P, t: number): P => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const len = (p: P, q: P) => Math.hypot(p[0] - q[0], p[1] - q[1]) / 20;
const f = (x: number) => vn(Math.round(x * 100) / 100);

export function ThalesPlay() {
  const [t, setT] = useState(0.4);
  const [drag, setDrag] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const D = lerp(A, B, t),
    E = lerp(A, C, t);

  const move = (e: React.PointerEvent) => {
    if (!drag || !svg.current) return;
    const r = svg.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 340 - 20;
    const y = ((e.clientY - r.top) / r.height) * 240 - 20;
    // Chiếu điểm chạm lên đoạn AB để D luôn nằm trên AB
    const ab: P = [B[0] - A[0], B[1] - A[1]];
    const k = ((x - A[0]) * ab[0] + (y - A[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2);
    setT(Math.max(0.12, Math.min(0.88, k)));
  };

  const ad = len(A, D),
    db = len(D, B),
    ae = len(A, E),
    ec = len(E, C);
  const mid = Math.abs(t - 0.5) < 0.02;
  const rows = [
    { math: `AD/AB = ${f(ad)}/${f(ad + db)} = ${f(t)}`, ok: true, note: bi("Same ratio on both sides", "Hai bên có cùng tỉ số") },
    { math: `AE/AC = ${f(ae)}/${f(ae + ec)} = ${f(t)}`, ok: true, note: bi("AD/AB = AE/AC", "AD/AB = AE/AC") },
    { math: `AD/DB = AE/EC = ${f(ad / db)}`, ok: true, note: bi("The segments are proportional", "Các đoạn thẳng tương ứng tỉ lệ") },
    mid
      ? { math: `DE = ${f(len(D, E))} = BC : 2`, ok: true, note: bi("D, E are midpoints: DE is a midsegment!", "D, E là trung điểm: DE là đường trung bình!") }
      : { math: `DE ∥ BC`, ok: undefined, note: bi("Try putting D at the midpoint of AB…", "Thử kéo D tới trung điểm của AB xem…") },
  ];

  return (
    <div className="card-lsn overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b-2 border-line bg-sun-soft px-4 py-2 text-sm font-bold text-[#8A5A00]">
        <span className="inline-flex items-center gap-2">
          <Hand className="size-4 shrink-0" /> Kéo chấm vàng D trên cạnh AB
        </span>
        <button onClick={() => setT(0.4)} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2 whitespace-nowrap hover:bg-white/60" aria-label="Đặt lại hình">
          <RotateCcw className="size-4" /> Đặt lại
        </button>
      </div>
      <div className="grid gap-3 p-3 md:grid-cols-[1.2fr_1fr] md:items-center">
        <svg ref={svg} viewBox="-20 -20 340 240" className="h-auto w-full touch-none rounded-2xl bg-paper select-none" onPointerMove={move} onPointerUp={() => setDrag(false)} onPointerLeave={() => setDrag(false)} role="img" aria-label="Hình kéo thả định lí Thalès">
          <polygon points={[A, B, C].map((p) => p.join(",")).join(" ")} fill="#E7ECFF" stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
          <line x1={D[0]} y1={D[1]} x2={E[0]} y2={E[1]} stroke="#E8492E" strokeWidth="3" />
          {[["A", A, [0, -12]], ["B", B, [-12, 8]], ["C", C, [12, 8]], ["E", E, [14, 0]]].map(([k, p, o]) => (
            <g key={k as string}>
              <circle cx={(p as P)[0]} cy={(p as P)[1]} r="3.5" fill={STROKE} />
              <text x={(p as P)[0] + (o as P)[0]} y={(p as P)[1] + (o as P)[1]} textAnchor="middle" dominantBaseline="middle" className="fill-ink font-display text-[17px] font-extrabold">
                {k as string}
              </text>
            </g>
          ))}
          <text x={D[0] - 16} y={D[1]} textAnchor="middle" dominantBaseline="middle" className="fill-ink font-display text-[17px] font-extrabold">
            D
          </text>
          <circle
            cx={D[0]}
            cy={D[1]}
            r={drag ? 13 : 11}
            fill="#FFC93C"
            stroke="#C9951A"
            strokeWidth="3"
            className="cursor-grab"
            aria-label="Kéo điểm D"
            onPointerDown={(e) => {
              try {
                (e.target as Element).setPointerCapture?.(e.pointerId);
              } catch {}
              setDrag(true);
            }}
          />
        </svg>
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={i} className={`rounded-xl px-3 py-2 text-sm ${r.ok ? "bg-success-bg" : "bg-paper"}`}>
              <div className="font-display text-base font-extrabold text-ink">{r.math}</div>
              <T v={r.note} className="text-xs" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
