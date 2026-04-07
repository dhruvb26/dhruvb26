"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Spinner } from "@/components/ui/spinner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfDocument({ url }: { url: string }) {
	const [numPages, setNumPages] = useState(0);
	const [width, setWidth] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setNumPages(0);
		containerRef.current?.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			const w = entries[0]?.contentRect.width;
			if (w) setWidth(w);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={containerRef} className="flex-1 overflow-y-auto overscroll-contain">
			<Document
				file={url}
				onLoadSuccess={({ numPages: n }) => setNumPages(n)}
				loading={
					<div className="flex items-center justify-center h-64">
						<Spinner />
					</div>
				}
				error={
					<div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
						Failed to load PDF.
					</div>
				}
			>
				{width > 0 &&
					Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
						<div
							key={`${url}-page-${pageNum}`}
							className="border-b border-border last:border-b-0 dark:invert dark:hue-rotate-180"
						>
							<Page pageNumber={pageNum} width={width} renderAnnotationLayer={false} />
						</div>
					))}
			</Document>
		</div>
	);
}
