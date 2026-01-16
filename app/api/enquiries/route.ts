import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enquirySchema } from "@/lib/validations/enquiry";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = enquirySchema.parse(body);

    const enquiry = await prisma.enquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        type: validatedData.type,
        propertyId: validatedData.propertyId,
      },
    });

    return NextResponse.json({
      success: true,
      data: enquiry,
      message: "Enquiry submitted successfully",
    });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit enquiry",
      },
      { status: 400 }
    );
  }
}
