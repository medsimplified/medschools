import { NextResponse } from "next/server";

const message = {
  error: "This API route has been retired. Use /api/razorpay/config instead.",
};

export async function GET() {
  return NextResponse.json(message, { status: 410 });
}

export async function POST() {
  return NextResponse.json(message, { status: 410 });
}
