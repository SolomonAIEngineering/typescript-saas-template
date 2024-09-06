import { NextRequest, NextResponse } from "next/server";
import { routes } from "@v1/stripe";

export async function POST(request: NextRequest) {
  try {
    const response = await routes.subscription(request);
    return response;
  } catch (error) {
    console.error("Error in subscription route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const response = await routes.manageSubscription(request);
    return response;
  } catch (error) {
    console.error("Error in manage subscription route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
