import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (_req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "1GB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);

			if (!user) throw new UploadThingError("Unauthorized");

			return { userId: user.id };
		})
		.onUploadComplete(({ metadata }) => {
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
