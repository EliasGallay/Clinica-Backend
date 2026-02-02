import nodemailer from "nodemailer";
import type { EmailSender } from "../domain/email-sender";

export class MailerSendEmailSender implements EmailSender {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor() {
    const host = process.env.SMTP_HOST ?? "";
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER ?? "";
    const pass = process.env.SMTP_PASS ?? "";
    this.from = process.env.MAIL_FROM ?? "";

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
      requireTLS: true,
    });
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: "Verificacion de correo",
      text: `Tu codigo de verificacion es: ${code}`,
    });
  }

  async sendPasswordResetEmail(to: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: "Reset de password",
      text: `Tu codigo de recuperacion es: ${code}`,
    });
  }
}
