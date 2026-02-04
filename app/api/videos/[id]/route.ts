import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          error: "Video not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: video,
    });
  } catch (error: any) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch video",
      },
      { status: 500 }
    );
  }
}
