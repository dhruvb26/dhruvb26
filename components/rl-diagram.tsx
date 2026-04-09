"use client";

import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { useState } from "react";

type Plane = {
	id: string;
	label: string;
	x: number;
	y: number;
	w: number;
	h: number;
	expandDelay: number;
	collapseY: number;
};

function diamond(x: number, y: number, w: number, h: number, r = 8) {
	const cx = x + w / 2;
	const cy = y + h / 2;
	const hw = w / 2;
	const hh = h / 2;
	const edgeLen = Math.sqrt(hw * hw + hh * hh);
	const t = r / edgeLen;
	const thw = t * hw;
	const thh = t * hh;

	return [
		`M${x + thw},${cy - thh}`,
		`L${cx - thw},${y + thh}`,
		`Q${cx},${y} ${cx + thw},${y + thh}`,
		`L${x + w - thw},${cy - thh}`,
		`Q${x + w},${cy} ${x + w - thw},${cy + thh}`,
		`L${cx + thw},${y + h - thh}`,
		`Q${cx},${y + h} ${cx - thw},${y + h - thh}`,
		`L${x + thw},${cy + thh}`,
		`Q${x},${cy} ${x + thw},${cy - thh}`,
		"Z",
	].join(" ");
}

const CX = 196;
const STACK_Y = 246;
const PLANE_COUNT = 3;

const PLANES: Plane[] = [
	{
		id: "policy",
		label: "policy grid [ π(s) ]",
		x: 68,
		y: 66,
		w: 256,
		h: 92,
		expandDelay: 0.04,
		collapseY: STACK_Y - 3 - 106,
	},
	{
		id: "value",
		label: "value grid [ v(s) ]",
		x: 68,
		y: 180,
		w: 256,
		h: 92,
		expandDelay: 0.1,
		collapseY: STACK_Y - 226,
	},
	{
		id: "env",
		label: "env plane [ ε ]",
		x: 68,
		y: 410,
		w: 256,
		h: 92,
		expandDelay: 0.16,
		collapseY: STACK_Y + -3 - 456,
	},
];

const GUIDE_LINES = [
	{ x1: 68, y1: 112, x2: 68, y2: 226 },
	{ x1: 324, y1: 112, x2: 324, y2: 226 },
	{ x1: 68, y1: 226, x2: 68, y2: 456 },
	{ x1: 324, y1: 226, x2: 324, y2: 316 },
	{ x1: 324, y1: 366, x2: 324, y2: 456 },
];

const spring = { type: "spring" as const, stiffness: 150, damping: 20 };
const dashFlow = {
	duration: 1.8,
	ease: "linear" as const,
	repeat: Number.POSITIVE_INFINITY,
};
const noTransition = { duration: 0 };

const CSS = `
.rl-d .ln{fill:none;stroke:var(--link);stroke-width:.75;opacity:.55}
.rl-d .lb{font-family:var(--font-mono);font-size:7px;letter-spacing:.5px;text-transform:uppercase;fill:var(--link)}
.rl-d .mt{font-family:var(--font-mono);font-size:7px;letter-spacing:.5px;text-transform:uppercase;fill:var(--link);opacity:.7}
`;

function FadeGroup({
	expanded,
	delay = 0,
	children,
}: PropsWithChildren<{ expanded: boolean; delay?: number }>) {
	return (
		<motion.g
			initial={{ opacity: 0 }}
			animate={{ opacity: expanded ? 1 : 0 }}
			transition={{ duration: 0.3, delay: expanded ? delay : 0 }}
		>
			{children}
		</motion.g>
	);
}

function FlowingLine({
	expanded,
	x1,
	y1,
	x2,
	y2,
	dash = 8,
	gap = 10,
	flowDuration = 1.8,
}: {
	expanded: boolean;
	x1: number | string;
	y1: number | string;
	x2: number | string;
	y2: number | string;
	dash?: number;
	gap?: number;
	flowDuration?: number;
}) {
	return (
		<motion.line
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			className="ln"
			strokeDasharray={`${dash} ${gap}`}
			animate={{ strokeDashoffset: expanded ? -(dash + gap) : 0 }}
			transition={expanded ? { ...dashFlow, duration: flowDuration } : noTransition}
		/>
	);
}

function DiamondPlane({
	plane,
	index,
	expanded,
}: {
	plane: Plane;
	index: number;
	expanded: boolean;
}) {
	const isFilled = expanded && plane.id === "value";
	const roundedPath = diamond(plane.x, plane.y, plane.w, plane.h, 8);
	const sharpPath = diamond(plane.x, plane.y, plane.w, plane.h, 0);
	return (
		<motion.g
			initial={{ y: plane.collapseY }}
			animate={{ y: expanded ? 0 : plane.collapseY }}
			transition={{
				...spring,
				delay: expanded ? plane.expandDelay : (PLANE_COUNT - 1 - index) * 0.03,
			}}
		>
			<motion.path
				initial={{ d: roundedPath }}
				animate={{ d: expanded ? sharpPath : roundedPath }}
				transition={{ duration: 0.35, ease: "easeInOut" }}
				fill={isFilled ? "var(--link)" : "var(--background)"}
				fillOpacity={isFilled ? 0.2 : 1}
				stroke="var(--link)"
				strokeWidth="0.75"
				strokeOpacity={0.7}
			/>
			<motion.text
				x="372"
				y={plane.y + plane.h / 2 + 3}
				className="lb"
				textLength="96"
				lengthAdjust="spacingAndGlyphs"
				initial={{ opacity: 0 }}
				animate={{ opacity: expanded ? 1 : 0 }}
				transition={{
					duration: 0.25,
					delay: expanded ? 0.4 + index * 0.06 : 0,
				}}
			>
				{plane.label}
			</motion.text>
		</motion.g>
	);
}

export function RLDiagram() {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="relative w-full max-w-[600px]">
			<button
				type="button"
				className="flex h-full w-full items-center justify-center overflow-hidden bg-transparent p-0 text-left"
				onClick={() => setExpanded((v) => !v)}
				aria-label={
					expanded
						? "collapse reinforcement learning diagram"
						: "expand reinforcement learning diagram"
				}
			>
				<svg
					viewBox="0 0 500 620"
					className="rl-d h-auto w-full select-none"
					fill="none"
					role="img"
					aria-label="reinforcement learning blueprint diagram"
				>
					<style>{CSS}</style>

					<motion.g
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
					>
						<text x="28" y="50" className="lb" transform="rotate(90 28 50)">
							fig_001
						</text>
					</motion.g>

					<motion.g
						initial={{ opacity: 0 }}
						animate={{ opacity: expanded ? 0 : 1 }}
						transition={{ duration: 0.2 }}
					>
						<text x={CX} y={STACK_Y + 86} className="mt" textAnchor="middle">
							click me
						</text>
					</motion.g>

					<FadeGroup expanded={expanded} delay={0.42}>
						<text x="80" y="48" className="mt">
							agent stack
						</text>
						<text x="80" y="398" className="mt">
							environment
						</text>
					</FadeGroup>

					<FadeGroup expanded={expanded} delay={0.5}>
						{GUIDE_LINES.map((l) => (
							<FlowingLine key={`${l.x1}-${l.y1}-${l.y2}`} expanded={expanded} {...l} />
						))}
					</FadeGroup>

					{PLANES.map((p, i) => (
						<DiamondPlane key={p.id} plane={p} index={i} expanded={expanded} />
					))}

					<FadeGroup expanded={expanded} delay={0.56}>
						<line x1={CX} y1="158" x2={CX} y2="180" className="ln" />
					</FadeGroup>

					<FadeGroup expanded={expanded} delay={0.64}>
						<line x1={CX} y1="272" x2={CX} y2="410" className="ln" />
						<polygon points="208,339 212,342 208,345" fill="var(--link)" opacity="0.8" />
						<text x="216" y="345" className="lb" textLength="132" lengthAdjust="spacingAndGlyphs">
							interaction [ a_t, r_t, s_t+1 ]
						</text>
					</FadeGroup>

					<FadeGroup expanded={expanded} delay={0.74}>
						<text x={CX} y="568" textAnchor="middle" className="mt">
							feedback · policy update manifold
						</text>
					</FadeGroup>
				</svg>
			</button>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: expanded ? 1 : 0 }}
				transition={{ duration: 0.25, delay: expanded ? 0.85 : 0 }}
				className="pointer-events-none absolute right-0 bottom-0 max-w-[180px] text-right text-base text-foreground"
			>
				<span className="pointer-events-auto text-muted-foreground text-base">
					vibe coded taking inspiration from{" "}
					<a
						href="https://makingsoftware.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-link transition-colors duration-300 ease-out hover:text-link/80"
					>
						makingsoftware.com
					</a>
				</span>
			</motion.div>
		</div>
	);
}