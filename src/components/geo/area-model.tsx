"use client";

// Mô hình diện tích cho hằng đẳng thức: kéo thanh trượt a, b
//  sum  — hình vuông cạnh a + b = a² + ab + ab + b²  ⇒ (a + b)² = a² + 2ab + b²
//  diff — hình vuông cạnh a bỏ góc vuông cạnh b, ghép lại thành hình chữ nhật (a + b)(a − b)
import { useState } from "react";
import { T } from "@/components/lang";
import { bi } from "@/lib/content/helpers";

const U = 22; // 1 đơn vị = 22 điểm ảnh trong khung vẽ
const C = { a: "#2F5BEA", b: "#E8492E", ab: "#FFC93C", line: "#1C1B3A" };

function Slider({ label, value, min, max, onChange, color }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; color: string }) {
  return (
    <label className="flex items-center gap-3 text-sm font-bold">
      <span className="w-14 font-display text-lg" style={{ color }}>
        {label} = {value}
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-8 flex-1" style={{ accentColor: color }} aria-label={`Độ dài ${label}`} />
    </label>
  );
}

function Cell({ x, y, w, h, fill, text }: { x: number; y: number; w: number; h: number; fill: string; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} fillOpacity={0.28} stroke={C.line} strokeWidth={2} />
      {w > 26 && h > 18 && (
        <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" className="fill-ink font-display text-[15px] font-extrabold">
          {text}
        </text>
      )}
    </g>
  );
}

export function AreaModel({ variant }: { variant: "sum" | "diff" }) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(2);
  const bb = variant === "diff" ? Math.min(b, a - 1) : b;
  const A = a * U,
    B = bb * U;

  return (
    <div className="card-lsn overflow-hidden">
      <div className="border-b-2 border-line bg-sun-soft px-4 py-2 text-sm font-bold text-[#8A5A00]">Kéo thanh trượt để đổi độ dài a, b</div>
      <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_1fr] md:items-center">
        <svg viewBox={`-30 -30 ${variant === "sum" ? 13 * U + 40 : 2 * 9 * U + 70} ${(variant === "sum" ? 13 : 18) * U + 40}`} className="h-auto max-h-96 w-full rounded-2xl bg-paper" role="img" aria-label="Mô hình diện tích">
          {variant === "sum" ? (
            <>
              <Cell x={0} y={0} w={A} h={A} fill={C.a} text="a²" />
              <Cell x={A} y={0} w={B} h={A} fill={C.ab} text="ab" />
              <Cell x={0} y={A} w={A} h={B} fill={C.ab} text="ab" />
              <Cell x={A} y={A} w={B} h={B} fill={C.b} text="b²" />
              <text x={A / 2} y={-10} textAnchor="middle" className="fill-blue-dk text-[14px] font-bold">a</text>
              <text x={A + B / 2} y={-10} textAnchor="middle" className="fill-coral-dk text-[14px] font-bold">b</text>
              <text x={-14} y={A / 2} textAnchor="middle" className="fill-blue-dk text-[14px] font-bold">a</text>
              <text x={-14} y={A + B / 2} textAnchor="middle" className="fill-coral-dk text-[14px] font-bold">b</text>
            </>
          ) : (
            <>
              {/* Trái: hình vuông a bỏ góc b (phần còn lại gồm 2 mảnh) */}
              <Cell x={0} y={0} w={A - B} h={A} fill={C.a} text="" />
              <Cell x={A - B} y={0} w={B} h={A - B} fill={C.ab} text="" />
              <rect x={A - B} y={A - B} width={B} height={B} fill="none" stroke={C.b} strokeWidth={2} strokeDasharray="5 4" />
              <text x={A - B / 2} y={A - B / 2} textAnchor="middle" dominantBaseline="middle" className="fill-coral-dk text-[13px] font-bold">−b²</text>
              <text x={A / 2} y={-10} textAnchor="middle" className="fill-blue-dk text-[14px] font-bold">a</text>
              {/* Phải: ghép mảnh vàng sang → hình chữ nhật (a + b) × (a − b) */}
              <g transform={`translate(${A + 40} 0)`}>
                <Cell x={0} y={0} w={A - B} h={A} fill={C.a} text="" />
                <Cell x={0} y={A} w={A - B} h={B} fill={C.ab} text="" />
                <text x={(A - B) / 2} y={-10} textAnchor="middle" className="fill-ink text-[14px] font-bold">a − b</text>
                <text x={A - B + 26} y={(A + B) / 2} textAnchor="middle" className="fill-ink text-[14px] font-bold">a + b</text>
              </g>
            </>
          )}
        </svg>
        <div className="space-y-3">
          <Slider label="a" value={a} min={2} max={variant === "sum" ? 8 : 9} onChange={setA} color={C.a} />
          <Slider label="b" value={bb} min={1} max={variant === "sum" ? 5 : 8} onChange={setB} color={C.b} />
          {variant === "sum" ? (
            <ul className="space-y-2 text-sm">
              <li className="rounded-xl bg-paper px-3 py-2 font-display text-base font-extrabold">
                (a + b)² = ({a} + {bb})² = {(a + bb) ** 2}
              </li>
              <li className="rounded-xl bg-success-bg px-3 py-2">
                <div className="font-display text-base font-extrabold">
                  a² + 2ab + b² = {a * a} + {2 * a * bb} + {bb * bb} = {a * a + 2 * a * bb + bb * bb}
                </div>
                <T v={bi("The big square = 1 blue square + 2 yellow rectangles + 1 red square.", "Hình vuông lớn = 1 ô vuông xanh + 2 hình chữ nhật vàng + 1 ô vuông đỏ.")} className="text-xs" />
              </li>
            </ul>
          ) : (
            <ul className="space-y-2 text-sm">
              <li className="rounded-xl bg-paper px-3 py-2 font-display text-base font-extrabold">
                a² − b² = {a * a} − {bb * bb} = {a * a - bb * bb}
              </li>
              <li className="rounded-xl bg-success-bg px-3 py-2">
                <div className="font-display text-base font-extrabold">
                  (a + b)(a − b) = {a + bb} · {a - bb} = {(a + bb) * (a - bb)}
                </div>
                <T v={bi("Move the yellow piece: the L-shape becomes a rectangle.", "Chuyển mảnh vàng xuống dưới: hình chữ L thành hình chữ nhật.")} className="text-xs" />
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
