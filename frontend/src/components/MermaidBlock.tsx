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
    const isDark = resolvedTheme === "dark";
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
    });

    try {
      // Mermaid caches rendered ids — use unique id per theme to force re-render
      const renderId = `mermaid-${id}-${isDark ? "dark" : "light"}`;
      const { svg } = await mermaid.render(renderId, code);
      if (containerRef.current) {
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
    <div className="not-prose my-6 flex justify-center rounded-xl border border-surface-border bg-white p-6 dark:bg-slate-900">
      <div ref={containerRef} />
    </div>
  );
}
