import { ImageResponse } from "next/og";
import { OG_COLORS, OgMark } from "@/components/brand-logo";

/**
 * The home-screen icon. iOS composites it opaque and applies its own corner
 * mask, so the mark sits on a near-black plate with room to be clipped rather
 * than bleeding to the edge.
 */
export const alt = "design-eg";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: size.width,
        height: size.height,
        alignItems: "center",
        justifyContent: "center",
        background: OG_COLORS.background,
      }}
    >
      <OgMark size={128} />
    </div>,
    { ...size },
  );
}
