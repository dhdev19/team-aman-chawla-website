import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { careerApplicationSchema } from "@/lib/validations/career";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = careerApplicationSchema.parse(body);

    // Check if email already exists
    const existingApplication = await prisma.careerApplication.findFirst({
      where: { email: validatedData.email },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "An application with this email already exists",
        },
        { status: 400 }
      );
    }

    const careerApplication = await prisma.careerApplication.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        whatsappNumber: validatedData.whatsappNumber,
        city: validatedData.city,
        referralSource: validatedData.referralSource,
        referralOther: validatedData.referralOther,
        resumeLink: validatedData.resumeLink,
      },
    });

    return NextResponse.json({
      success: true,
      data: careerApplication,
      message: "Application submitted successfully",
    });
  } catch (error: any) {
    console.error("Error submitting career application:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit application",
      },
      { status: 400 }
    );
  }
}