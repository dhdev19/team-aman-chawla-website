import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const careerApplication = await prisma.careerApplication.findUnique({
      where: { id },
    });

    if (!careerApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "Career application not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: careerApplication,
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

    console.error("Error fetching career application:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch career application",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.careerApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Career application deleted successfully",
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
          error: "Career application not found",
        },
        { status: 404 }
      );
    }

    console.error("Error deleting career application:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete career application",
      },
      { status: 500 }
    );
  }
}