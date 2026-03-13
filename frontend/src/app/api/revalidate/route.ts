import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/blog/[slug]", "page");

  return Response.json({ revalidated: true, now: Date.now() });
}
