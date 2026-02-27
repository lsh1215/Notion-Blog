import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

/**
 * Image proxy that fetches fresh signed URLs from Notion API.
 *
 * Usage:
 *   /api/image?blockId=<id>              — image block
 *   /api/image?pageId=<id>&type=cover    — page cover image
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const blockId = searchParams.get("blockId");
  const pageId = searchParams.get("pageId");

  try {
    let imageUrl: string | null = null;

    if (blockId) {
      imageUrl = await getFreshBlockImageUrl(blockId);
    } else if (pageId) {
      imageUrl = await getFreshCoverImageUrl(pageId);
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Fetch the actual image binary
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") || "image/png";
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache the binary for 30 min, serve stale for up to 24h while revalidating
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[api/image] proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}

async function getFreshBlockImageUrl(blockId: string): Promise<string | null> {
  const block = await notion.blocks.retrieve({ block_id: blockId });
  if (!("type" in block) || (block as BlockObjectResponse).type !== "image") {
    return null;
  }
  const image = (block as any).image;
  if (image?.type === "file") return image.file.url;
  if (image?.type === "external") return image.external.url;
  return null;
}

async function getFreshCoverImageUrl(pageId: string): Promise<string | null> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!("cover" in page)) return null;
  const cover = (page as PageObjectResponse).cover;
  if (!cover) return null;
  if (cover.type === "file") return cover.file.url;
  if (cover.type === "external") return cover.external.url;
  return null;
}
