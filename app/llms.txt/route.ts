import { source } from "@/lib/source";

const SITE_URL = "https://docs.browsergateway.com";

export const dynamic = "force-static";

export function GET() {
  const pages = source.getPages();

  const rootPage = pages.find((p) => p.slugs.length === 0);
  const otherPages = pages
    .filter((p) => p.slugs.length > 0)
    .sort((a, b) => a.url.localeCompare(b.url));

  const rootTitle = rootPage?.data.title ?? "browser-gateway";
  const rootDescription =
    rootPage?.data.description ??
    "OpenRouter for cloud browsers. Route Puppeteer, Playwright, or AI agent code across any CDP provider.";

  const lines: string[] = [];
  lines.push(`# ${rootTitle}`);
  lines.push("");
  lines.push(`> ${rootDescription}`);
  lines.push("");
  lines.push(
    "browser-gateway is an MIT-licensed gateway you self-host (or use hosted at browsergateway.com). It routes Puppeteer, Playwright, or CDP client traffic across the browser providers you already pay for — Browserless, Steel, Browserbase, Cloudflare Browser Rendering, self-hosted Chrome — behind one endpoint.",
  );
  lines.push("");
  lines.push("## Docs");
  lines.push("");

  for (const page of otherPages) {
    const title = page.data.title ?? page.url;
    const description = page.data.description ?? "";
    const url = `${SITE_URL}${page.url}`;
    if (description) {
      lines.push(`- [${title}](${url}): ${description}`);
    } else {
      lines.push(`- [${title}](${url})`);
    }
  }

  lines.push("");
  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Marketing site](https://browsergateway.com): landing page, pricing, sign-up`,
  );
  lines.push(
    `- [GitHub repo](https://github.com/browser-gateway/browser-gateway): source, issues, discussions`,
  );
  lines.push(
    `- [npm package](https://www.npmjs.com/package/browser-gateway): latest release`,
  );
  lines.push(
    `- [Docker image](https://github.com/browser-gateway/browser-gateway/pkgs/container/server): multi-arch, signed via Sigstore`,
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
