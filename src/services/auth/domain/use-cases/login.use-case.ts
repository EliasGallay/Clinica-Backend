import bcrypt from "bcryptjs";
import type { LoginDto } from "../dtos";
import type { UserRepository } from "../../../users/domain/user.repository";
import { signToken } from "../../../../config/adapters/jwt.adapter";
import type { RefreshTokenRepository } from "../refresh-token.repository";
import {
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "../utils/refresh-token";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(
    data: LoginDto,
    meta?: { userAgent?: string | null; ip?: string | null },
  ): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userRepository.getByEmail(data.usr_txt_email);
    if (!user || !user.usr_txt_password) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(data.usr_txt_password, user.usr_txt_password);
    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.usr_bol_email_verified || user.usr_sta_state !== 1) {
      throw new Error("ACCOUNT_INACTIVE");
    }

    const token = signToken({
      usr_idt_id: user.usr_idt_id,
      usr_txt_email: user.usr_txt_email,
      roles: user.roles,
    });

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = getRefreshTokenExpiry();

    await this.refreshTokenRepository.create({
      user_id: user.usr_idt_id,
      rtk_txt_hash: refreshTokenHash,
      rtk_dat_expires_at: refreshTokenExpiresAt,
      rtk_txt_user_agent: meta?.userAgent ?? null,
      rtk_txt_ip: meta?.ip ?? null,
    });

    return { token, refreshToken };
  }
}
