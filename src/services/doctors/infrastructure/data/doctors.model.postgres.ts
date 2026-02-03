import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { DoctorsAttributes, DoctorsCreationAttributes } from "./doctors.types";

export default (sequelize: Sequelize) => {
  class DoctorsModel
    extends Model<DoctorsAttributes, DoctorsCreationAttributes>
    implements DoctorsAttributes
  {
    declare doc_id: number;
    declare per_id: number;
    declare doc_txt_license: string | null;
    declare doc_txt_specialty: string | null;
    declare doc_sta_state: number;
    declare doc_dat_created_at: Date;
    declare doc_dat_updated_at: Date;
    declare doc_dat_deleted_at: Date | null;

    static associate(models: { persons?: ModelStatic<Model> }) {
      if (models.persons) {
        DoctorsModel.belongsTo(models.persons, { foreignKey: "per_id", as: "person" });
      }
    }
  }

  DoctorsModel.init(
    {
      doc_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "doc_id",
      },
      per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "per_id",
        unique: true,
      },
      doc_txt_license: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: "doc_txt_license",
      },
      doc_txt_specialty: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "doc_txt_specialty",
      },
      doc_sta_state: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "doc_sta_state",
      },
      doc_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "doc_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      doc_dat_updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "doc_dat_updated_at",
        defaultValue: DataTypes.NOW,
      },
      doc_dat_deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "doc_dat_deleted_at",
      },
    },
    {
      modelName: "doctors",
      tableName: "doctors",
      sequelize,
      timestamps: false,
      paranoid: true,
      deletedAt: "doc_dat_deleted_at",
    },
  );

  return DoctorsModel;
};
