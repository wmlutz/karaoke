import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const ownerPassword = process.env.OWNER_PASS;

    if (!ownerPassword) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const isValid = password === ownerPassword;

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
