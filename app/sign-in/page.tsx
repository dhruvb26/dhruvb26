"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function SignInPage() {
	const { signIn, errors, fetchStatus } = useSignIn();
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		const identifier = formData.get("username") as string;
		const password = formData.get("password") as string;

		try {
			const { error } = await signIn.password({
				identifier,
				password,
			});

			if (error) {
				toast.error(error.message ?? "sign in failed");
				return;
			}

			if (signIn.status === "complete") {
				await signIn.finalize({
					navigate: ({ session, decorateUrl }) => {
						if (session?.currentTask) return;

						const url = decorateUrl("/");
						if (url.startsWith("http")) {
							window.location.href = url;
						} else {
							router.push(url);
						}
					},
				});
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "something went wrong");
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center p-12">
			<div className="w-full max-w-xs space-y-6">
				<form action={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<Input
							name="username"
							type="text"
							placeholder="username"
							required
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
							data-1p-ignore
							data-lpignore="true"
							data-form-type="other"
						/>
						{errors?.fields?.identifier && (
							<p className="msg-error">{errors.fields.identifier.message}</p>
						)}
					</div>

					<div className="space-y-1.5">
						<Input
							name="password"
							type="password"
							placeholder="password"
							required
							autoComplete="off"
							data-1p-ignore
							data-lpignore="true"
							data-form-type="other"
						/>
						{errors?.fields?.password && (
							<p className="msg-error">{errors.fields.password.message}</p>
						)}
					</div>

					<Button
						type="submit"
						size="default"
						disabled={fetchStatus === "fetching"}
						className="w-full"
					>
						{fetchStatus === "fetching" ? <Spinner /> : "continue"}
					</Button>
				</form>

				{errors?.global && <p className="msg-error">{errors.global[0]?.message}</p>}
			</div>
		</main>
	);
}
