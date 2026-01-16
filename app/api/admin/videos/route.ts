import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { videoSchema } from "@/lib/validations/video";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = videoSchema.parse(body);

    const video = await prisma.video.create({
      data: {
        title: validatedData.title,
        videoLink: validatedData.videoLink,
        thumbnail: validatedData.thumbnail,
        description: validatedData.description,
        order: validatedData.order,
      },
    });

    return NextResponse.json({
      success: true,
      data: video,
      message: "Video created successfully",
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("Forbidden")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    console.error("Error creating video:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create video",
      },
      { status: 400 }
    );
  }
}
