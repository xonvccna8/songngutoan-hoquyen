// GĐ 7 — Biểu tượng ứng dụng (PWA) vẽ từ logo: /icons/192 · /icons/512 · /icons/maskable (Android cắt viền) · /icons/apple (iPhone)
import { ImageResponse } from "next/og";

const ICONS: Record<string, { size: number; pad: number; round: boolean }> = {
  "192": { size: 192, pad: 0, round: true },
  "512": { size: 512, pad: 0, round: true },
  // Android có thể cắt icon thành hình tròn → để lề an toàn 20%, nền kín
  maskable: { size: 512, pad: 0.2, round: false },
  // iPhone tự bo góc → nền kín, không bo
  apple: { size: 180, pad: 0.08, round: false },
};

// 4 hình học của logo (cùng hình với LogoMark), không có nền
const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 32 32">' +
  '<path d="M12 7.5 L17.5 17 H6.5 Z" fill="#E8492E" stroke="#E8492E" stroke-width="1.5" stroke-linejoin="round"/>' +
  '<path d="M28 6.5 L33 12 L28 17.5 L23 12 Z" fill="#2F5BEA"/>' +
  '<circle cx="12" cy="28" r="5.2" fill="#FFC93C"/>' +
  '<rect x="23" y="23" width="10" height="10" rx="2" fill="#0E9F8A"/></svg>';
const SRC = `data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`;

export const dynamic = "force-static";
export const generateStaticParams = () => Object.keys(ICONS).map((name) => ({ name }));

export async function GET(_req: Request, ctx: RouteContext<"/icons/[name]">) {
  const { name } = await ctx.params;
  const ic = ICONS[name];
  if (!ic) return new Response("Not found", { status: 404 });
  const inner = Math.round(ic.size * (1 - 2 * ic.pad) * 0.78);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C1B3A",
          borderRadius: ic.round ? ic.size * 0.3 : 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SRC} width={inner} height={inner} alt="" />
      </div>
    ),
    { width: ic.size, height: ic.size }
  );
}
