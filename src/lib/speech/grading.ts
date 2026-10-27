// Chấm câu gõ & chấm phát âm (hàm thuần, có test trong tests/speech.test.ts)
export const norm = (s: unknown) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function lev(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const c = [i];
    for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    p = c;
  }
  return p[n];
}

export const similarity = (a: string, b: string) => 1 - lev(a, b) / Math.max(a.length, b.length, 1);

/** So khớp từng từ giữa câu mẫu và câu nhận được (cho phép sai nhẹ) */
export function matchWords(tw: string[], sw: string[]): boolean[] {
  const n = tw.length,
    m = sw.length;
  const eq = (a: string, b: string) => a === b || (a.length > 3 && similarity(a, b) >= 0.75);
  const d = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) d[i][j] = eq(tw[i - 1], sw[j - 1]) ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
  const ok = new Array<boolean>(n).fill(false);
  let i = n,
    j = m;
  while (i > 0 && j > 0) {
    if (eq(tw[i - 1], sw[j - 1]) && d[i][j] === d[i - 1][j - 1] + 1) {
      ok[i - 1] = true;
      i--;
      j--;
    } else if (d[i - 1][j] >= d[i][j - 1]) i--;
    else j--;
  }
  return ok;
}

export interface SpeechResult {
  score: number;
  ok: boolean[];
  transcript: string;
}

/** Điểm phát âm 0–100 từ các phương án nhận dạng (t = câu, c = độ tin cậy) */
export function scoreSpeech(target: string, alts: { t: string; c?: number }[]): SpeechResult | null {
  const tw = norm(target).split(" ");
  let best: SpeechResult | null = null;
  for (const a of alts) {
    const sw = norm(a.t).split(" ").filter(Boolean);
    const ok = matchWords(tw, sw);
    const ratio = ok.filter(Boolean).length / tw.length;
    const c = a.c && a.c > 0 && a.c <= 1 ? a.c : null;
    const score = Math.round(100 * (c == null ? ratio : 0.85 * ratio + 0.15 * c));
    if (!best || score > best.score) best = { score, ok, transcript: a.t };
  }
  return best;
}

