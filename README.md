# browser-gateway docs

Public documentation site for browser-gateway. Deploys to `docs.browsergateway.com`.

Built with [Fumadocs](https://fumadocs.dev) on Next.js 15 + MDX + Tailwind 4.

## Develop

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Content

MDX pages live in `content/docs/`. Add a page:

1. Create `content/docs/<slug>.mdx` with frontmatter (`title`, `description`)
2. Add the slug to `content/docs/meta.json` in the `pages` array (order matters for sidebar)
3. Save; hot-reload picks it up

For nested groups, create `content/docs/<group>/meta.json` with its own title + pages.

## Deploy

The `main` branch auto-deploys to `docs.browsergateway.com` via Vercel:

1. Import this folder as a Vercel project (once)
2. Set custom domain to `docs.browsergateway.com`
3. Every push to `main` triggers a build

Manual deploy from CLI:

```bash
npx vercel --prod
```

## Structure

```
docs/
├── app/                      Next.js app router
│   ├── (home)/page.tsx       Landing page
│   ├── docs/                 Docs routes
│   │   ├── layout.tsx        Sidebar layout
│   │   └── [[...slug]]/page.tsx
│   ├── api/search/route.ts   Orama search endpoint
│   ├── global.css            Tailwind + Fumadocs styles
│   └── layout.tsx            Root layout
├── content/docs/             MDX content
├── lib/source.ts             Content loader
├── mdx-components.tsx        MDX overrides
├── source.config.ts          fumadocs-mdx config
├── next.config.mjs           Next + fumadocs-mdx plugin
└── vercel.json               Vercel deploy hints
```
