import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        {
          success: false,
          error: "Enquiry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enquiry,
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

    console.error("Error fetching enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch enquiry",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();

    const enquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: enquiry,
      message: "Enquiry updated successfully",
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
          error: "Enquiry not found",
        },
        { status: 404 }
      );
    }

    console.error("Error updating enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update enquiry",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    await prisma.enquiry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
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
          error: "Enquiry not found",
        },
        { status: 404 }
      );
    }

    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete enquiry",
      },
      { status: 500 }
    );
  }
}
