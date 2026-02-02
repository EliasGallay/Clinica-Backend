import type { Model } from "sequelize";

export type RefreshTokenAttributes = {
  rtk_id: string;
  user_id: number;
  rtk_txt_hash: string;
  rtk_dat_expires_at: Date;
  rtk_dat_revoked_at: Date | null;
  rtk_dat_created_at: Date;
  rtk_dat_last_used_at: Date | null;
  rtk_txt_user_agent: string | null;
  rtk_txt_ip: string | null;
};

export type RefreshTokenCreationAttributes = Omit<
  RefreshTokenAttributes,
  "rtk_id" | "rtk_dat_created_at" | "rtk_dat_revoked_at" | "rtk_dat_last_used_at"
>;

export type RefreshTokenModelInstance = Model<
  RefreshTokenAttributes,
  RefreshTokenCreationAttributes
> &
  RefreshTokenAttributes;
