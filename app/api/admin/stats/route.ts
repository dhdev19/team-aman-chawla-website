import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    await requireAdmin();

    const stats = await prisma.pageStat.findMany({
      orderBy: { clickCount: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: stats,
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

    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
