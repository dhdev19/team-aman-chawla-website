import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPaginatedResponse, getSkip } from "@/lib/pagination";
import { propertyFilterSchema } from "@/lib/validations/property";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      builder: searchParams.get("builder") || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "25",
    };

    const validatedParams = propertyFilterSchema.parse(params);
    const { page, limit, type, status, builder, search } = validatedParams;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (builder) {
      where.builder = {
        contains: builder,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { builder: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          configurations: true,
        },
      }),
      prisma.property.count({ where }),
    ]);

    const response = createPaginatedResponse(properties, page, limit, total);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
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
