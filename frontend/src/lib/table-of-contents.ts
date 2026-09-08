export interface TableOfContentsItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

const HEADING_TYPES = new Set(["heading_1", "heading_2", "heading_3"]);

/** Keep heading anchors stable even when two headings have the same text. */
export function getHeadingId(blockId: string): string {
  return `heading-${blockId.replace(/-/g, "")}`;
}

export function extractTableOfContents(blocks: unknown[]): TableOfContentsItem[] {
  return blocks.flatMap((block): TableOfContentsItem[] => {
    if (typeof block !== "object" || block === null) return [];

    const blockRecord = block as Record<string, unknown>;
    const type = blockRecord.type;
    const blockId = blockRecord.id;

    if (
      typeof type !== "string" ||
      typeof blockId !== "string" ||
      !HEADING_TYPES.has(type)
    ) {
      return [];
    }

    const level = Number(type.slice(-1)) as 1 | 2 | 3;
    const heading = blockRecord[type] as
      | { rich_text?: Array<{ plain_text?: string }> }
      | undefined;
    const text = (heading?.rich_text ?? [])
      .map((item: { plain_text?: string }) => item.plain_text ?? "")
      .join("")
      .trim();

    if (!text) return [];

    return [{ id: getHeadingId(blockId), text, level }];
  });
}
