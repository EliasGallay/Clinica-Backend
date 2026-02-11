import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { ModulesTableAttributes, ModulesTableCreationAttributes } from "./modulesTable.types";

export default (sequelize: Sequelize) => {
  class ModulesTableModel
    extends Model<ModulesTableAttributes, ModulesTableCreationAttributes>
    implements ModulesTableAttributes
  {
    declare mod_id: number;
    declare mod_txt_key: string;
    declare mod_txt_name: string;
    declare mod_int_order: number;
    declare mod_sta_state: number;
    declare mod_dat_created_at: Date;
    declare mod_dat_updated_at: Date;
    declare mod_dat_deleted_at: Date | null;
    declare mod_path_to: string;

    static associate(models: { submodules?: ModelStatic<Model> }) {
      if (models.submodules) {
        ModulesTableModel.hasMany(models.submodules, {
          foreignKey: "mod_id",
          as: "mod_submodules",
        });
      }
    }
  }

  ModulesTableModel.init(
    {
      mod_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "mod_id",
      },
      mod_txt_key: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: "mod_txt_key",
        unique: "uq_modules_key",
      },
      mod_txt_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "mod_txt_name",
      },
      mod_int_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "mod_int_order",
      },
      mod_sta_state: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "mod_sta_state",
      },
      mod_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "mod_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      mod_dat_updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "mod_dat_updated_at",
        defaultValue: DataTypes.NOW,
      },
      mod_dat_deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "mod_dat_deleted_at",
      },
      mod_path_to: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: "mod_path_to",
      },
    },
    {
      modelName: "modules",
      tableName: "modules",
      sequelize,
      timestamps: false,
      paranoid: true,
      deletedAt: "mod_dat_deleted_at",
    },
  );

  return ModulesTableModel;
};
