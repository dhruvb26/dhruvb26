import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
	return <Loader className={cn("size-4 animate-spin", className)} />;
}
