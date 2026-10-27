"use client";

// Biểu đồ số liệu cho Chương V (SVG thuần, in được, không cần mạng):
//  bar  — biểu đồ cột (một dãy) / cột kép (nhiều dãy, có chú giải)
//  line — biểu đồ đoạn thẳng (thay đổi theo thời gian)
//  pie  — biểu đồ hình quạt tròn (tỉ lệ phần trăm của các phần trong tổng thể)
// Quy ước vẽ: cột ≤ 24px, đầu cột bo 4px; đường 2px; điểm r = 4 có viền trắng; lưới mảnh, chữ dùng màu chữ (không dùng màu dữ liệu).
import { useState } from "react";
import { T } from "@/components/lang";
import type { ChartSpec } from "@/lib/content/types";

/** Màu dữ liệu theo thứ tự cố định (không xoay vòng) — đã kiểm bằng công cụ kiểm bảng màu */
export const SERIES_COLORS = ["#2F5BEA", "#E8492E", "#0E9F8A", "#C9951A", "#8B5CF6", "#DB2777"];

const W = 340,
  H = 220,
  PAD = { l: 40, r: 12, t: 16, b: 34 };
const fmt = (n: number) => String(+n.toFixed(2)).replace(".", ",");

/** Vạch chia trục dọc "đẹp" (1, 2, 5 × 10ⁿ) */
function ticks(min: number, max: number) {
  const span = max - min || 1;
  const raw = span / 5;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw)!;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}

export function DataChart({ spec, className }: { spec: ChartSpec; className?: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const showValues = spec.showValues ?? true;
  return (
    <figure className={className}>
      <figcaption className="mb-1 text-center text-sm font-bold">
        <T v={spec.title} />
      </figcaption>
      {spec.kind === "pie" ? <Pie spec={spec} hover={hover} setHover={setHover} showValues={showValues} /> : <Axes spec={spec} hover={hover} setHover={setHover} showValues={showValues} />}
      {(spec.series.length > 1 || spec.kind === "pie") && (
        <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-2">
          {(spec.kind === "pie" ? spec.categories.map((c) => ({ en: c, vi: c })) : spec.series.map((s) => s.name)).map((n, i) => (
            <li key={i} className="inline-flex items-center gap-1.5">
              <span className="size-3 rounded-sm" style={{ background: SERIES_COLORS[i] }} aria-hidden />
              <T v={n} />
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}

type P = { spec: ChartSpec; hover: string | null; setHover: (k: string | null) => void; showValues: boolean };

function Axes({ spec, hover, setHover, showValues }: P) {
  const all = spec.series.flatMap((s) => s.values);
  const yMin = spec.yMin ?? 0;
  const tk = ticks(yMin, Math.max(...all));
  const top = tk[tk.length - 1];
  const bottom = tk[0];
  const iw = W - PAD.l - PAD.r,
    ih = H - PAD.t - PAD.b;
  const y = (v: number) => PAD.t + ih - ((v - bottom) / (top - bottom || 1)) * ih;
  const n = spec.categories.length;
  const band = iw / n;
  const ns = spec.series.length;
  const barW = Math.min(24, (band * 0.7) / ns);
  const cx = (i: number) => PAD.l + band * i + band / 2;
  const unit = spec.unit ?? "";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${spec.title.vi}: ${spec.categories.map((c, i) => `${c} ${spec.series.map((s) => fmt(s.values[i]) + unit).join(" / ")}`).join("; ")}`}>
      {tk.map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#E6E2F6" strokeWidth={1} />
          <text x={PAD.l - 6} y={y(v)} textAnchor="end" dominantBaseline="middle" className="fill-ink-2 text-[10px]">
            {fmt(v)}
          </text>
        </g>
      ))}
      {spec.yMin != null && spec.yMin > 0 && (
        // Kí hiệu trục bị cắt (không bắt đầu từ 0)
        <path d={`M${PAD.l - 4} ${PAD.t + ih + 4} l8 -4 m-8 8 l8 -4`} stroke="#B23620" strokeWidth={1.5} fill="none" />
      )}
      <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + ih} y2={PAD.t + ih} stroke="#55537A" strokeWidth={1} />
      {spec.categories.map((c, i) => (
        <text key={c} x={cx(i)} y={H - PAD.b + 16} textAnchor="middle" className="fill-ink-2 text-[10px] font-semibold">
          {c}
        </text>
      ))}

      {spec.kind === "bar" &&
        spec.series.map((s, si) =>
          s.values.map((v, i) => {
            const x = cx(i) - (ns * barW + (ns - 1) * 2) / 2 + si * (barW + 2);
            const y0 = y(v),
              h = PAD.t + ih - y0;
            const r = Math.min(4, h / 2, barW / 2);
            const key = `${si}-${i}`;
            return (
              <g key={key} onPointerEnter={() => setHover(key)} onPointerLeave={() => setHover(null)}>
                {/* Đầu cột bo tròn, chân cột vuông */}
                <path d={`M${x} ${y0 + h} V${y0 + r} Q${x} ${y0} ${x + r} ${y0} H${x + barW - r} Q${x + barW} ${y0} ${x + barW} ${y0 + r} V${y0 + h} Z`} fill={SERIES_COLORS[si]} opacity={hover && hover !== key ? 0.55 : 1} />
                <rect x={x - 2} y={PAD.t} width={barW + 4} height={ih} fill="transparent" />
                {(showValues || hover === key) && (
                  <text x={x + barW / 2} y={y0 - 4} textAnchor="middle" className="fill-ink text-[10px] font-bold">
                    {fmt(v)}
                  </text>
                )}
              </g>
            );
          }),
        )}

      {spec.kind === "line" &&
        spec.series.map((s, si) => (
          <g key={si}>
            <polyline points={s.values.map((v, i) => `${cx(i)},${y(v)}`).join(" ")} fill="none" stroke={SERIES_COLORS[si]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {s.values.map((v, i) => {
              const key = `${si}-${i}`;
              return (
                <g key={key} onPointerEnter={() => setHover(key)} onPointerLeave={() => setHover(null)}>
                  <circle cx={cx(i)} cy={y(v)} r={10} fill="transparent" />
                  <circle cx={cx(i)} cy={y(v)} r={4} fill={SERIES_COLORS[si]} stroke="#fff" strokeWidth={2} />
                  {(showValues || hover === key) && (
                    <text x={cx(i)} y={y(v) - 9} textAnchor="middle" className="fill-ink text-[10px] font-bold">
                      {fmt(v)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
    </svg>
  );
}

function Pie({ spec, hover, setHover, showValues }: P) {
  const vals = spec.series[0].values;
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  const R = 80,
    C = { x: W / 2, y: 100 };
  const unit = spec.unit ?? "";
  // Góc bắt đầu của từng lát (cộng dồn, bắt đầu từ 12 giờ)
  const starts = vals.map((_, i) => -Math.PI / 2 + (vals.slice(0, i).reduce((a, b) => a + b, 0) / total) * Math.PI * 2);
  return (
    <svg viewBox={`0 0 ${W} 200`} className="h-auto w-full" role="img" aria-label={`${spec.title.vi}: ${spec.categories.map((c, i) => `${c} ${fmt(vals[i])}${unit}`).join("; ")}`}>
      {vals.map((v, i) => {
        const a0 = starts[i];
        const a1 = a0 + (v / total) * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const p0 = [C.x + R * Math.cos(a0), C.y + R * Math.sin(a0)];
        const p1 = [C.x + R * Math.cos(a1), C.y + R * Math.sin(a1)];
        const mid = (a0 + a1) / 2;
        const lp = [C.x + R * 0.62 * Math.cos(mid), C.y + R * 0.62 * Math.sin(mid)];
        const key = String(i);
        const d = vals.length === 1 ? `M${C.x - R} ${C.y} a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0` : `M${C.x} ${C.y} L${p0[0]} ${p0[1]} A${R} ${R} 0 ${large} 1 ${p1[0]} ${p1[1]} Z`;
        // Chữ trên nền màu: chọn trắng hoặc mực theo độ sáng của màu
        const light = i === 3;
        return (
          <g key={key} onPointerEnter={() => setHover(key)} onPointerLeave={() => setHover(null)}>
            <path d={d} fill={SERIES_COLORS[i]} stroke="#fff" strokeWidth={2} opacity={hover && hover !== key ? 0.6 : 1} />
            {(showValues || hover === key) && v / total >= 0.06 && (
              <text x={lp[0]} y={lp[1]} textAnchor="middle" dominantBaseline="middle" className={`text-[11px] font-extrabold ${light ? "fill-ink" : "fill-white"}`}>
                {fmt(v)}
                {unit}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
