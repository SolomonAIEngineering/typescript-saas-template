import { handleAuthCallback } from "@v1/auth";
import { routes } from "@v1/stripe";
import type { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const GET = routes.withCookies(
  async (
    request: NextRequest,
    response: NextResponse,
    cookieStore: ReturnType<typeof cookies>,
  ) => {
    try {
      // Call the checkout function with the request object
      const result = await handleAuthCallback(request);
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
