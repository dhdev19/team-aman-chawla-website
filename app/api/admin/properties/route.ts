import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { propertySchema } from "@/lib/validations/property";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { builder: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: properties,
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

    console.error("Error fetching properties:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    // Transform projectLaunchDate from various formats to ISO format
    const transformDate = (dateString: string | null | undefined) => {
      if (!dateString) return null;
      
      // Try different date formats
      const patterns = [
        // DD-MM-YYYY HH:MM format
        /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/,
        // MM-DD-YYYY HH:MM format  
        /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/,
        // YYYY-MM-DD HH:MM format
        /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/,
        // DD-MM-YYYY HH:MM:SS format
        /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
        // YYYY-MM-DDTHH:MM:SS format (already ISO)
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
      ];
      
      for (const pattern of patterns) {
        const match = dateString.match(pattern);
        if (match) {
          const [, part1, part2, part3, hours, minutes, seconds = '00'] = match;
          
          // Determine the date parts based on pattern length
          let year, month, day;
          if (part1.length === 4) {
            // YYYY-MM-DD format
            [year, month, day] = [part1, part2, part3];
          } else {
            // DD-MM-YYYY format
            [day, month, year] = [part1, part2, part3];
          }
          
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
        }
      }
      
      return null;
    };

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
        projectLaunchDate: transformDate(validatedData.projectLaunchDate),
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
