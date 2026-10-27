// Vẽ hình hình học tĩnh từ FigureSpec (khung 300 × 200): đa giác, đường chéo, nhãn cạnh/góc, góc vuông, vạch cạnh bằng nhau
import { cn } from "cn";
import type { FigureSpec } from "@/lib/content/types";

type P = [number, number];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];
const len = (a: P) => Math.hypot(a[0], a[1]) || 1;
const unit = (a: P): P => mul(a, 1 / len(a));
const mid = (a: P, b: P): P => mul(add(a, b), 0.5);

export function centroid(pts: P[]): P {
  return mul(pts.reduce((s, p) => add(s, p), [0, 0] as P), 1 / pts.length);
}

/** Pháp tuyến của đoạn AB, hướng ra xa điểm `away` */
function normalAway(a: P, b: P, away: P): P {
  const d = unit(sub(b, a));
  const n: P = [-d[1], d[0]];
  const m = mid(a, b);
  const v = sub(m, away);
  return n[0] * v[0] + n[1] * v[1] >= 0 ? n : mul(n, -1);
}

export const STROKE = "#1C1B3A";

export function GeoFigure({ spec, className, title }: { spec: FigureSpec; className?: string; title?: string }) {
  const pt = (k: string) => spec.points[k];
  const poly = spec.polygon.map(pt);
  const c = centroid(poly);
  const neighbours = (k: string): [string, string] | null => {
    const i = spec.polygon.indexOf(k);
    if (i < 0) return null;
    const n = spec.polygon.length;
    return [spec.polygon[(i + n - 1) % n], spec.polygon[(i + 1) % n]];
  };

  return (
    <svg viewBox="-20 -20 340 240" className={cn("h-auto w-full max-w-md select-none", className)} role="img" aria-label={title ?? `Hình ${spec.polygon.join("")}`}>
      <polygon points={poly.map((p) => p.join(",")).join(" ")} fill="#E7ECFF" stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />

      {spec.segments?.map(([a, b]) => (
        <line key={a + b} x1={pt(a)[0]} y1={pt(a)[1]} x2={pt(b)[0]} y2={pt(b)[1]} stroke="#2F5BEA" strokeWidth="2" strokeDasharray="6 4" />
      ))}

      {/* Góc vuông: ô vuông nhỏ dựng theo hai cạnh kề */}
      {spec.rightAngles?.map((k) => {
        const nb = neighbours(k);
        if (!nb) return null;
        const v = pt(k);
        const u1 = mul(unit(sub(pt(nb[0]), v)), 12);
        const u2 = mul(unit(sub(pt(nb[1]), v)), 12);
        const p1 = add(v, u1),
          p2 = add(add(v, u1), u2),
          p3 = add(v, u2);
        return <polyline key={k} points={`${p1.join(",")} ${p2.join(",")} ${p3.join(",")}`} fill="none" stroke={STROKE} strokeWidth="1.8" />;
      })}

      {/* Vạch đánh dấu đoạn bằng nhau */}
      {spec.ticks?.map(([a, b, n]) => {
        const A = pt(a),
          B = pt(b);
        const d = unit(sub(B, A));
        const nrm: P = [-d[1], d[0]];
        const m = mid(A, B);
        return (
          <g key={`${a}${b}`}>
            {Array.from({ length: n }, (_, i) => {
              const o = add(m, mul(d, (i - (n - 1) / 2) * 5));
              const p1 = add(o, mul(nrm, 6)),
                p2 = add(o, mul(nrm, -6));
              return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#E8492E" strokeWidth="2.2" strokeLinecap="round" />;
            })}
          </g>
        );
      })}

      {spec.sideLabels?.map(([a, b, text]) => {
        const A = pt(a),
          B = pt(b);
        // Cạnh của đa giác (hai đỉnh liền nhau) thì ghi ra phía ngoài; đường chéo thì ghi lệch sang một bên
        const gap = Math.abs(spec.polygon.indexOf(a) - spec.polygon.indexOf(b));
        const onPoly = spec.polygon.includes(a) && spec.polygon.includes(b) && (gap === 1 || gap === spec.polygon.length - 1);
        const n = onPoly ? normalAway(A, B, c) : (() => {
          const d = unit(sub(B, A));
          return [d[1], -d[0]] as P;
        })();
        const p = add(mid(A, B), mul(n, 16));
        return (
          <text key={`${a}${b}`} x={p[0]} y={p[1]} textAnchor="middle" dominantBaseline="middle" className="fill-coral-dk font-sans text-[15px] font-bold">
            {text}
          </text>
        );
      })}

      {spec.angleLabels?.map(([k, text]) => {
        const v = pt(k);
        const nb = neighbours(k);
        // Đặt nhãn trên đường phân giác trong của góc
        const dir = nb ? unit(add(unit(sub(pt(nb[0]), v)), unit(sub(pt(nb[1]), v)))) : unit(sub(c, v));
        const p = add(v, mul(dir, 30));
        return (
          <text key={k} x={p[0]} y={p[1]} textAnchor="middle" dominantBaseline="middle" className="fill-teal-dk font-sans text-[14px] font-bold">
            {text}
          </text>
        );
      })}

      {[...spec.polygon, ...(spec.dots ?? [])].map((k) => {
        const v = pt(k);
        const isDot = !spec.polygon.includes(k);
        const out = isDot ? ([10, 14] as P) : mul(unit(sub(v, c)), 16);
        return (
          <g key={k}>
            <circle cx={v[0]} cy={v[1]} r={isDot ? 3.5 : 3} fill={STROKE} />
            <text x={v[0] + out[0]} y={v[1] + out[1]} textAnchor="middle" dominantBaseline="middle" className="fill-ink font-display text-[17px] font-extrabold">
              {k}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
