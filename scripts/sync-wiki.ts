import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const SOURCE = path.join(os.homedir(), "Documents", "Vault", "wiki");
const DEST = path.join(process.cwd(), "content", "wiki");

if (!fs.existsSync(SOURCE)) {
	// biome-ignore lint/suspicious/noConsole: CLI script
	console.warn(`[sync-wiki] source not found at ${SOURCE}, skipping`);
	process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });

for (const existing of fs.readdirSync(DEST)) {
	fs.rmSync(path.join(DEST, existing), { recursive: true });
}

const files = fs.readdirSync(SOURCE);
let count = 0;

for (const file of files) {
	const src = path.join(SOURCE, file);
	if (!fs.statSync(src).isFile()) continue;
	fs.copyFileSync(src, path.join(DEST, file));
	count++;
}

// biome-ignore lint/suspicious/noConsole: CLI script
console.log(`[sync-wiki] synced ${count} files from ${SOURCE} → ${DEST}`);
