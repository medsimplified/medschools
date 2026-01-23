import sgMail from "@sendgrid/mail";

// Allow swapping to a non-delivery mode for local/testing usage
const transportMode = process.env.MAIL_TRANSPORT ?? "sendgrid";
const sendGridKey = process.env.SENDGRID_API_KEY;
const sendFrom = process.env.SENDGRID_FROM ?? process.env.EMAIL_FROM;

if (transportMode === "sendgrid") {
  if (!sendGridKey) {
    console.warn("⚠️ SENDGRID_API_KEY is not set; OTP emails will be logged instead of sent.");
  } else {
    sgMail.setApiKey(sendGridKey);
  }

  if (!sendFrom) {
    console.warn("⚠️ SENDGRID_FROM or EMAIL_FROM is not set; OTP emails will be logged instead of sent.");
  }
}

export async function sendOtpEmail(email: string, otp: string) {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hello,</p>
      <p>Your OTP code is: <strong style="font-size: 20px;">${otp}</strong></p>
      <p>This code is valid for 15 minutes.</p>
      <p>Thank you.......</p>
    </div>
  `;

  // Provide a deterministic fallback for local development or missing config
  if (transportMode === "log" || !sendGridKey || !sendFrom) {
    console.log(`📧 OTP ${otp} prepared for ${email} (log transport)`);
    console.log(htmlBody);
    return;
  }

  try {
    const [response] = await sgMail.send({
      to: email,
      from: sendFrom,
      subject: "Your Verification Code",
      html: htmlBody,
    });
    console.log(`📧 OTP ${otp} sent to ${email} (status: ${response.statusCode})`);
  } catch (err: any) {
    console.error("❌ Failed to send OTP email via SendGrid:", err);
    throw new Error("Failed to send OTP email");
  }
}
