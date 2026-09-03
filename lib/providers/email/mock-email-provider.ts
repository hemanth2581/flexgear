import { IEmailProvider, SendEmailParams, SendEmailResult } from './types';

export class MockEmailProvider implements IEmailProvider {
  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    const messageId = `mock_msg_${Date.now()}`;

    console.log(`\n======================================================`);
    console.log(`[MOCK EMAIL SERVICE] Outgoing Message Dispatch`);
    console.log(`To        : ${params.to}`);
    console.log(`Subject   : ${params.subject}`);
    console.log(`Message ID: ${messageId}`);
    console.log(`Content   :`);
    console.log(params.text || params.html.replace(/<[^>]*>?/gm, ' '));
    console.log(`======================================================\n`);

    return {
      success: true,
      messageId,
    };
  }
}
