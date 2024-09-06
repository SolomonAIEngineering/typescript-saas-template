import { NextRequest, NextResponse } from "next/server";
import { routes } from "@v1/stripe";

export async function POST(request: NextRequest) {
  try {
    const response = await routes.checkout(request);
    return response;
  } catch (error) {
    console.error("Error in checkout route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
