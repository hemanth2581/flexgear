export interface SendOtpResult {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
}

export interface IOtpProvider {
  sendOtp(phone: string, otp: string): Promise<SendOtpResult>;
}
