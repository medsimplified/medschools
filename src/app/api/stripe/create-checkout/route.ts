import { NextResponse } from "next/server";

const message = {
  error: "This checkout route has been replaced. Use /api/razorpay/create-order instead.",
};

export async function POST() {
  return NextResponse.json(message, { status: 410 });
}
