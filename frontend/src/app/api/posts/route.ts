import { NextRequest, NextResponse } from "next/server";
import { getPaginatedPosts } from "@/lib/notion";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") ?? 3)));

  const { posts, total } = await getPaginatedPosts(offset, limit);

  return NextResponse.json({ posts, total });
}
