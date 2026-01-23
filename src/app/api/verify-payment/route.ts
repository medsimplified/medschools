import { NextResponse } from "next/server";

const message = {
  error: "Use /api/razorpay/verify for payment verification.",
};

export async function POST() {
  return NextResponse.json(message, { status: 410 });
}
