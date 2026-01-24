import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        configurations: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch property",
      },
      { status: 500 }
    );
  }
}
