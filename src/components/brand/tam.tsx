// Linh vật "Tam": tam giác cân màu teal có mắt
import { cn } from "cn";

type Mood = "happy" | "cheer" | "alert" | "calm" | "sleepy";

export function Tam({ mood = "happy", className, title = "Tam" }: { mood?: Mood; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("size-24", className)} role="img" aria-label={title}>
      {/* Bóng dưới chân */}
      <ellipse cx="60" cy="112" rx="38" ry="5" fill="#1C1B3A" opacity="0.12" />
      {/* Thân: tam giác cân bo tròn góc */}
      <path d="M60 12 L108 100 L12 100 Z" fill="#0E9F8A" stroke="#0E9F8A" strokeWidth="12" strokeLinejoin="round" />
      <path d="M12 100 L108 100 L101 88 L19 88 Z" fill="#0A7565" stroke="#0A7565" strokeWidth="12" strokeLinejoin="round" opacity="0.55" />
      {/* Ánh sáng */}
      <path d="M52 34 L38 60" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />

      {mood === "cheer" && (
        <g stroke="#FFC93C" strokeWidth="4" strokeLinecap="round">
          <path d="M18 30 l-8 -6" />
          <path d="M14 46 l-10 0" />
          <path d="M102 30 l8 -6" />
          <path d="M106 46 l10 0" />
        </g>
      )}

      {/* Mắt */}
      {mood === "sleepy" ? (
        <g stroke="#1C1B3A" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M40 66 q6 5 12 0" />
          <path d="M68 66 q6 5 12 0" />
        </g>
      ) : (
        <g className="animate-blink">
          <circle cx="46" cy="64" r={mood === "alert" ? 11 : 9.5} fill="#fff" />
          <circle cx="74" cy="64" r={mood === "alert" ? 11 : 9.5} fill="#fff" />
          <circle cx={mood === "calm" ? 46 : 47.5} cy="65" r="5" fill="#1C1B3A" />
          <circle cx={mood === "calm" ? 74 : 75.5} cy="65" r="5" fill="#1C1B3A" />
          <circle cx="49" cy="62.5" r="1.6" fill="#fff" />
          <circle cx="77" cy="62.5" r="1.6" fill="#fff" />
        </g>
      )}

      {/* Má hồng */}
      {(mood === "happy" || mood === "cheer") && (
        <g fill="#FF8A7A" opacity="0.55">
          <ellipse cx="34" cy="78" rx="5" ry="3" />
          <ellipse cx="86" cy="78" rx="5" ry="3" />
        </g>
      )}

      {/* Miệng */}
      {mood === "happy" && <path d="M51 79 Q60 88 69 79" stroke="#1C1B3A" strokeWidth="4" fill="none" strokeLinecap="round" />}
      {mood === "cheer" && <path d="M49 78 Q60 94 71 78 Z" fill="#1C1B3A" stroke="#1C1B3A" strokeWidth="3" strokeLinejoin="round" />}
      {mood === "alert" && <ellipse cx="60" cy="83" rx="5" ry="6" fill="#1C1B3A" />}
      {mood === "calm" && <path d="M53 81 h14" stroke="#1C1B3A" strokeWidth="4" strokeLinecap="round" />}
      {mood === "sleepy" && <path d="M54 81 Q60 85 66 81" stroke="#1C1B3A" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
