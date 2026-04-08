import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "heic", "bmp"]);

function isImage(name: string) {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	return IMAGE_EXTS.has(ext);
}

export const dynamic = "force-dynamic";

export async function GET() {
	const { files } = await utapi.listFiles();
	const imageFiles = files.filter((f) => isImage(f.name));
	if (imageFiles.length === 0) return Response.json([]);

	const keys = imageFiles.map((f) => f.key);
	const { data: urls } = await utapi.getFileUrls(keys);
	const urlMap = new Map(urls.map((u) => [u.key, u.url]));

	const images = imageFiles.map((f) => ({
		key: f.key,
		name: f.name,
		url: urlMap.get(f.key) ?? "",
	}));

	return Response.json(images);
}
