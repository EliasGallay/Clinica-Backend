import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type {
  RolPermissionsAttributes,
  RolPermissionsCreationAttributes,
} from "./rol-permissions.types";
import { toDefaultValue } from "sequelize/types/utils";

export default (sequelize: Sequelize) => {
  class RolPermissionModel
    extends Model<RolPermissionsAttributes, RolPermissionsCreationAttributes>
    implements RolPermissionsAttributes
  {
    declare rpe_id: number;
    declare rol_id: string;
    declare rpe_permission_txt_name: string;
    declare rpe_bol_can_read: boolean;
    declare rpe_bol_can_write: boolean;
    declare rpe_dat_created_at: Date;
    declare rpe_dat_updated_at: Date;
    declare rpe_permission_txt_description: string;

    static associate(models: { rol?: ModelStatic<Model> }) {
      if (models.rol) {
        RolPermissionModel.belongsTo(models.rol, { foreignKey: "rol_id", as: "role" });
      }
    }
  }

  RolPermissionModel.init(
    {
      rpe_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "rpe_id",
      },
      rol_id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "rol_id",
      },
      rpe_permission_txt_name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: "rpe_permission_txt_name",
      },
      rpe_bol_can_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "rpe_bol_can_read",
        defaultValue: false,
      },
      rpe_bol_can_write: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "rpe_bol_can_write",
        defaultValue: false,
      },
      rpe_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "rpe_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      rpe_dat_updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "rpe_dat_updated_at",
        defaultValue: DataTypes.NOW,
      },
      rpe_permission_txt_description: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: "rpe_permission_txt_description",
      },
    },
    {
      modelName: "rol_permission",
      tableName: "rol_permission",
      sequelize,
      timestamps: false,
      paranoid: false,
      indexes: [{ unique: true, fields: ["rol_id", "rpe_permission_txt_name"] }],
    },
  );

  return RolPermissionModel;
};
