import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog || !blog.published) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}
