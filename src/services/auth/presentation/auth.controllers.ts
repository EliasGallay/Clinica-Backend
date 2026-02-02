import type { Request, Response } from "express";
import {
  loginDtoSchema,
  logoutDtoSchema,
  refreshTokenDtoSchema,
  requestPasswordResetDtoSchema,
  registerDtoSchema,
  resendVerificationDtoSchema,
  resetPasswordDtoSchema,
  verifyEmailDtoSchema,
} from "../domain/dtos";
import {
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase,
} from "../domain/use-cases";
import {
  generateVerificationCode,
  getVerificationExpiry,
  hashCode,
} from "../domain/utils/verification";
import { MailerSendEmailSender } from "../infrastructure/mailersend-email-sender";
import { ConsoleEmailSender } from "../infrastructure/console-email-sender";
import { CreateUserUseCase } from "../../users/domain/use-cases";
import { UserPostgresDatasourceImpl } from "../../users/infrastructure/users.datasource.impl";
import { UserRepositoryImpl } from "../../users/infrastructure/users.repository.impl";
import { RefreshTokenRepositoryImpl } from "../infrastructure/refresh-token.repository.impl";
import { hitRateLimit } from "./rate-limit";
import { Role } from "../../../shared/constants";
import { EMAIL_SEND_ENABLED } from "../../../config/const";

const datasource = new UserPostgresDatasourceImpl();
const repository = new UserRepositoryImpl(datasource);
const refreshTokenRepository = new RefreshTokenRepositoryImpl();
const loginUseCase = new LoginUseCase(repository, refreshTokenRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(repository, refreshTokenRepository);
const logoutUseCase = new LogoutUseCase(refreshTokenRepository);
const createUserUseCase = new CreateUserUseCase(repository);
const verifyEmailUseCase = new VerifyEmailUseCase(repository);
const requestPasswordResetUseCase = new RequestPasswordResetUseCase(repository);
const resetPasswordUseCase = new ResetPasswordUseCase(repository);
const emailSender = EMAIL_SEND_ENABLED ? new MailerSendEmailSender() : new ConsoleEmailSender();

const toSafeUser = (user: Awaited<ReturnType<typeof createUserUseCase.execute>>) => {
  const {
    usr_txt_password,
    usr_txt_email_verification_code,
    usr_dat_email_verification_expires_at,
    usr_int_email_verification_attempts,
    usr_dat_email_verification_last_sent_at,
    usr_txt_password_reset_token,
    usr_dat_password_reset_expires_at,
    usr_int_password_reset_attempts,
    usr_dat_password_reset_last_sent_at,
    ...safe
  } = user;
  void usr_txt_password;
  void usr_txt_email_verification_code;
  void usr_dat_email_verification_expires_at;
  void usr_int_email_verification_attempts;
  void usr_dat_email_verification_last_sent_at;
  void usr_txt_password_reset_token;
  void usr_dat_password_reset_expires_at;
  void usr_int_password_reset_attempts;
  void usr_dat_password_reset_last_sent_at;
  return safe;
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const result = await loginUseCase.execute(parsed.data, {
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_INACTIVE") {
      return res.status(403).json({ message: "Account not verified" });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const parsed = refreshTokenDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const result = await refreshTokenUseCase.execute(parsed.data.refreshToken, {
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });
    return res.status(200).json(result);
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const parsed = logoutDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  await logoutUseCase.execute(parsed.data.refreshToken);
  return res.status(200).json({ message: "OK" });
};

export const register = async (req: Request, res: Response) => {
  const parsed = registerDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const user = await createUserUseCase.execute({
      ...parsed.data,
      roles: [Role.PATIENT],
      usr_sta_state: 2,
      usr_sta_employee_state: 1,
      usr_bol_email_verified: false,
    });
    const code = generateVerificationCode();
    const codeHash = await hashCode(code);
    const expiresAt = getVerificationExpiry();

    const updatedUser = await repository.update(user.usr_idt_id, {
      usr_txt_email_verification_code: codeHash,
      usr_dat_email_verification_expires_at: expiresAt,
      usr_int_email_verification_attempts: 0,
      usr_dat_email_verification_last_sent_at: new Date(),
    });

    try {
      await emailSender.sendVerificationEmail(user.usr_txt_email, code);
    } catch (error) {
      console.warn("[email] send verification failed", error);
    }
    if (process.env.NODE_ENV === "development") {
      console.info(`[email] verification code (dev) email=${user.usr_txt_email} code=${code}`);
    }

    return res.status(201).json(toSafeUser(updatedUser ?? user));
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (error instanceof Error && error.message === "DNI_ALREADY_EXISTS") {
      return res.status(409).json({ message: "DNI already exists" });
    }
    if (error instanceof Error && error.message === "ROLE_NOT_FOUND") {
      return res.status(500).json({ message: "Roles not configured" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const parsed = verifyEmailDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  if (hitRateLimit(`verify:${parsed.data.usr_txt_email.toLowerCase()}`, 5)) {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    await verifyEmailUseCase.execute(
      parsed.data.usr_txt_email,
      parsed.data.usr_txt_verification_code,
    );
    return res.status(200).json({ message: "Email verified" });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error instanceof Error && error.message === "VERIFICATION_EXPIRED") {
      return res.status(400).json({ message: "Verification code expired" });
    }
    return res.status(400).json({ message: "Invalid verification code" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const parsed = requestPasswordResetDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  if (hitRateLimit(`reset-request:${parsed.data.usr_txt_email.toLowerCase()}`, 3)) {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    const result = await requestPasswordResetUseCase.execute(parsed.data.usr_txt_email);
    if (result) {
      try {
        await emailSender.sendPasswordResetEmail(parsed.data.usr_txt_email, result.code);
      } catch (error) {
        console.warn("[email] send reset failed", error);
      }
      if (process.env.NODE_ENV === "development") {
        console.info(
          `[email] reset code (dev) email=${parsed.data.usr_txt_email} code=${result.code}`,
        );
      }
    }
    return res.status(200).json({ message: "If the email exists, a reset code was sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  const parsed = resendVerificationDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  if (hitRateLimit(`resend:${parsed.data.usr_txt_email.toLowerCase()}`, 3)) {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    const user = await repository.getByEmail(parsed.data.usr_txt_email);
    if (user && !user.usr_bol_email_verified) {
      const code = generateVerificationCode();
      const codeHash = await hashCode(code);
      const expiresAt = getVerificationExpiry();

      await repository.update(user.usr_idt_id, {
        usr_txt_email_verification_code: codeHash,
        usr_dat_email_verification_expires_at: expiresAt,
        usr_int_email_verification_attempts: 0,
        usr_dat_email_verification_last_sent_at: new Date(),
      });

      try {
        await emailSender.sendVerificationEmail(user.usr_txt_email, code);
      } catch (error) {
        console.warn("[email] resend verification failed", error);
      }
      if (process.env.NODE_ENV === "development") {
        console.info(`[email] resend code (dev) email=${user.usr_txt_email} code=${code}`);
      }
    }
    return res.status(200).json({ message: "If the email exists, a verification code was sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const parsed = resetPasswordDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  if (hitRateLimit(`reset:${parsed.data.usr_txt_email.toLowerCase()}`, 5)) {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    await resetPasswordUseCase.execute(
      parsed.data.usr_txt_email,
      parsed.data.usr_txt_verification_code,
      parsed.data.usr_txt_password,
    );
    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error instanceof Error && error.message === "RESET_EXPIRED") {
      return res.status(400).json({ message: "Reset code expired" });
    }
    return res.status(400).json({ message: "Invalid reset code" });
  }
};
