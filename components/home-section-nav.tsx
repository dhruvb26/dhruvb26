"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
	{ id: "me", label: "Me" },
	{ id: "projects", label: "Projects" },
	{ id: "wiki", label: "Wiki" },
] as const;

function revealProject(id: string) {
	const element = document.getElementById(id);
	if (element instanceof HTMLDetailsElement) element.open = true;
	element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomeSectionNav() {
	const [activeSection, setActiveSection] = useState("me");

	useEffect(() => {
		let frame: number | null = null;

		function updateActiveSection() {
			frame = null;
			const marker = window.innerHeight * 0.35;
			let active: (typeof sections)[number]["id"] = sections[0].id;

			for (const section of sections) {
				const element = document.getElementById(section.id);
				if (element && element.getBoundingClientRect().top <= marker) active = section.id;
			}
			setActiveSection(active);
		}

		function scheduleUpdate() {
			if (frame === null) frame = requestAnimationFrame(updateActiveSection);
		}

		updateActiveSection();
		window.addEventListener("scroll", scheduleUpdate, { passive: true });
		window.addEventListener("resize", scheduleUpdate);
		return () => {
			window.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			if (frame !== null) cancelAnimationFrame(frame);
		};
	}, []);

	useEffect(() => {
		function openLinkedProject(event: MouseEvent) {
			if (!(event.target instanceof Element)) return;
			const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#project-"]');
			if (!anchor) return;
			const id = anchor.hash.slice(1);
			if (!document.getElementById(id)) return;
			event.preventDefault();
			history.replaceState(null, "", anchor.hash);
			revealProject(id);
		}

		document.addEventListener("click", openLinkedProject);
		if (window.location.hash.startsWith("#project-")) {
			requestAnimationFrame(() => revealProject(window.location.hash.slice(1)));
		}
		return () => document.removeEventListener("click", openLinkedProject);
	}, []);

	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	return (
		<nav
			aria-label="Page sections"
			className="fixed right-5 top-5 z-40 rounded-full bg-background/80 p-1.5 backdrop-blur sm:right-8 sm:top-8"
		>
			<div className="flex flex-col items-end gap-1">
				{sections.map((section) => (
					<button
						key={section.id}
						type="button"
						onClick={() => scrollTo(section.id)}
						aria-label={`Scroll to ${section.label}`}
						aria-current={activeSection === section.id ? "location" : undefined}
						className="group flex size-4 items-center justify-center"
					>
						<span
							className={cn(
								"h-[3px] rounded-full transition-all duration-200",
								activeSection === section.id
									? "w-4 bg-muted-foreground/60"
									: "w-3 bg-muted-foreground/30 group-hover:w-3.5 group-hover:bg-muted-foreground/45",
							)}
						/>
					</button>
				))}
			</div>
		</nav>
	);
}
