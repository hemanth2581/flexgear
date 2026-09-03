export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId: string;
}

export interface IEmailProvider {
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>;
}
