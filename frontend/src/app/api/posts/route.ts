import { NextRequest, NextResponse } from "next/server";
import { getPaginatedPosts, getAllPosts } from "@/lib/notion";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim().toLowerCase();

  // Search mode: return all matching posts (no pagination)
  if (query) {
    const all = await getAllPosts();
    const filtered = all.filter((post) => {
      const haystack = [
        post.title,
        post.description,
        post.category,
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase();
      return query.split(/\s+/).every((word) => haystack.includes(word));
    });
    return NextResponse.json({ posts: filtered, total: filtered.length });
  }

  // Pagination mode
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") ?? 3)));

  const { posts, total } = await getPaginatedPosts(offset, limit);

  return NextResponse.json({ posts, total });
}
