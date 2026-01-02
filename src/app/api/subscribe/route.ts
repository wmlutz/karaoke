import { NextRequest, NextResponse } from "next/server";
import { submitEmail } from "@/app/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required",
        },
        { status: 400 }
      );
    }

    // Submit to EmailOctopus
    const result = await submitEmail(email);

    if (result.alreadySubscribed) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list! We'll keep you updated.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for joining! We'll keep you updated.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to subscribe. Please try again or contact us directly.",
      },
      { status: 500 }
    );
  }
}
