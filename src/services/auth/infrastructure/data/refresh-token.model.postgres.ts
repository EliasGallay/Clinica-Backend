import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { RefreshTokenAttributes, RefreshTokenCreationAttributes } from "./refresh-token.types";

export default (sequelize: Sequelize) => {
  class RefreshTokenModel
    extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes
  {
    declare rtk_id: string;
    declare user_id: number;
    declare rtk_txt_hash: string;
    declare rtk_dat_expires_at: Date;
    declare rtk_dat_revoked_at: Date | null;
    declare rtk_dat_created_at: Date;
    declare rtk_dat_last_used_at: Date | null;
    declare rtk_txt_user_agent: string | null;
    declare rtk_txt_ip: string | null;

    static associate(models: { users?: ModelStatic<Model> }) {
      if (models.users) {
        RefreshTokenModel.belongsTo(models.users, {
          foreignKey: "user_id",
          as: "user",
        });
      }
    }
  }

  RefreshTokenModel.init(
    {
      rtk_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "rtk_id",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      rtk_txt_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: "rtk_txt_hash",
      },
      rtk_dat_expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "rtk_dat_expires_at",
      },
      rtk_dat_revoked_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "rtk_dat_revoked_at",
      },
      rtk_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "rtk_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      rtk_dat_last_used_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "rtk_dat_last_used_at",
      },
      rtk_txt_user_agent: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "rtk_txt_user_agent",
      },
      rtk_txt_ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "rtk_txt_ip",
      },
    },
    {
      modelName: "refresh_token",
      tableName: "refresh_token",
      sequelize,
      timestamps: false,
    },
  );

  return RefreshTokenModel;
};
