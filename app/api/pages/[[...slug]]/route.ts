import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

export const revalidate = false;

export function generateStaticParams() {
  return source.generateParams();
}

/**
 * Serves the raw MDX content for a docs page. Consumed by the "Copy Page"
 * / "View as Markdown" / "Open in ChatGPT" buttons in the docs header.
 *
 * URL pattern: /api/pages/<slug> → returns `content/docs/<slug>.mdx` verbatim.
 */
export async function GET(_req: Request, props: { params: Promise<{ slug?: string[] }> }) {
  const params = props.params ? await props.params : {};
  const slugs = params.slug ?? [];
  const page = source.getPage(slugs);
  if (!page) notFound();

  const contentRoot = resolve(process.cwd(), "content/docs");
  const base = slugs.length > 0 ? slugs.join("/") : "index";
  const candidates = [
    resolve(contentRoot, `${base}.mdx`),
    resolve(contentRoot, `${base}/index.mdx`),
  ];
  const filePath = candidates.find((c) => existsSync(c));
  if (!filePath) notFound();

  const raw = await readFile(filePath, "utf8");
  return new Response(raw, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
