import { Spinner } from "@/components/ui/spinner";

export default function WikiLoading() {
	return (
		<div className="flex items-center justify-center h-full">
			<Spinner className="text-muted-foreground/50" />
		</div>
	);
}
