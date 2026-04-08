import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
	const { key } = await req.json();
	if (!key || typeof key !== "string") {
		return Response.json({ error: "Missing key" }, { status: 400 });
	}

	await utapi.deleteFiles(key);
	return Response.json({ success: true });
}
