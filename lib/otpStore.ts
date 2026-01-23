const otpMap = new Map<string, string>();
const otpTimestampMap = new Map<string, number>();

export const storeOtp = (email: string, otp: string) => {
  otpMap.set(email, otp);
  otpTimestampMap.set(email, Date.now());
  setTimeout(() => {
    otpMap.delete(email);
    otpTimestampMap.delete(email);
  }, 5 * 60 * 1000); // Clear after 5 mins
};

export const verifyOtp = (email: string, otp: string) => {
  return otpMap.get(email) === otp;
};

export const canResendOtp = (email: string): boolean => {
  const lastSent = otpTimestampMap.get(email);
  if (!lastSent) return true;
  return Date.now() - lastSent >= 60 * 1000; // 60 seconds cooldown
};
