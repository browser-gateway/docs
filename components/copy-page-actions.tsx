"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

interface Props {
  /** URL that returns the raw markdown for this page. Absolute or same-origin. */
  markdownUrl: string;
}

/**
 * Split-button that copies the current page as markdown and offers to open it
 * in ChatGPT / Claude / Perplexity / Grok. Styled to match the docs.babelize.co
 * pattern (mimicked because Fumadocs does not ship an equivalent preset).
 */
export function CopyPageActions({ markdownUrl }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<Promise<string> | null>(null);

  const fetchMarkdown = useCallback(async (): Promise<string> => {
    if (!cacheRef.current) {
      const abs = new URL(markdownUrl, window.location.origin).toString();
      cacheRef.current = fetch(abs).then((r) => r.text());
    }
    return cacheRef.current;
  }, [markdownUrl]);

  const [copied, copy] = useCopyButton(async () => {
    const md = await fetchMarkdown();
    await navigator.clipboard.writeText(md);
  });

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pageAbsolute = () => new URL(markdownUrl, window.location.origin).toString();
  const prompt = () => `Read ${pageAbsolute()}, I want to ask questions about it.`;

  const openIn = (base: string, param: string) => async () => {
    const q = prompt();
    window.open(`${base}?${param}=${encodeURIComponent(q)}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  };
  const viewMarkdown = () => {
    window.open(pageAbsolute(), "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative inline-flex items-stretch">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy page"
        className="inline-flex items-center gap-1.5 rounded-l-md px-2.5 py-1.5 text-xs text-fd-muted-foreground hover:text-fd-accent-foreground hover:bg-fd-accent transition-colors border border-fd-border border-r-0"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        <span>{copied ? "Copied" : "Copy page"}</span>
      </button>
      <div className="w-px bg-fd-border" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More options"
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center justify-center rounded-r-md px-1.5 py-1.5 text-xs text-fd-muted-foreground hover:text-fd-accent-foreground hover:bg-fd-accent transition-colors border border-fd-border border-l-0"
      >
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-50 min-w-[260px] rounded-xl border border-fd-border bg-fd-background shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <MenuItem
            title={copied ? "Copied" : "Copy page"}
            description="Copy page as Markdown for LLMs"
            icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            onClick={(e) => { copy(e); setOpen(false); }}
          />
          <MenuItem
            title="View as Markdown"
            description="View this page as plain text"
            external
            icon={<MarkdownIcon />}
            onClick={viewMarkdown}
          />
          <MenuItem
            title="Open in ChatGPT"
            description="Ask questions about this page"
            external
            icon={<ChatGptIcon />}
            onClick={openIn("https://chat.openai.com/", "q")}
          />
          <MenuItem
            title="Open in Claude"
            description="Ask questions about this page"
            external
            icon={<ClaudeIcon />}
            onClick={openIn("https://claude.ai/new", "q")}
          />
          <MenuItem
            title="Open in Perplexity"
            description="Ask questions about this page"
            external
            icon={<PerplexityIcon />}
            onClick={openIn("https://www.perplexity.ai/search", "q")}
          />
          <MenuItem
            title="Open in Grok"
            description="Ask questions about this page"
            external
            icon={<GrokIcon />}
            onClick={openIn("https://grok.com/", "q")}
          />
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  external?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function MenuItem({ title, description, icon, external, onClick }: MenuItemProps) {
  return (
    <button
      role="menuitem"
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-fd-accent transition-colors group"
    >
      <span className="shrink-0 flex items-center justify-center size-8 rounded-lg border border-fd-border bg-fd-muted text-fd-muted-foreground group-hover:text-fd-accent-foreground transition-colors">
        {icon}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-fd-foreground leading-tight flex items-center gap-1">
          {title}
          {external && <ExternalLink className="size-3 opacity-50" />}
        </span>
        <span className="text-xs text-fd-muted-foreground leading-tight mt-0.5">
          {description}
        </span>
      </span>
    </button>
  );
}

function MarkdownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 15V9l3 3 3-3v6M17 15l-2-3M15 15l2-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatGptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973v5.688a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.688a.79.79 0 0 0-.407-.657zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v3l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M4.709 15.955l4.72-2.647.079-.23-.079-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.146-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  );
}

function PerplexityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M22.398 0h-8.045v6.918L7.734 0H4.5v7.68H1.602v8.746H4.5V24l6.354-6.65V24h2.245v-6.914L19.5 24v-7.628h2.898V7.68H19.5V.026zM6.687 2.354l6.973 7.302H6.687zm-2.845 12.16v-4.938h6.72l-6.72 7.03zm7.021 5.876v-9.4l4.489 4.7zM17.32 9.678h.014L11.028 2.72v6.958zm.043 4.945-6.334-6.63h6.334zM19.5 14.514v-4.836h.844v4.836z" />
    </svg>
  );
}

function GrokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M9.27 15.29 15.79 0h3.13l-6.51 15.29zm-4.9 6.42L15.87 6.86h3.13L7.5 21.71zm14.19-4.31L15.87 24H12.7l6.51-6.6z" />
    </svg>
  );
}
