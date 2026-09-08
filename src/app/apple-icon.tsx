import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/** Apple touch icon: black logo only (no yellow fill). */
export default async function AppleIcon() {
  const logoSvg = (
    await readFile(
      join(process.cwd(), "public/assets/home/ruben-logo.svg"),
      "utf8",
    )
  ).replaceAll("#212121", "#ffca03");
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={150}
          height={92}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
