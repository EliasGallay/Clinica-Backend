import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { PatientsAttributes, PatientsCreationAttributes } from "./patients.types";

export default (sequelize: Sequelize) => {
  class PatientsModel
    extends Model<PatientsAttributes, PatientsCreationAttributes>
    implements PatientsAttributes
  {
    declare pat_id: number;
    declare per_id: number;
    declare pat_sta_state: number;
    declare pat_dat_created_at: Date;
    declare pat_dat_updated_at: Date;
    declare pat_dat_deleted_at: Date | null;

    static associate(models: { persons?: ModelStatic<Model> }) {
      if (models.persons) {
        PatientsModel.belongsTo(models.persons, { foreignKey: "per_id", as: "person" });
      }
    }
  }

  PatientsModel.init(
    {
      pat_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "pat_id",
      },
      per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "per_id",
        unique: true,
      },
      pat_sta_state: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "pat_sta_state",
      },
      pat_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "pat_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      pat_dat_updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "pat_dat_updated_at",
        defaultValue: DataTypes.NOW,
      },
      pat_dat_deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "pat_dat_deleted_at",
      },
    },
    {
      modelName: "patients",
      tableName: "patients",
      sequelize,
      timestamps: false,
      paranoid: true,
      deletedAt: "pat_dat_deleted_at",
    },
  );

  return PatientsModel;
};
