import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Dhruv Bansal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The thumbnail shown when dhruv-b.dev is shared (LinkedIn, Slack, X, ...).
 * The favicon (app/og-favicon.png, taken from app/favicon.ico) is shown at
 * its original 48x48 size — upscaling it to fill the card made it blurry.
 */
export default async function OpengraphImage() {
	const favicon = await readFile(join(process.cwd(), "app/og-favicon.png"));
	const faviconSrc = `data:image/png;base64,${favicon.toString("base64")}`;

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				backgroundColor: "#111111",
				color: "#ffffff",
				padding: "72px 80px",
				fontFamily: "sans-serif",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
				{/* biome-ignore lint/performance/noImgElement: ImageResponse renders to a static image */}
				<img src={faviconSrc} alt="" width={48} height={48} />
				<div
					style={{
						marginTop: 36,
						fontSize: 84,
						fontWeight: 600,
						letterSpacing: "-0.02em",
					}}
				>
					Dhruv Bansal
				</div>
			</div>
			<div style={{ fontSize: 26 }}>dhruv-b.dev</div>
		</div>,
		size,
	);
}
