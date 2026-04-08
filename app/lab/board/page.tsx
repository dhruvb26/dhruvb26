"use client";

import { Show } from "@clerk/nextjs";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useUploadThing } from "@/lib/uploadthing";

interface BoardImage {
	url: string;
	name: string;
	key: string;
}

const STORAGE_KEY = "board-images";

function getStoredImages(): BoardImage[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function storeImages(images: BoardImage[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

function Gallery({ images, onRemove }: { images: BoardImage[]; onRemove: (url: string) => void }) {
	if (images.length === 0) return null;

	return (
		<div className="columns-2 sm:columns-3 gap-3 space-y-3">
			{images.map((img) => (
				<div key={img.url} className="group relative break-inside-avoid overflow-hidden">
					{/* biome-ignore lint/performance/noImgElement: next/image forces fixed dimensions, need intrinsic sizing */}
					<img src={img.url} alt={img.name} className="w-full h-auto" />
					<button
						type="button"
						onClick={() => onRemove(img.url)}
						className="group/close absolute top-1.5 left-1.5 size-3.5 rounded-full border border-red-700 bg-red-500 hover:bg-red-600 flex items-center justify-center opacity-0 transition-all group-hover:opacity-100"
					>
						<X
							className="size-2.5 text-red-900/60 opacity-0 group-hover/close:opacity-100 transition-opacity"
							strokeWidth={2.5}
						/>
					</button>
				</div>
			))}
		</div>
	);
}

export default function BoardPage() {
	const [images, setImages] = useState<BoardImage[]>(getStoredImages);
	const [pageDragging, setPageDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const { startUpload, isUploading } = useUploadThing("boardImages", {
		onClientUploadComplete: (res) => {
			const uploaded = res.map((r) => ({
				url: r.ufsUrl ?? r.url,
				name: r.name,
				key: r.key,
			}));
			setImages((prev) => {
				const updated = [...uploaded, ...prev];
				storeImages(updated);
				return updated;
			});
		},
		onUploadError: (err) => {
			toast.error(err.message);
		},
	});

	const handleFiles = useCallback(
		(files: FileList | File[]) => {
			const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
			if (imageFiles.length === 0) {
				toast.error("No image files selected");
				return;
			}
			startUpload(imageFiles);
		},
		[startUpload],
	);

	const handleRemove = (url: string) => {
		const image = images.find((img) => img.url === url);
		setImages((prev) => {
			const updated = prev.filter((img) => img.url !== url);
			storeImages(updated);
			return updated;
		});
		if (image?.key) {
			fetch("/api/uploadthing/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key: image.key }),
			}).catch(() => toast.error("Failed to delete from storage"));
		}
	};

	const hasImages = images.length > 0;

	return (
		<Show when="signed-in" fallback={null}>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: page-level drag-and-drop target */}
			<div
				className="flex flex-col flex-1 bg-background min-h-screen relative"
				onDragOver={(e) => {
					e.preventDefault();
					setPageDragging(true);
				}}
				onDragLeave={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget as Node)) setPageDragging(false);
				}}
				onDrop={(e) => {
					e.preventDefault();
					setPageDragging(false);
					if (e.dataTransfer.files.length > 0) {
						handleFiles(e.dataTransfer.files);
					}
				}}
			>
				{pageDragging && (
					<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
						<p className="text-base text-muted-foreground">drop to upload</p>
					</div>
				)}
				<Link
					href="/lab"
					className="fixed top-3 left-3 z-10 size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
				>
					<ArrowLeft className="size-4 text-muted-foreground" />
				</Link>

				<main className="flex flex-1 w-full max-w-4xl mx-auto md:ml-[10%] md:mr-auto flex-col gap-8 py-16 px-6 sm:px-10 md:px-16 bg-background">
					{hasImages ? <Gallery images={images} onRemove={handleRemove} /> : null}
				</main>

				<div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
					{isUploading ? (
						<Spinner className="size-3.5 text-muted-foreground/50" />
					) : (
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="text-base text-muted-foreground/50 hover:text-muted-foreground transition-colors"
						>
							drop images here
						</button>
					)}
				</div>

				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					multiple
					className="hidden"
					onChange={(e) => {
						if (e.target.files) handleFiles(e.target.files);
						e.target.value = "";
					}}
				/>
			</div>
		</Show>
	);
}
