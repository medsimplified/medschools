import { NextResponse } from "next/server";

const message = {
  error: "This webhook route is disabled. Razorpay handles payment lifecycle now.",
};

export async function POST() {
  return NextResponse.json(message, { status: 410 });
}
