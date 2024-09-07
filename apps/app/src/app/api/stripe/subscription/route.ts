import { NextRequest, NextResponse } from "next/server";
import { routes } from "@v1/stripe";
import { cookies } from "next/headers";

export const POST = routes.withCookies(
  async (
    request: NextRequest,
    response: NextResponse,
    cookieStore: ReturnType<typeof cookies>,
  ) => {
    try {
      // Call the checkout function with the request object
      const result = await routes.subscription(request, response);
      // The result should already be a NextResponse object
      return result;
    } catch (error) {
      console.error("Error in checkout route:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  },
);

export const PATCH = routes.withCookies(
  async (
    request: NextRequest,
    response: NextResponse,
    cookieStore: ReturnType<typeof cookies>,
  ) => {
    try {
      // Call the checkout function with the request object
      const result = await routes.manageSubscription(request, response);
      // The result should already be a NextResponse object
      return result;
    } catch (error) {
      console.error("Error in checkout route:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  },
);
