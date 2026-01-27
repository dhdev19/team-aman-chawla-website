import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { videoSchema } from "@/lib/validations/video";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { order: "asc" },
      }),
      prisma.video.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: videos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
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
