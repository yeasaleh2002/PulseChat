import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const tag = body.tag || "conversations";
    
    revalidateTag(tag);

    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: Date.now(),
      message: `On-demand revalidation tag '${tag}' triggered successfully.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to revalidate tag", details: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag") || "conversations";
  revalidateTag(tag);
  return NextResponse.json({
    revalidated: true,
    tag,
    timestamp: Date.now(),
    message: `On-demand revalidation tag '${tag}' triggered via GET.`,
  });
}
