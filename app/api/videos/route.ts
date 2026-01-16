import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: videos,
    });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch videos",
      },
      { status: 500 }
    );
  }
}
