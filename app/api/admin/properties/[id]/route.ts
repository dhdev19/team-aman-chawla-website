import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { propertySchema } from "@/lib/validations/property";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const property = await prisma.property.findUnique({
      where: { id: params.id },
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
    if (error.message?.includes("Unauthorized") || error.message?.includes("Forbidden")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        type: validatedData.type,
        builder: validatedData.builder,
        builderReraNumber: validatedData.builderReraNumber,
        description: validatedData.description,
        price: validatedData.price,
        location: validatedData.location,
        locationAdvantages: validatedData.locationAdvantages,
        status: validatedData.status,
        mainImage: validatedData.mainImage,
        images: validatedData.images,
        amenities: validatedData.amenities,
        metaTitle: validatedData.metaTitle,
        metaKeywords: validatedData.metaKeywords,
        metaDescription: validatedData.metaDescription,
        bankAccountName: validatedData.bankAccountName,
        bankName: validatedData.bankName,
        bankAccountNumber: validatedData.bankAccountNumber,
        bankIfsc: validatedData.bankIfsc,
        bankBranch: validatedData.bankBranch,
      },
    });

    return NextResponse.json({
      success: true,
      data: property,
      message: "Property updated successfully",
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
          error: "Property not found",
        },
        { status: 404 }
      );
    }

    console.error("Error updating property:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update property",
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

    await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
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
          error: "Property not found",
        },
        { status: 404 }
      );
    }

    console.error("Error deleting property:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete property",
      },
      { status: 500 }
    );
  }
}
