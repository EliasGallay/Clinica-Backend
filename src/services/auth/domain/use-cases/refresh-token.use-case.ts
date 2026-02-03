import type { UserRepository } from "../../../users/domain/user.repository";
import type { RefreshTokenRepository } from "../refresh-token.repository";
import { signToken } from "../../../../config/adapters/jwt.adapter";
import { sequelize } from "../../../../infrastructure/db";
import {
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "../utils/refresh-token";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(
    refreshToken: string,
    meta?: { userAgent?: string | null; ip?: string | null },
  ): Promise<{ token: string; refreshToken: string }> {
    const now = new Date();
    const hash = hashRefreshToken(refreshToken);
    const stored = await this.refreshTokenRepository.findValidByHash(hash, now);
    if (!stored) {
      throw new Error("INVALID_REFRESH");
    }

    const user = await this.userRepository.getById(stored.user_id);
    if (!user || !user.usr_bol_email_verified || user.usr_sta_state !== 1) {
      await this.refreshTokenRepository.revokeById(stored.rtk_id, now);
      throw new Error("INVALID_REFRESH");
    }

    const newRefreshToken = generateRefreshToken();
    const newHash = hashRefreshToken(newRefreshToken);
    const newExpiresAt = getRefreshTokenExpiry();

    await sequelize.transaction(async (transaction) => {
      await this.refreshTokenRepository.revokeById(stored.rtk_id, now, transaction);
      await this.refreshTokenRepository.create(
        {
          user_id: stored.user_id,
          rtk_txt_hash: newHash,
          rtk_dat_expires_at: newExpiresAt,
          rtk_txt_user_agent: meta?.userAgent ?? null,
          rtk_txt_ip: meta?.ip ?? null,
        },
        transaction,
      );
    });

    const token = signToken({
      usr_idt_id: user.usr_idt_id,
      usr_txt_email: user.usr_txt_email,
      roles: user.roles,
      ver: user.usr_int_token_version,
    });

    return { token, refreshToken: newRefreshToken };
  }
}
