<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Build & Deploy Pipeline

Wiki content lives in `~/Documents/Vault/wiki` (Obsidian vault) and is **not** committed to the repo. The deploy flow builds locally and pushes prebuilt output to Vercel.

### Steps

1. **Lint** — `bun run lint` (biome). Fix any errors before proceeding.
2. **Commit & push** — stage changes, commit with conventional commits (lowercase), `git push`.
3. **Build** — `bun run build` (runs `scripts/sync-wiki.ts` to copy vault → `content/wiki/`, then `next build`). All wiki pages are statically generated.
4. **Deploy** — `vercel deploy --prebuilt --prod` uploads the local build to Vercel production.

If Vercel project settings aren't cached locally yet, run `vercel pull --yes --environment production` first.

### Quick reference

```sh
bun run lint
git add . && git commit -m "feat(scope): description" && git push
bun run build
vercel deploy --prebuilt --prod
```

### Notes

- `content/wiki/` is gitignored — never committed, always synced from vault at build time.
- `scripts/sync-wiki.ts` exits gracefully if the vault directory is missing.
- `lib/wiki.ts` reads from `content/wiki/` (relative to project root via `process.cwd()`).
- Wiki article pages use `generateStaticParams` so all slugs are prerendered at build time.
