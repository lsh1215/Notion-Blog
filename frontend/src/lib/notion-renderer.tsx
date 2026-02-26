/**
 * Notion block renderer - converts Notion API block objects to styled JSX.
 * Server Component (no "use client" directive needed).
 */

import { codeToHtml } from "shiki/bundle/web";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RichTextObject {
  type: string;
  text?: { content: string; link?: { url: string } | null };
  mention?: unknown;
  equation?: { expression: string };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string | null;
}

interface NotionRendererProps {
  blocks: any[]; // BlockObjectResponse from @notionhq/client
}

// ---------------------------------------------------------------------------
// Color map - Notion annotation colors → Tailwind utility classes
// ---------------------------------------------------------------------------

const COLOR_CLASS_MAP: Record<string, string> = {
  default: "",
  gray: "text-slate-500 dark:text-slate-400",
  brown: "text-amber-800 dark:text-amber-400",
  orange: "text-orange-500 dark:text-orange-400",
  yellow: "text-yellow-500 dark:text-yellow-400",
  green: "text-green-600 dark:text-green-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  pink: "text-pink-500 dark:text-pink-400",
  red: "text-red-500 dark:text-red-400",
  gray_background: "bg-slate-100 dark:bg-slate-800",
  brown_background: "bg-amber-50 dark:bg-amber-900/30",
  orange_background: "bg-orange-50 dark:bg-orange-900/30",
  yellow_background: "bg-yellow-50 dark:bg-yellow-900/30",
  green_background: "bg-green-50 dark:bg-green-900/30",
  blue_background: "bg-blue-50 dark:bg-blue-900/30",
  purple_background: "bg-purple-50 dark:bg-purple-900/30",
  pink_background: "bg-pink-50 dark:bg-pink-900/30",
  red_background: "bg-red-50 dark:bg-red-900/30",
};

// ---------------------------------------------------------------------------
// Rich text helper
// ---------------------------------------------------------------------------

function renderRichText(richTexts: RichTextObject[]): React.ReactNode {
  if (!richTexts || richTexts.length === 0) return null;

  return richTexts.map((rt, index) => {
    const { annotations, plain_text, href } = rt;
    const {
      bold,
      italic,
      strikethrough,
      underline,
      code,
      color,
    } = annotations;

    const colorClass = COLOR_CLASS_MAP[color] ?? "";

    // Build class list for span wrapper
    const classNames: string[] = [];
    if (colorClass) classNames.push(colorClass);

    let content: React.ReactNode = plain_text;

    // Inline code takes precedence over other text styling
    if (code) {
      content = (
        <code key={index} className={colorClass || undefined}>
          {plain_text}
        </code>
      );
    } else {
      // Apply formatting wrappers inside-out
      if (bold) content = <strong>{content}</strong>;
      if (italic) content = <em>{content}</em>;
      if (strikethrough) content = <s>{content}</s>;
      if (underline) content = <u>{content}</u>;

      // Wrap in span only when there's a color class to apply
      if (colorClass) {
        content = <span className={colorClass}>{content}</span>;
      }
    }

    // Wrap in anchor if there's a link
    if (href) {
      content = (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    } else {
      // Give the outermost node its key
      content = <span key={index}>{content}</span>;
    }

    return content;
  });
}

// ---------------------------------------------------------------------------
// Individual block renderers
// ---------------------------------------------------------------------------

function renderParagraph(block: any) {
  const richTexts: RichTextObject[] = block.paragraph?.rich_text ?? [];
  // Empty paragraphs act as spacers
  if (richTexts.length === 0) {
    return <p key={block.id} className="mb-1" />;
  }
  return <p key={block.id}>{renderRichText(richTexts)}</p>;
}

function renderHeading(block: any, level: 1 | 2 | 3) {
  const key = `heading_${level}` as "heading_1" | "heading_2" | "heading_3";
  const richTexts: RichTextObject[] = block[key]?.rich_text ?? [];
  const text = renderRichText(richTexts);

  if (level === 1) return <h1 key={block.id}>{text}</h1>;
  if (level === 2) return <h2 key={block.id}>{text}</h2>;
  return <h3 key={block.id}>{text}</h3>;
}

// Notion language names → shiki language IDs mapping
const LANG_MAP: Record<string, string> = {
  "plain text": "text",
  "c++": "cpp",
  "c#": "csharp",
  "objective-c": "objc",
  "visual basic": "vb",
  "assembly": "asm",
  "shell": "bash",
};

// Display labels for language badges
const LANG_LABEL: Record<string, string> = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  py: "Python",
  rb: "Ruby",
  rs: "Rust",
  go: "Go",
  cpp: "C++",
  csharp: "C#",
  objc: "Objective-C",
  bash: "Bash",
  sh: "Shell",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  xml: "XML",
  md: "Markdown",
  text: "Plain Text",
};

function getLangLabel(lang: string): string {
  return LANG_LABEL[lang] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
}

async function renderCodeAsync(block: any): Promise<React.ReactNode> {
  const richTexts: RichTextObject[] = block.code?.rich_text ?? [];
  const notionLang: string = block.code?.language ?? "plain text";
  const lang = LANG_MAP[notionLang.toLowerCase()] ?? notionLang.toLowerCase();
  const code = richTexts.map((rt) => rt.plain_text).join("");
  const label = getLangLabel(lang);
  const captionRichTexts: RichTextObject[] = block.code?.caption ?? [];
  const caption = captionRichTexts.map((rt) => rt.plain_text).join("");

  try {
    const html = await codeToHtml(code, {
      lang,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
    return (
      <div key={block.id} className="not-prose my-6 overflow-hidden rounded-xl border border-surface-border">
        {/* Language badge */}
        <div className="flex items-center justify-between border-b border-surface-border bg-surface-subtle px-4 py-2">
          <span className="text-xs font-medium text-ink-muted">{label}</span>
          {caption && (
            <span className="text-xs text-ink-muted">{caption}</span>
          )}
        </div>
        {/* Code */}
        <div
          className="overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:!rounded-none [&>pre]:!m-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  } catch {
    return (
      <div key={block.id} className="not-prose my-6 overflow-hidden rounded-xl border border-surface-border">
        <div className="flex items-center border-b border-surface-border bg-surface-subtle px-4 py-2">
          <span className="text-xs font-medium text-ink-muted">{label}</span>
        </div>
        <pre className="overflow-x-auto bg-surface-muted p-4 text-sm">
          <code>{code}</code>
        </pre>
      </div>
    );
  }
}

function renderImage(block: any) {
  const image = block.image;
  let src = "";
  let caption = "";

  if (image?.type === "external") {
    src = image.external?.url ?? "";
  } else if (image?.type === "file") {
    src = image.file?.url ?? "";
  }

  const captionRichTexts: RichTextObject[] = image?.caption ?? [];
  caption = captionRichTexts.map((rt) => rt.plain_text).join("");

  if (!src) return null;

  return (
    <figure key={block.id}>
      {/* Using <img> directly - Notion S3 URLs expire and aren't compatible with Next.js Image optimization */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption || "Notion image"} />
      {caption && (
        <figcaption className="text-center text-sm text-ink-muted mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function renderQuote(block: any) {
  const richTexts: RichTextObject[] = block.quote?.rich_text ?? [];
  return (
    <blockquote key={block.id}>
      <p>{renderRichText(richTexts)}</p>
    </blockquote>
  );
}

function renderCallout(block: any) {
  const richTexts: RichTextObject[] = block.callout?.rich_text ?? [];
  const icon = block.callout?.icon;
  let iconContent: string | null = null;

  if (icon?.type === "emoji") {
    iconContent = icon.emoji;
  } else if (icon?.type === "external") {
    iconContent = null; // Could render <img> here if needed
  }

  return (
    <div key={block.id} className="notion-callout">
      {iconContent && (
        <span className="notion-callout-icon" aria-hidden="true">
          {iconContent}
        </span>
      )}
      <div className="notion-callout-content">
        <p>{renderRichText(richTexts)}</p>
      </div>
    </div>
  );
}

async function renderToggle(block: any) {
  const richTexts: RichTextObject[] = block.toggle?.rich_text ?? [];
  const children: any[] = block.children ?? [];

  return (
    <details key={block.id} className="notion-toggle my-4">
      <summary>{renderRichText(richTexts)}</summary>
      {children.length > 0 && (
        <div className="notion-toggle-content">
          <NotionRenderer blocks={children} />
        </div>
      )}
    </details>
  );
}

function renderTable(block: any) {
  const rows: any[] = block.children ?? [];
  const hasColumnHeader: boolean = block.table?.has_column_header ?? false;
  const hasRowHeader: boolean = block.table?.has_row_header ?? false;

  if (rows.length === 0) return null;

  const headerRow = hasColumnHeader ? rows[0] : null;
  const bodyRows = hasColumnHeader ? rows.slice(1) : rows;

  function renderCell(
    cell: RichTextObject[],
    index: number,
    isHeader: boolean
  ) {
    const Tag = isHeader || (hasRowHeader && index === 0) ? "th" : "td";
    return <Tag key={index}>{renderRichText(cell)}</Tag>;
  }

  return (
    <table key={block.id}>
      {headerRow && (
        <thead>
          <tr>
            {(headerRow.table_row?.cells ?? []).map(
              (cell: RichTextObject[], i: number) => renderCell(cell, i, true)
            )}
          </tr>
        </thead>
      )}
      <tbody>
        {bodyRows.map((row: any) => (
          <tr key={row.id}>
            {(row.table_row?.cells ?? []).map(
              (cell: RichTextObject[], i: number) => renderCell(cell, i, false)
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderBookmark(block: any) {
  const url: string = block.bookmark?.url ?? "";
  const captionRichTexts: RichTextObject[] = block.bookmark?.caption ?? [];
  const caption = captionRichTexts.map((rt) => rt.plain_text).join("") || url;

  if (!url) return null;

  return (
    <div
      key={block.id}
      className="not-prose my-4 rounded-xl border border-surface-border overflow-hidden"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 hover:bg-surface-subtle transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink truncate">{caption}</p>
          <p className="text-xs text-ink-muted truncate mt-0.5">{url}</p>
        </div>
        <svg
          className="w-4 h-4 text-ink-muted flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}

function renderEmbed(block: any) {
  const url: string = block.embed?.url ?? "";
  if (!url) return null;

  // Attempt to embed as iframe; fallback-friendly for unknown URLs
  return (
    <div key={block.id} className="not-prose my-4">
      <iframe
        src={url}
        className="w-full rounded-xl border border-surface-border"
        style={{ minHeight: "400px" }}
        allowFullScreen
        title="Embedded content"
      />
    </div>
  );
}

function renderVideo(block: any) {
  const video = block.video;
  let url = "";

  if (video?.type === "external") {
    url = video.external?.url ?? "";
  } else if (video?.type === "file") {
    url = video.file?.url ?? "";
  }

  if (!url) return null;

  // YouTube embed
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return (
      <div
        key={block.id}
        className="not-prose my-4 aspect-video rounded-xl overflow-hidden"
      >
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="YouTube video"
        />
      </div>
    );
  }

  // Direct video file
  return (
    <div key={block.id} className="not-prose my-4">
      <video
        src={url}
        controls
        className="w-full rounded-xl"
      />
    </div>
  );
}

function renderEquation(block: any) {
  const expression: string = block.equation?.expression ?? "";
  // Render as code block since no KaTeX dependency is available
  return (
    <pre key={block.id} className="not-prose">
      <code>{expression}</code>
    </pre>
  );
}

// ---------------------------------------------------------------------------
// List grouping helpers
// ---------------------------------------------------------------------------

type GroupedBlock =
  | { kind: "ul"; blocks: any[] }
  | { kind: "ol"; blocks: any[] }
  | { kind: "single"; block: any };

function groupBlocks(blocks: any[]): GroupedBlock[] {
  const groups: GroupedBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const group: any[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        group.push(blocks[i]);
        i++;
      }
      groups.push({ kind: "ul", blocks: group });
    } else if (block.type === "numbered_list_item") {
      const group: any[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        group.push(blocks[i]);
        i++;
      }
      groups.push({ kind: "ol", blocks: group });
    } else {
      groups.push({ kind: "single", block });
      i++;
    }
  }

  return groups;
}

function renderListItem(block: any, listType: "ul" | "ol") {
  const key = listType === "ul" ? "bulleted_list_item" : "numbered_list_item";
  const richTexts: RichTextObject[] = block[key]?.rich_text ?? [];
  const children: any[] = block.children ?? [];

  return (
    <li key={block.id}>
      {renderRichText(richTexts)}
      {children.length > 0 && <NotionRenderer blocks={children} />}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export async function NotionRenderer({ blocks }: NotionRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  const groups = groupBlocks(blocks);

  const rendered = await Promise.all(
    groups.map(async (group, groupIndex) => {
      if (group.kind === "ul") {
        return (
          <ul key={`ul-${groupIndex}`}>
            {group.blocks.map((b) => renderListItem(b, "ul"))}
          </ul>
        );
      }

      if (group.kind === "ol") {
        return (
          <ol key={`ol-${groupIndex}`}>
            {group.blocks.map((b) => renderListItem(b, "ol"))}
          </ol>
        );
      }

      // Single block
      const block = group.block;
      switch (block.type) {
        case "paragraph":
          return renderParagraph(block);
        case "heading_1":
          return renderHeading(block, 1);
        case "heading_2":
          return renderHeading(block, 2);
        case "heading_3":
          return renderHeading(block, 3);
        case "code":
          return renderCodeAsync(block);
        case "image":
          return renderImage(block);
        case "quote":
          return renderQuote(block);
        case "callout":
          return renderCallout(block);
        case "divider":
          return <hr key={block.id} />;
        case "toggle":
          return renderToggle(block);
        case "table":
          return renderTable(block);
        case "table_row":
          // table_row blocks are handled inside renderTable via block.children
          return null;
        case "bookmark":
          return renderBookmark(block);
        case "embed":
          return renderEmbed(block);
        case "video":
          return renderVideo(block);
        case "equation":
          return renderEquation(block);
        default:
          // Gracefully skip unknown block types
          return null;
      }
    })
  );

  return <>{rendered}</>;
}
