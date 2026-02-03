import type { UserRepository } from "../../../users/domain/user.repository";
import { sequelize } from "../../../../infrastructure/db";
import type { RefreshTokenRepository } from "../refresh-token.repository";
import { hashRefreshToken } from "../utils/refresh-token";

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const hash = hashRefreshToken(refreshToken);
    const stored = await this.refreshTokenRepository.findByHash(hash);
    if (!stored) return;
    const now = new Date();
    await sequelize.transaction(async (transaction) => {
      await this.refreshTokenRepository.revokeById(stored.rtk_id, now, transaction);
      await this.userRepository.incrementTokenVersion(stored.user_id, transaction);
    });
  }
}
