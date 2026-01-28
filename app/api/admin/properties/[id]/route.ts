import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { propertySchema } from "@/lib/validations/property";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    // Delete existing configurations and create new ones
    if (validatedData.configurations) {
      await prisma.propertyConfiguration.deleteMany({
        where: { propertyId: id },
      });
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        type: validatedData.type,
        format: validatedData.format,
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
        mapImage: validatedData.mapImage,
        projectLaunchDate: validatedData.projectLaunchDate,
        builderReraQrCode: validatedData.builderReraQrCode,
        possession: validatedData.possession,
        metaTitle: validatedData.metaTitle,
        metaKeywords: validatedData.metaKeywords,
        metaDescription: validatedData.metaDescription,
        bankAccountName: validatedData.bankAccountName,
        bankName: validatedData.bankName,
        bankAccountNumber: validatedData.bankAccountNumber,
        bankIfsc: validatedData.bankIfsc,
        bankBranch: validatedData.bankBranch,
        configurations: validatedData.configurations
          ? {
              create: validatedData.configurations.map((config) => ({
                configType: config.configType === "other" && config.customConfigType 
                  ? config.customConfigType 
                  : config.configType,
                carpetAreaSqft: config.carpetAreaSqft,
                price: config.price ?? 0, // Default to 0 if null/undefined
                floorPlanImage: config.floorPlanImage,
              })),
            }
          : undefined,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.property.delete({
      where: { id },
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
