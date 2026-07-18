# browser-gateway docs

Source for [docs.browsergateway.com](https://docs.browsergateway.com).

Built with [Fumadocs](https://fumadocs.dev) on Next.js 16, MDX, Tailwind 4.

## Develop

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Content

MDX pages live in `content/docs/`. To add a page:

1. Create `content/docs/<slug>.mdx` with frontmatter (`title`, `description`).
2. Add the slug to `content/docs/meta.json` in the `pages` array (order controls the sidebar).
3. Save. Hot reload picks it up.

For a nested group, create `content/docs/<group>/meta.json` with its own title + pages.

## Lint

```bash
npm run lint
```

Fails on em-dashes, marketing fluff (`just`, `simply`, `awesome`, `powerful`, ...), and casual narrator voice. See `scripts/lint-style.mjs` for the full rule set.

## Structure

```
docs/
├── app/
│   ├── [[...slug]]/page.tsx    All docs pages (root = Introduction)
│   ├── api/pages/[[...slug]]   Raw MDX endpoint (Copy Page consumes this)
│   ├── api/search/route.ts     Orama search endpoint
│   ├── icon.png                Favicon
│   ├── apple-icon.png          iOS home-screen icon
│   ├── robots.ts               robots.txt
│   ├── sitemap.ts              sitemap.xml
│   ├── global.css              Tailwind + Fumadocs styles
│   └── layout.tsx              Root layout (nav, sidebar, metadata)
├── components/
│   └── copy-page-actions.tsx   Custom split-button + LLM dropdown
├── content/docs/               MDX pages + meta.json for sidebar
├── lib/source.ts               Content loader (baseUrl = "/")
├── mdx-components.tsx          MDX component overrides
├── scripts/lint-style.mjs      Style linter
└── source.config.ts            fumadocs-mdx config
```
