import { NextRequest, NextResponse } from "next/server";
import { routes } from "@v1/stripe";

export async function POST(request: NextRequest) {
  try {
    // Wrap the original route handler in a function that provides the request context
    const response = await routes.customer(request);
    return response;
  } catch (error) {
    console.error("Error in customer route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
