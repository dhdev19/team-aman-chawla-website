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
        type: validatedData.type,
        builder: validatedData.builder,
        builderReraNumber: validatedData.builderReraNumber,
        description: validatedData.description,
        price: validatedData.price,
        location: validatedData.location,
        status: validatedData.status,
        mainImage: validatedData.mainImage,
        images: validatedData.images,
        amenities: validatedData.amenities,
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
