import type { Transaction } from "sequelize";
import type { RefreshTokenEntity } from "./refresh-token.entity";

export type CreateRefreshToken = {
  user_id: number;
  rtk_txt_hash: string;
  rtk_dat_expires_at: Date;
  rtk_txt_user_agent?: string | null;
  rtk_txt_ip?: string | null;
};

export interface RefreshTokenRepository {
  create(data: CreateRefreshToken, transaction?: Transaction): Promise<RefreshTokenEntity>;
  findValidByHash(
    hash: string,
    now: Date,
    transaction?: Transaction,
  ): Promise<RefreshTokenEntity | null>;
  findByHash(hash: string, transaction?: Transaction): Promise<RefreshTokenEntity | null>;
  revokeById(id: string, revokedAt: Date, transaction?: Transaction): Promise<void>;
  updateLastUsed(id: string, lastUsedAt: Date, transaction?: Transaction): Promise<void>;
}
