// Hình vẽ của tiết Tam giác cân — các nhóm hiện dần theo bước (step) giống bản mẫu
import type { FigureId, Lang } from "@/lib/live/types";

interface Props {
  step: number;
  lang: Lang;
  labels?: { top?: string; left?: string };
  className?: string;
}

/** Nhóm hiện khi bước hiện tại ≥ s */
function G({ s, step, children }: { s: number; step: number; children: React.ReactNode }) {
  return (
    <g className="transition-opacity duration-500" style={{ opacity: step >= s ? 1 : 0 }}>
      {children}
    </g>
  );
}

/** Tam giác "tự vẽ" ra khi tới bước s */
function DrawTri({ s, step }: { s: number; step: number }) {
  const on = step >= s;
  return (
    <path
      d={TRI}
      fill="none"
      stroke="var(--chalk)"
      strokeWidth="4"
      strokeLinejoin="round"
      strokeDasharray="1400"
      className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-[1300ms]"
      style={{ strokeDashoffset: on ? 0 : 1400 }}
    />
  );
}

/** Nhãn song ngữ trong hình: chữ Anh thẳng, chữ Việt nghiêng mờ */
function Lbl({ x, y, en, vi, lang, anchor }: { x: number; y: number; en: string; vi: string; lang: Lang; anchor?: "start" | "middle" | "end" }) {
  return (
    <>
      {lang !== "vi" && (
        <text x={x} y={y} textAnchor={anchor} fontSize="26" fill="var(--chalk)">
          {en}
        </text>
      )}
      {lang !== "en" && (
        <text x={x} y={lang === "vi" ? y : y + 24} textAnchor={anchor} fontSize={lang === "vi" ? 26 : 19} fill={lang === "vi" ? "var(--chalk)" : "var(--chalk-dim)"} fontStyle={lang === "vi" ? "normal" : "italic"}>
          {vi}
        </text>
      )}
    </>
  );
}

const ABC = (
  <g fill="var(--chalk)" fontSize="30" fontWeight="600">
    <text x="342" y="28">A</text>
    <text x="140" y="348">B</text>
    <text x="540" y="348">C</text>
  </g>
);
const TRI = "M350 40 L170 320 L530 320 Z";
const TICKS = (
  <g stroke="var(--hi)" strokeWidth="4">
    <line x1="250" y1="173.5" x2="270" y2="186.5" />
    <line x1="430" y1="186.5" x2="450" y2="173.5" />
  </g>
);

function TriDef({ step, lang, className }: Props) {
  return (
    <svg viewBox="0 0 700 390" className={className} role="img" aria-label="Isosceles triangle ABC with AB = AC">
      <DrawTri s={0} step={step} />
      <G s={0} step={step}>{ABC}</G>
      <G s={1} step={step}>
        {TICKS}
        <text x="350" y="215" textAnchor="middle" fontSize="26" fill="var(--hi)">
          AB = AC
        </text>
      </G>
      <G s={2} step={step}>
        <Lbl x={236} y={160} en="leg" vi="cạnh bên" lang={lang} anchor="end" />
        <Lbl x={464} y={160} en="leg" vi="cạnh bên" lang={lang} />
      </G>
      <G s={3} step={step}>
        <line x1="170" y1="320" x2="530" y2="320" stroke="var(--hi)" strokeWidth="6" />
        <Lbl x={350} y={352} en="base" vi="cạnh đáy" lang={lang} anchor="middle" />
      </G>
      <G s={4} step={step}>
        <path d="M328.4 73.6 A40 40 0 0 0 371.6 73.6" fill="none" stroke="var(--hi)" strokeWidth="4" />
        <Lbl x={392} y={72} en="vertex angle" vi="góc ở đỉnh" lang={lang} />
      </G>
      <G s={5} step={step}>
        <path d="M189.5 289.7 A36 36 0 0 1 206 320" fill="none" stroke="var(--hi)" strokeWidth="4" />
        <path d="M510.5 289.7 A36 36 0 0 0 494 320" fill="none" stroke="var(--hi)" strokeWidth="4" />
        <Lbl x={152} y={262} en="base angle" vi="góc ở đáy" lang={lang} anchor="end" />
        <Lbl x={548} y={262} en="base angle" vi="góc ở đáy" lang={lang} />
      </G>
    </svg>
  );
}

function TriMini({ labels, className }: Props) {
  return (
    <svg viewBox="0 0 700 360" className={className} role="img" aria-label="Triangle ABC">
      <path d={TRI} fill="none" stroke="var(--chalk)" strokeWidth="4" strokeLinejoin="round" />
      {TICKS}
      {ABC}
      {labels?.top && (
        <text x="350" y="112" textAnchor="middle" fontSize="28" fill="var(--hi)">
          {labels.top}
        </text>
      )}
      {labels?.left && (
        <text x="215" y="300" fontSize="28" fill="var(--hi)">
          {labels.left}
        </text>
      )}
    </svg>
  );
}

function TriFold({ step, className }: Props) {
  return (
    <svg viewBox="0 0 700 390" className={className} role="img" aria-label="Folding the triangle along AD">
      <defs>
        <marker id="lsn-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--hi)" />
        </marker>
      </defs>
      <DrawTri s={0} step={step} />
      <G s={0} step={step}>{ABC}</G>
      <G s={1} step={step}>
        <line x1="350" y1="40" x2="350" y2="320" stroke="var(--chalk)" strokeWidth="3" strokeDasharray="10 9" />
        <text x="342" y="352" fontSize="28" fontWeight="600" fill="var(--chalk)">
          D
        </text>
        <path d="M250 245 Q350 160 450 245" fill="none" stroke="var(--hi)" strokeWidth="4" markerEnd="url(#lsn-ah)" />
      </G>
      <G s={3} step={step}>
        <path d="M189.5 289.7 A36 36 0 0 1 206 320" fill="var(--hi)" fillOpacity=".25" stroke="var(--hi)" strokeWidth="4" />
        <path d="M510.5 289.7 A36 36 0 0 0 494 320" fill="var(--hi)" fillOpacity=".25" stroke="var(--hi)" strokeWidth="4" />
        <text x="350" y="385" textAnchor="middle" fontSize="30" fontWeight="600" fill="var(--hi)">
          ∠B = ∠C
        </text>
      </G>
    </svg>
  );
}

/** Nhà rông cách điệu */
function Roof({ className }: Props) {
  const hatch: React.ReactNode[] = [];
  for (let y = 72; y <= 240; y += 21) {
    const hw = ((y - 30) / 220) * 170 - 6;
    hatch.push(<line key={y} x1={350 - hw} y1={y} x2={350 + hw} y2={y} />);
  }
  return (
    <svg viewBox="0 0 700 380" className={className} role="img" aria-label="Rông house with a tall triangular roof">
      <path d="M350 30 L180 250 L520 250 Z" fill="var(--board-2)" stroke="var(--hi)" strokeWidth="5" strokeLinejoin="round" />
      <g stroke="var(--hi)" strokeOpacity=".35" strokeWidth="2">
        {hatch}
      </g>
      <rect x="235" y="250" width="230" height="58" fill="none" stroke="var(--chalk)" strokeWidth="4" />
      <g stroke="var(--chalk)" strokeWidth="4">
        <line x1="255" y1="308" x2="255" y2="352" />
        <line x1="315" y1="308" x2="315" y2="352" />
        <line x1="385" y1="308" x2="385" y2="352" />
        <line x1="445" y1="308" x2="445" y2="352" />
      </g>
      <line x1="150" y1="352" x2="550" y2="352" stroke="var(--chalk-dim)" strokeWidth="3" />
    </svg>
  );
}

export function Figure({ id, ...p }: Props & { id: FigureId }) {
  switch (id) {
    case "tri-def":
      return <TriDef {...p} />;
    case "tri-mini":
      return <TriMini {...p} />;
    case "tri-fold":
      return <TriFold {...p} />;
    case "roof":
      return <Roof {...p} />;
  }
}
