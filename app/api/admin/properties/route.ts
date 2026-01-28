import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { propertySchema } from "@/lib/validations/property";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    const property = await prisma.property.create({
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
                configType: config.configType,
                carpetAreaSqft: config.carpetAreaSqft,
                price: config.price,
                floorPlanImage: config.floorPlanImage,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: property,
      message: "Property created successfully",
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

    console.error("Error creating property:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create property",
      },
      { status: 400 }
    );
  }
}
