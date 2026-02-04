import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { videoSchema } from "@/lib/validations/video";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

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
    if (error.message?.includes("Unauthorized") || error.message?.includes("Forbidden")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const body = await request.json();
    const validatedData = videoSchema.parse(body);

    const video = await prisma.video.update({
      where: { id },
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
      message: "Video updated successfully",
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

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Video not found",
        },
        { status: 404 }
      );
    }

    console.error("Error updating video:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update video",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
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

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Video not found",
        },
        { status: 404 }
      );
    }

    console.error("Error deleting video:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete video",
      },
      { status: 500 }
    );
  }
}
