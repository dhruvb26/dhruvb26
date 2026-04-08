import { cacheLife, cacheTag } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "heic", "bmp"]);

function isImage(name: string) {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	return IMAGE_EXTS.has(ext);
}

function getAppId() {
	const token = process.env.UPLOADTHING_TOKEN;
	if (!token) throw new Error("UPLOADTHING_TOKEN is not set");
	const { appId } = JSON.parse(Buffer.from(token, "base64").toString());
	return appId as string;
}

export async function getBoardImages() {
	"use cache";
	cacheTag("board-images");
	cacheLife("minutes");

	const appId = getAppId();
	const { files } = await utapi.listFiles();
	const imageFiles = files.filter((f) => isImage(f.name));

	return imageFiles.map((f) => ({
		key: f.key,
		name: f.name,
		url: `https://${appId}.ufs.sh/f/${f.key}`,
	}));
}
