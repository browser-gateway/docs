import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { CopyPageActions } from "@/components/copy-page-actions";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const slugPath = page.slugs.length > 0 ? page.slugs.join("/") : "";
  // /api/pages/ is a separate endpoint that survives the URL restructure.
  const markdownUrl = `/api/pages/${slugPath}`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
        </div>
        <div className="shrink-0 pt-1.5 hidden sm:block">
          <CopyPageActions markdownUrl={markdownUrl} />
        </div>
      </div>
      <DocsBody>
        <MDXContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      type: "article",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: page.data.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: ["/og.png"],
    },
  };
}
