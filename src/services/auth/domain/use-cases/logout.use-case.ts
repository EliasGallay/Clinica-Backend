import type { RefreshTokenRepository } from "../refresh-token.repository";
import { hashRefreshToken } from "../utils/refresh-token";

export class LogoutUseCase {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async execute(refreshToken: string): Promise<void> {
    const hash = hashRefreshToken(refreshToken);
    const stored = await this.refreshTokenRepository.findByHash(hash);
    if (!stored) return;
    await this.refreshTokenRepository.revokeById(stored.rtk_id, new Date());
  }
}
