import { getBoardImages } from "@/lib/board";

export async function GET() {
	const images = await getBoardImages();
	return Response.json(images);
}
