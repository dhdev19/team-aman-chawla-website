import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    await requireAdmin();

    const builders = await prisma.builder.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: builders,
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

    console.error("Error fetching builders:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch builders",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const name = (body?.name || "").trim();
    const about = (body?.about || "").trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Builder name is required",
        },
        { status: 400 }
      );
    }

    const builder = await prisma.builder.upsert({
      where: { name },
      update: {
        about: about || undefined,
      },
      create: {
        name,
        about: about || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: builder,
      message: "Builder saved successfully",
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

    console.error("Error saving builder:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save builder",
      },
      { status: 500 }
    );
  }
}
