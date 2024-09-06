import { NextRequest, NextResponse } from "next/server";
import { routes } from "@v1/stripe";

export async function POST(request: NextRequest) {
  try {
    const response = await routes.webhook(request);
    return response;
  } catch (error) {
    console.error("Error in webhook route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
