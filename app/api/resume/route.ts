export async function GET() {
	const docId = process.env.GOOGLE_RESUME_DOC_ID;
	if (!docId) {
		return new Response("Resume not configured", { status: 500 });
	}

	const res = await fetch(`https://docs.google.com/document/d/${docId}/export?format=pdf`);

	if (!res.ok) {
		return new Response("Failed to fetch resume", { status: 502 });
	}

	return new Response(res.body, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": 'attachment; filename="Dhruv_Bansal_Resume.pdf"',
			"Cache-Control": "public, max-age=3600",
		},
	});
}
