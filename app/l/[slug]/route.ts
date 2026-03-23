import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug } from "@/data/links";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;

  const link = await getLinkBySlug(slug);

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.redirect(link.url, 308);
}
