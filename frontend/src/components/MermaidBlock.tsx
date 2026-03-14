"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

interface MermaidBlockProps {
  code: string;
  id: string;
}

export default function MermaidBlock({ code, id }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const renderDiagram = useCallback(async () => {
    if (!containerRef.current) return;

    const isDark = resolvedTheme === "dark";
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      flowchart: { useMaxWidth: false },
    });

    try {
      // Wait for web fonts to load — prevents text measurement mismatch
      await document.fonts.ready;

      const renderId = `mermaid-${id}-${isDark ? "dark" : "light"}`;
      const { svg } = await mermaid.render(renderId, code);

      if (!containerRef.current) return;

      // Parse SVG and fix dimensions before injecting
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (svgEl) {
        svgEl.removeAttribute("height");
        svgEl.removeAttribute("width");
        svgEl.style.width = "100%";
        svgEl.style.maxWidth = "100%";
        svgEl.style.height = "auto";
        svgEl.style.overflow = "visible";
        containerRef.current.innerHTML = svgEl.outerHTML;
      } else {
        containerRef.current.innerHTML = svg;
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mermaid render failed");
    }
  }, [code, id, resolvedTheme]);

  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  if (error) {
    return (
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-surface-border">
        <div className="flex items-center border-b border-surface-border bg-surface-subtle px-4 py-2">
          <span className="text-xs font-medium text-ink-muted">Mermaid</span>
        </div>
        <pre className="overflow-x-auto bg-surface-muted p-4 text-sm">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="not-prose mermaid-container my-6 overflow-x-auto rounded-xl border border-surface-border bg-white p-6 dark:bg-slate-900">
      <div ref={containerRef} className="w-full min-w-0" />
    </div>
  );
}
