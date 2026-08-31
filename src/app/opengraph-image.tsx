import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Ruben";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/** Link preview: yellow brand background with black logo centered. */
export default async function OpenGraphImage() {
  const logoSvg = await readFile(
    join(process.cwd(), "public/assets/home/ruben-logo.svg"),
    "utf8",
  );
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
          background: "#ffca03",
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={420}
          height={257}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
