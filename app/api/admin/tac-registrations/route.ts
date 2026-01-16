import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { createPaginatedResponse, getSkip } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const [registrations, total] = await Promise.all([
      prisma.tACRegistration.findMany({
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.tACRegistration.count(),
    ]);

    const response = createPaginatedResponse(registrations, page, limit, total);

    return NextResponse.json({
      success: true,
      data: response,
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

    console.error("Error fetching TAC registrations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch registrations",
      },
      { status: 500 }
    );
  }
}
