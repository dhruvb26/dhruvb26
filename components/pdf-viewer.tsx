"use client";

import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { type ReactNode, useCallback, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const PdfDocument = dynamic(() => import("@/components/pdf-document"), {
	ssr: false,
	loading: () => (
		<div className="flex-1 flex items-center justify-center">
			<Spinner />
		</div>
	),
});

function CloseButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group/close size-3.5 rounded-full border border-red-700 bg-red-500 transition-colors hover:bg-red-600 flex items-center justify-center"
		>
			<X
				className="size-2.5 text-red-900/60 opacity-0 group-hover/close:opacity-100 transition-opacity"
				strokeWidth={2.5}
			/>
		</button>
	);
}

export function PdfSplitView({ children }: { children: ReactNode }) {
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);

	const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		const anchor = target.closest("a");
		if (!anchor) return;

		const text = anchor.textContent?.trim();
		if (text === "Report") {
			e.preventDefault();
			e.stopPropagation();
			setPdfUrl(anchor.href);
		}
	}, []);

	if (!pdfUrl) {
		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: event delegation for anchor click interception
			// biome-ignore lint/a11y/useKeyWithClickEvents: event delegation for anchor click interception
			<div className="flex flex-1 min-h-0" onClick={handleClick}>
				{children}
			</div>
		);
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: event delegation for anchor click interception
		// biome-ignore lint/a11y/useKeyWithClickEvents: event delegation for anchor click interception
		<div className="fixed inset-0 flex" onClick={handleClick}>
			<div className="w-1/2 h-full overflow-y-auto [&_main]:mx-auto [&_main]:md:ml-auto! [&_main]:md:mr-auto! [&_main]:pt-24!">
				{children}
			</div>
			<div className="w-1/2 h-full border-l border-border relative flex flex-col">
				<div className="absolute top-3 left-3 z-10">
					<CloseButton
						onClick={(e) => {
							e.stopPropagation();
							setPdfUrl(null);
						}}
					/>
				</div>
				<PdfDocument url={pdfUrl} />
			</div>
		</div>
	);
}
