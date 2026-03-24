import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug } from "@/data/links";

/**
 * Checks whether a URL uses a safe scheme (http or https).
 *
 * @param url - The URL string to validate
 * @returns `true` if the URL starts with http:// or https://
 */
function isSafeRedirectUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;

  const link = await getLinkBySlug(slug);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  if (!isSafeRedirectUrl(link.url)) {
    return NextResponse.json(
      { error: "Invalid redirect URL" },
      { status: 400 },
    );
  }

  return NextResponse.redirect(link.url, 308);
}
