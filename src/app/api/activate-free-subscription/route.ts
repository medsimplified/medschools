import { NextResponse } from 'next/server';
// Import your User model
// import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId, planId } = await req.json();

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate end date (30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const planNames = {
      basic: 'Basic Plan',
      standard: 'Standard Plan',
      premium: 'Premium Plan'
    };

    // Update user subscription
    // await User.findByIdAndUpdate(userId, {
    //   'subscription.status': 'active',
    //   'subscription.paymentStatus': 'completed',
    //   'subscription.planId': planId,
    //   'subscription.planName': planNames[planId as keyof typeof planNames],
    //   'subscription.startDate': startDate,
    //   'subscription.endDate': endDate,
    //   'subscription.paymentId': 'FREE_TRIAL',
    //   hasActiveSubscription: true
    // });

    return NextResponse.json({ 
      success: true,
      message: 'Free subscription activated successfully'
    });
  } catch (error) {
    console.error('Free subscription activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate subscription' },
      { status: 500 }
    );
  }
}
