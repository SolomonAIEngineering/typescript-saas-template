import { createPaymentIntent } from "../index";
import { getUser } from "@v1/supabase/queries";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { amount, currency } = data as { amount: number; currency: string };

  if (!amount || !currency) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  try {
    const paymentIntent = await createPaymentIntent(user.id, amount, currency);
    return NextResponse.json(paymentIntent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
