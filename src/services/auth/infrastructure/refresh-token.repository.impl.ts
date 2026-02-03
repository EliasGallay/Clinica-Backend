import { Op, type Transaction } from "sequelize";
import type { RefreshTokenEntity } from "../domain/refresh-token.entity";
import type {
  CreateRefreshToken,
  RefreshTokenRepository,
} from "../domain/refresh-token.repository";
import { RefreshTokensModel } from "../../../infrastructure/db";
import type { RefreshTokenModelInstance } from "./data/refresh-token.types";

const toEntity = (model: RefreshTokenModelInstance): RefreshTokenEntity => ({
  rtk_id: model.rtk_id,
  user_id: model.user_id,
  rtk_txt_hash: model.rtk_txt_hash,
  rtk_dat_expires_at: model.rtk_dat_expires_at,
  rtk_dat_revoked_at: model.rtk_dat_revoked_at,
  rtk_dat_created_at: model.rtk_dat_created_at,
  rtk_dat_last_used_at: model.rtk_dat_last_used_at,
  rtk_txt_user_agent: model.rtk_txt_user_agent,
  rtk_txt_ip: model.rtk_txt_ip,
});

export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  async create(data: CreateRefreshToken, transaction?: Transaction): Promise<RefreshTokenEntity> {
    const model = (await (RefreshTokensModel as typeof RefreshTokensModel).create(data, {
      transaction,
    })) as RefreshTokenModelInstance;
    return toEntity(model);
  }

  async findValidByHash(
    hash: string,
    now: Date,
    transaction?: Transaction,
  ): Promise<RefreshTokenEntity | null> {
    const model = (await (RefreshTokensModel as typeof RefreshTokensModel).findOne({
      where: {
        rtk_txt_hash: hash,
        rtk_dat_revoked_at: null,
        rtk_dat_expires_at: { [Op.gt]: now },
      },
      transaction,
    })) as RefreshTokenModelInstance | null;
    return model ? toEntity(model) : null;
  }

  async findByHash(hash: string, transaction?: Transaction): Promise<RefreshTokenEntity | null> {
    const model = (await (RefreshTokensModel as typeof RefreshTokensModel).findOne({
      where: { rtk_txt_hash: hash },
      transaction,
    })) as RefreshTokenModelInstance | null;
    return model ? toEntity(model) : null;
  }

  async revokeById(id: string, revokedAt: Date, transaction?: Transaction): Promise<void> {
    await (RefreshTokensModel as typeof RefreshTokensModel).update(
      { rtk_dat_revoked_at: revokedAt, rtk_dat_last_used_at: revokedAt },
      { where: { rtk_id: id }, transaction },
    );
  }

  async updateLastUsed(id: string, lastUsedAt: Date, transaction?: Transaction): Promise<void> {
    await (RefreshTokensModel as typeof RefreshTokensModel).update(
      { rtk_dat_last_used_at: lastUsedAt },
      { where: { rtk_id: id }, transaction },
    );
  }
}
