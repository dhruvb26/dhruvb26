"use client";

import { Show } from "@clerk/nextjs";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LabControls } from "@/components/lab-controls";
import { Spinner } from "@/components/ui/spinner";
import { useUploadThing } from "@/lib/uploadthing";

interface BoardImage {
	url: string;
	name: string;
	key: string;
	uploadedAt: number;
}

function Gallery({ images, onRemove }: { images: BoardImage[]; onRemove: (key: string) => void }) {
	if (images.length === 0) return null;

	return (
		<div className="flex flex-wrap items-end gap-3">
			{images.map((img) => (
				<div key={img.key} className="group relative overflow-hidden">
					{/* biome-ignore lint/performance/noImgElement: next/image forces fixed dimensions, need intrinsic sizing */}
					<img src={img.url} alt={img.name} className="max-h-96 w-full max-w-3xl object-contain" />
					<button
						type="button"
						onClick={() => onRemove(img.key)}
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
	const [images, setImages] = useState<BoardImage[]>([]);
	const [loading, setLoading] = useState(true);
	const [pageDragging, setPageDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	/** Keys removed in this session; stale list API can still return them until cache catches up. */
	const deletedKeysRef = useRef<Set<string>>(new Set());

	const mergeListWithPrev = useCallback((rawData: BoardImage[], prev: BoardImage[]) => {
		for (const k of deletedKeysRef.current) {
			if (!rawData.some((d) => d.key === k)) {
				deletedKeysRef.current.delete(k);
			}
		}
		const data = rawData.filter((d) => !deletedKeysRef.current.has(d.key));
		const apiKeys = new Set(data.map((d) => d.key));
		const notYetInApi = prev.filter(
			(p) => !(apiKeys.has(p.key) || deletedKeysRef.current.has(p.key)),
		);
		return [...data, ...notYetInApi].sort((a, b) => a.uploadedAt - b.uploadedAt);
	}, []);

	const fetchImages = useCallback(async () => {
		try {
			const res = await fetch(`/api/uploadthing/list?t=${Date.now()}`, { cache: "no-store" });
			if (res.ok) {
				const data: BoardImage[] = await res.json();
				data.sort((a, b) => a.uploadedAt - b.uploadedAt);
				setImages((prev) => mergeListWithPrev(data, prev));
			}
		} catch {
			toast.error("Failed to load images");
		} finally {
			setLoading(false);
		}
	}, [mergeListWithPrev]);

	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	const { startUpload, isUploading } = useUploadThing("boardImages", {
		onClientUploadComplete: (uploaded) => {
			if (uploaded?.length === 0) {
				fetchImages();
				return;
			}
			setImages((prev) => {
				const byKey = new Map(prev.map((p) => [p.key, p]));
				for (const f of uploaded) {
					const sd = f.serverData as { url?: string } | undefined;
					const url = sd?.url ?? f.ufsUrl;
					byKey.set(f.key, {
						key: f.key,
						name: f.name,
						url,
						uploadedAt: Date.now(),
					});
				}
				return Array.from(byKey.values()).sort((a, b) => a.uploadedAt - b.uploadedAt);
			});
			fetchImages();
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

	const handleRemove = async (key: string) => {
		deletedKeysRef.current.add(key);
		setImages((prev) => prev.filter((img) => img.key !== key));
		try {
			const res = await fetch("/api/uploadthing/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key }),
			});
			if (!res.ok) {
				deletedKeysRef.current.delete(key);
				toast.error("Failed to delete image");
				fetchImages();
			}
		} catch {
			deletedKeysRef.current.delete(key);
			toast.error("Failed to delete image");
			fetchImages();
		}
	};

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

				<main className="flex flex-1 w-full max-w-7xl mx-auto md:ml-[8%] md:mr-auto flex-col gap-8 py-16 px-6 sm:px-10 md:px-16 bg-background">
					{loading ? (
						<div className="fixed inset-0 flex items-center justify-center">
							<Spinner className="text-muted-foreground/50" />
						</div>
					) : (
						<Gallery images={images} onRemove={handleRemove} />
					)}
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
				<LabControls />
			</div>
		</Show>
	);
}
