import type { EmailSender } from "../domain/email-sender";

export class ConsoleEmailSender implements EmailSender {
  async sendVerificationEmail(to: string, code: string): Promise<void> {
    console.info(`[email] verify-email to=${to} code=${code}`);
  }

  async sendPasswordResetEmail(to: string, code: string): Promise<void> {
    console.info(`[email] reset-password to=${to} code=${code}`);
  }
}
