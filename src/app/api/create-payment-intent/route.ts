import { NextResponse } from "next/server";

const message = {
  error: "This legacy payment intent route has been retired. Use /api/razorpay/create-order instead.",
};

export async function POST() {
  return NextResponse.json(message, { status: 410 });
}
