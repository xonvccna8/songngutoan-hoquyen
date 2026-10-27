"use client";

// Hình kéo thả: em kéo các đỉnh để tự khám phá tính chất
//  quad — tứ giác bất kì: tổng 4 góc luôn 360°
//  trap — hình thang cân (kéo B, A đối xứng theo): góc kề đáy, cạnh bên, đường chéo bằng nhau
//  para — hình bình hành (kéo A, B, D; C tự đi theo): cạnh đối, góc đối, đường chéo
//  rect — hình chữ nhật (kéo C): hai đường chéo bằng nhau, OA = OB = OC = OD
//  rhomb — hình thoi (kéo A, B = kéo nửa hai đường chéo): bốn cạnh bằng nhau, đường chéo vuông góc; hai đường chéo bằng nhau → hình vuông
import { useRef, useState } from "react";
import { Hand, RotateCcw } from "lucide-react";
import { T } from "@/components/lang";
import { STROKE } from "@/components/geo/figure";
import { bi, PARA, QUAD, RECT, RHOMB, TRAP, vn } from "@/lib/content/helpers";
import type { PlayMode } from "@/lib/content/types";

type P = [number, number];
type Pts = Record<string, P>;

/** 20 đơn vị toạ độ = 1 cm hiển thị */
const cm = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]) / 20;
const fmt = (x: number) => vn(Math.round(x * 10) / 10);

/** Góc tại đỉnh v giữa hai tia v→a, v→b (độ) */
function angleAt(v: P, a: P, b: P) {
  const u = [a[0] - v[0], a[1] - v[1]],
    w = [b[0] - v[0], b[1] - v[1]];
  const cos = (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]) || 1);
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
}

/** Tứ giác lồi ⇔ bốn tích có hướng cùng dấu */
function isConvex(ps: P[]) {
  const s = ps.map((p, i) => {
    const q = ps[(i + 1) % 4],
      r = ps[(i + 2) % 4];
    return Math.sign((q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0]));
  });
  return s.every((x) => x > 0) || s.every((x) => x < 0);
}

const START: Record<PlayMode, Pts> = {
  quad: { A: QUAD.A, B: QUAD.B, C: QUAD.C, D: QUAD.D },
  para: { A: PARA.A, B: PARA.B, D: PARA.D },
  rect: { C: RECT.C },
  trap: { B: TRAP.B },
  rhomb: { A: RHOMB.A, B: RHOMB.B },
};
const DRAG: Record<PlayMode, string[]> = { quad: ["A", "B", "C", "D"], trap: ["B"], para: ["A", "B", "D"], rect: ["C"], rhomb: ["A", "B"] };

/** Tính đủ 4 đỉnh (+ O) từ các điểm đang kéo */
function full(mode: PlayMode, p: Pts): Pts {
  if (mode === "quad") return p;
  if (mode === "para") {
    const C: P = [p.B[0] + p.D[0] - p.A[0], p.B[1] + p.D[1] - p.A[1]];
    return { ...p, C, O: [(p.A[0] + C[0]) / 2, (p.A[1] + C[1]) / 2] };
  }
  const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (mode === "trap") {
    // A đối xứng với B qua trục dọc x = 150 (trục đối xứng của hình thang cân)
    const A: P = [300 - p.B[0], p.B[1]];
    const C = TRAP.C,
      D = TRAP.D;
    return { A, B: p.B, C, D, O: lineCross(A, C, p.B, D) };
  }
  if (mode === "rhomb") {
    const O = RHOMB.O,
      a = O[1] - p.A[1],
      b = p.B[0] - O[0];
    return { A: [O[0], O[1] - a], B: [O[0] + b, O[1]], C: [O[0], O[1] + a], D: [O[0] - b, O[1]], O };
  }
  const A = RECT.A,
    C = p.C;
  return { A, B: [C[0], A[1]], C, D: [A[0], C[1]], O: mid(A, C) };
}

/** Giao điểm hai đường thẳng PQ và RS */
function lineCross(p: P, q: P, r: P, s: P): P {
  const d = (p[0] - q[0]) * (r[1] - s[1]) - (p[1] - q[1]) * (r[0] - s[0]) || 1;
  const t = ((p[0] - r[0]) * (r[1] - s[1]) - (p[1] - r[1]) * (r[0] - s[0])) / d;
  return [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
}

const clampPt = (mode: PlayMode, k: string, x: number, y: number): P => {
  if (mode === "trap") return [Math.max(160, Math.min(255, x)), Math.max(15, Math.min(140, y))];
  // Hình thoi: A chỉ đi dọc, B chỉ đi ngang (giữ hai đường chéo vuông góc)
  if (mode === "rhomb") return k === "A" ? [RHOMB.O[0], Math.max(15, Math.min(85, y))] : [Math.max(165, Math.min(290, x)), RHOMB.O[1]];
  if (mode === "rect") return [Math.max(110, Math.min(290, x)), Math.max(80, Math.min(190, y))];
  return [Math.max(5, Math.min(295, x)), Math.max(5, Math.min(195, y))];
};

export function Playground({ mode }: { mode: PlayMode }) {
  const [pts, setPts] = useState<Pts>(START[mode]);
  const [drag, setDrag] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const all = full(mode, pts);
  const V = ["A", "B", "C", "D"].map((k) => all[k]);
  const ang = V.map((v, i) => angleAt(v, V[(i + 3) % 4], V[(i + 1) % 4]));
  const convex = isConvex(V);

  const move = (e: React.PointerEvent) => {
    if (!drag || !svg.current) return;
    const r = svg.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 340 - 20;
    const y = ((e.clientY - r.top) / r.height) * 240 - 20;
    setPts((p) => ({ ...p, [drag]: clampPt(mode, drag, x, y) }));
  };

  // Nhãn đỉnh đặt ra phía ngoài tâm hình
  const c: P = [(V[0][0] + V[1][0] + V[2][0] + V[3][0]) / 4, (V[0][1] + V[1][1] + V[2][1] + V[3][1]) / 4];
  const out = (v: P): P => {
    const d = [v[0] - c[0], v[1] - c[1]],
      l = Math.hypot(d[0], d[1]) || 1;
    return [v[0] + (d[0] / l) * 17, v[1] + (d[1] / l) * 17];
  };

  const rows = readouts(mode, all, ang, convex);

  return (
    <div className="card-lsn overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b-2 border-line bg-sun-soft px-4 py-2 text-sm font-bold text-[#8A5A00]">
        <span className="inline-flex items-center gap-2">
          <Hand className="size-4 shrink-0" /> Kéo chấm vàng để đổi hình
        </span>
        <button onClick={() => setPts(START[mode])} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2 whitespace-nowrap hover:bg-white/60" aria-label="Đặt lại hình">
          <RotateCcw className="size-4" /> Đặt lại
        </button>
      </div>
      <div className="grid gap-3 p-3 md:grid-cols-[1.2fr_1fr] md:items-center">
        <svg
          ref={svg}
          viewBox="-20 -20 340 240"
          className="h-auto w-full touch-none select-none rounded-2xl bg-paper"
          onPointerMove={move}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
          role="img"
          aria-label="Hình kéo thả"
        >
          <polygon points={V.map((p) => p.join(",")).join(" ")} fill={convex ? "#E7ECFF" : "#FFE3DD"} stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
          {mode !== "quad" && (
            <>
              <line x1={all.A[0]} y1={all.A[1]} x2={all.C[0]} y2={all.C[1]} stroke="#2F5BEA" strokeWidth="2" strokeDasharray="6 4" />
              <line x1={all.B[0]} y1={all.B[1]} x2={all.D[0]} y2={all.D[1]} stroke="#2F5BEA" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx={all.O[0]} cy={all.O[1]} r="3.5" fill={STROKE} />
              <text x={all.O[0] + 11} y={all.O[1] + 13} className="fill-ink font-display text-[15px] font-extrabold">O</text>
            </>
          )}
          {["A", "B", "C", "D"].map((k, i) => {
            const v = all[k];
            const lab = out(v);
            const canDrag = DRAG[mode].includes(k);
            const inner: P = [v[0] + (c[0] - v[0]) * 0.28, v[1] + (c[1] - v[1]) * 0.28];
            return (
              <g key={k}>
                <text x={inner[0]} y={inner[1]} textAnchor="middle" dominantBaseline="middle" className="fill-teal-dk text-[12px] font-bold">
                  {Math.round(ang[i])}°
                </text>
                <text x={lab[0]} y={lab[1]} textAnchor="middle" dominantBaseline="middle" className="fill-ink font-display text-[17px] font-extrabold">{k}</text>
                {canDrag ? (
                  <circle
                    cx={v[0]}
                    cy={v[1]}
                    r={drag === k ? 13 : 11}
                    fill="#FFC93C"
                    stroke="#C9951A"
                    strokeWidth="3"
                    className="cursor-grab"
                    onPointerDown={(e) => {
                      // Giữ điểm đang kéo kể cả khi ngón tay trượt ra ngoài chấm (một số trình duyệt không cho → bỏ qua)
                      try {
                        (e.target as Element).setPointerCapture?.(e.pointerId);
                      } catch {}
                      setDrag(k);
                    }}
                    aria-label={`Kéo đỉnh ${k}`}
                  />
                ) : (
                  <circle cx={v[0]} cy={v[1]} r="3.5" fill={STROKE} />
                )}
              </g>
            );
          })}
        </svg>
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={i} className={`rounded-xl px-3 py-2 text-sm ${r.ok === false ? "bg-coral-soft" : r.ok ? "bg-success-bg" : "bg-paper"}`}>
              <div className="font-display text-base font-extrabold text-ink">{r.math}</div>
              {r.note && <T v={r.note} className="text-xs" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function readouts(mode: PlayMode, p: Pts, ang: number[], convex: boolean) {
  const A = Math.round(ang[0]),
    B = Math.round(ang[1]),
    C = Math.round(ang[2]),
    D = Math.round(ang[3]);
  if (mode === "quad") {
    if (!convex) return [{ math: "Không phải tứ giác lồi", ok: false, note: bi("Not convex — drag the points back out.", "Kéo các đỉnh ra để được tứ giác lồi nhé.") }];
    // Làm tròn từng góc có thể lệch 1°, nên tính tổng từ số đo thật
    const sum = Math.round(ang.reduce((a, b) => a + b, 0));
    return [
      { math: `∠A + ∠B + ∠C + ∠D`, note: bi(`${A}° + ${B}° + ${C}° + ${D}°`, `${A}° + ${B}° + ${C}° + ${D}°`) },
      { math: `= ${sum}°`, ok: sum === 360, note: bi("Always 360°, whatever the shape!", "Luôn bằng 360°, dù hình thay đổi thế nào!") },
    ];
  }
  const s = (a: string, b: string) => fmt(cm(p[a], p[b]));
  if (mode === "trap") {
    return [
      { math: `∠C = ∠D = ${D}°`, ok: true, note: bi("Base angles are equal", "Hai góc kề đáy lớn bằng nhau") },
      { math: `∠A = ∠B = ${A}°`, ok: true, note: bi(`Angles next to a leg are supplementary: ∠A + ∠D = ${A + D}°`, `Hai góc kề một cạnh bên bù nhau: ∠A + ∠D = ${A + D}°`) },
      { math: `AD = BC = ${s("A", "D")}`, ok: true, note: bi("The legs are equal", "Hai cạnh bên bằng nhau") },
      { math: `AC = BD = ${s("A", "C")}`, ok: true, note: bi("The diagonals are equal", "Hai đường chéo bằng nhau") },
      { math: `AB = ${s("A", "B")} · CD = ${s("C", "D")}`, note: bi("AB ∥ CD (the two bases)", "AB ∥ CD (hai đáy)") },
    ];
  }
  if (mode === "rhomb") {
    const square = Math.abs(cm(p.A, p.C) - cm(p.B, p.D)) < 0.15;
    const half = Math.round(angleAt(p.A, p.B, p.C));
    return [
      square
        ? { math: "Đây là HÌNH VUÔNG!", ok: true, note: bi("Equal diagonals: the rhombus is now a square (∠A = 90°).", "Hai đường chéo bằng nhau: hình thoi trở thành hình vuông (∠A = 90°).") }
        : { math: "Hình thoi ABCD", note: bi("Try making AC = BD …", "Thử kéo cho AC = BD xem điều gì xảy ra…") },
      { math: `AB = BC = CD = DA = ${s("A", "B")}`, ok: true, note: bi("Four equal sides", "Bốn cạnh bằng nhau") },
      { math: "AC ⊥ BD (∠AOB = 90°)", ok: true, note: bi("The diagonals are perpendicular", "Hai đường chéo vuông góc với nhau") },
      { math: `∠BAC = ∠DAC = ${half}° (∠A = ${A}°)`, ok: true, note: bi("Each diagonal bisects the angles", "Đường chéo là đường phân giác của các góc") },
      { math: `S = ${s("A", "C")} × ${s("B", "D")} : 2 = ${fmt((cm(p.A, p.C) * cm(p.B, p.D)) / 2)}`, note: bi("Area = half the product of the diagonals", "Diện tích = nửa tích hai đường chéo") },
    ];
  }
  if (mode === "para") {
    return [
      { math: `AB = CD = ${s("A", "B")}`, ok: true, note: bi("Opposite sides are equal", "Các cạnh đối bằng nhau") },
      { math: `AD = BC = ${s("A", "D")}`, ok: true, note: bi("Opposite sides are equal", "Các cạnh đối bằng nhau") },
      { math: `∠A = ∠C = ${A}° · ∠B = ∠D = ${B}°`, ok: true, note: bi(`Opposite angles are equal; ∠A + ∠B = ${A + B}°`, `Các góc đối bằng nhau; ∠A + ∠B = ${A + B}°`) },
      { math: `OA = OC = ${s("O", "A")} · OB = OD = ${s("O", "B")}`, ok: true, note: bi("The diagonals bisect each other", "Hai đường chéo cắt nhau tại trung điểm mỗi đường") },
      { math: `AC = ${s("A", "C")} · BD = ${s("B", "D")}`, note: bi("Diagonals are usually NOT equal… try making ∠A = 90°!", "Hai đường chéo thường KHÔNG bằng nhau… thử kéo cho ∠A = 90° xem!") },
    ];
  }
  return [
    { math: `∠A = ∠B = ∠C = ∠D = 90°`, ok: true, note: bi("Four right angles", "Bốn góc vuông") },
    { math: `AC = BD = ${s("A", "C")}`, ok: true, note: bi("The diagonals are equal", "Hai đường chéo bằng nhau") },
    { math: `OA = OB = OC = OD = ${s("O", "A")}`, ok: true, note: bi("O is the same distance from all four vertices", "O cách đều bốn đỉnh") },
    { math: `S = ${s("A", "B")} × ${s("B", "C")} = ${fmt(cm(p.A, p.B) * cm(p.B, p.C))}`, note: bi("Area = length × width (units: cm, cm²)", "Diện tích = dài × rộng (đơn vị: cm, cm²)") },
  ];
}
