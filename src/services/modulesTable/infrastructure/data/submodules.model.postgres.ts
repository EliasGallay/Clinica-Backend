import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { SubmodulesAttributes, SubmodulesCreationAttributes } from "./submodules.types";

export default (sequelize: Sequelize) => {
  class SubmodulesModel
    extends Model<SubmodulesAttributes, SubmodulesCreationAttributes>
    implements SubmodulesAttributes
  {
    declare sub_id: number;
    declare mod_id: number;
    declare sub_txt_key: string;
    declare sub_txt_name: string;
    declare sub_int_order: number;
    declare sub_sta_state: number;
    declare sub_dat_created_at: Date;
    declare sub_dat_updated_at: Date;
    declare sub_dat_deleted_at: Date | null;
    declare sub_path_to: string;
    declare sub_icon: string | null;

    static associate(models: { modules?: ModelStatic<Model> }) {
      if (models.modules) {
        SubmodulesModel.belongsTo(models.modules, { foreignKey: "mod_id", as: "module" });
      }
    }
  }

  SubmodulesModel.init(
    {
      sub_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "sub_id",
      },
      mod_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "mod_id",
      },
      sub_txt_key: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: "sub_txt_key",
      },
      sub_txt_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "sub_txt_name",
      },
      sub_int_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "sub_int_order",
      },
      sub_sta_state: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "sub_sta_state",
      },
      sub_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "sub_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      sub_dat_updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "sub_dat_updated_at",
        defaultValue: DataTypes.NOW,
      },
      sub_dat_deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "sub_dat_deleted_at",
      },
      sub_path_to: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: "sub_path_to",
      },
      sub_icon: {
        type: DataTypes.STRING(60),
        allowNull: true,
        field: "sub_icon",
      },
    },
    {
      modelName: "submodules",
      tableName: "submodules",
      sequelize,
      timestamps: false,
      paranoid: true,
      deletedAt: "sub_dat_deleted_at",
      indexes: [
        { unique: true, name: "uq_submodules_mod_key", fields: ["mod_id", "sub_txt_key"] },
        { name: "idx_submodules_mod", fields: ["mod_id"] },
      ],
    },
  );

  return SubmodulesModel;
};
