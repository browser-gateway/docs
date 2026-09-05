import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { source } from "@/lib/source";

const SITE_URL = "https://docs.browsergateway.com";
const SITE_NAME = "BrowserGateway docs";
const DESCRIPTION =
  "OpenRouter for cloud browsers. One endpoint, any provider: failover, persistent profiles, session replay, REST API, MCP server, dashboard.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | BrowserGateway docs",
  },
  description: DESCRIPTION,
  applicationName: "BrowserGateway",
  keywords: [
    "browser automation",
    "puppeteer",
    "playwright",
    "cdp",
    "chrome devtools protocol",
    "browserless",
    "steel",
    "browserbase",
    "cloudflare browser rendering",
    "ai agent browser",
    "browser gateway",
    "session replay",
    "profile persistence",
    "mcp server",
    "browser routing",
  ],
  authors: [{ name: "BrowserGateway" }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BrowserGateway" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <DocsLayout
            tree={source.pageTree}
            nav={{
              title: (
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={22}
                    height={22}
                    className="rounded-sm"
                    priority
                  />
                  <span>BrowserGateway</span>
                </span>
              ),
              url: "/",
            }}
            links={[
              {
                text: "Home",
                url: "https://browsergateway.com",
                external: true,
              },
              {
                text: "Pricing",
                url: "https://browsergateway.com/pricing/",
                external: true,
              },
              {
                text: "Dashboard",
                url: "https://app.browsergateway.com",
                external: true,
              },
            ]}
            githubUrl="https://github.com/browser-gateway/browser-gateway"
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
