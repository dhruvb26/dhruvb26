"use client";

import { Show } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LabControls } from "@/components/lab-controls";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { WikiCategory } from "@/lib/wiki";

function WikiSidebar({ categories }: { categories: WikiCategory[] }) {
	const pathname = usePathname();
	const activeSlug = pathname.replace("/lab/wiki/", "").replace(/\/$/, "");

	return (
		<Sidebar>
			<SidebarContent className="pt-12">
				{categories.map((cat) => (
					<SidebarGroup key={cat.name}>
						<SidebarGroupLabel className="text-xs text-sidebar-foreground/40">
							{cat.name}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{cat.entries.map((entry) => (
									<SidebarMenuItem key={entry.slug}>
										<SidebarMenuButton asChild isActive={activeSlug === entry.slug}>
											<Link href={`/lab/wiki/${entry.slug}`}>
												<span>{entry.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
}

export function WikiShell({
	categories,
	children,
}: {
	categories: WikiCategory[];
	children: React.ReactNode;
}) {
	return (
		<Show when="signed-in" fallback={null}>
			<SidebarProvider>
				<WikiSidebar categories={categories} />
				<SidebarInset className="max-h-dvh flex flex-col overflow-hidden">
					<header className="flex h-12 shrink-0 items-center gap-2 px-4">
						<Link
							href="/lab"
							className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
						>
							<ArrowLeft className="size-4 text-muted-foreground" />
						</Link>
						<SidebarTrigger className="md:hidden" />
					</header>
					<div className="flex-1 overflow-y-auto">{children}</div>
				</SidebarInset>
				<LabControls />
			</SidebarProvider>
		</Show>
	);
}
