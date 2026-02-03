import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { PersonsAttributes, PersonsCreationAttributes } from "./persons.types";

export default (sequelize: Sequelize) => {
  class PersonsModel
    extends Model<PersonsAttributes, PersonsCreationAttributes>
    implements PersonsAttributes
  {
    declare per_id: number;
    declare per_txt_first_name: string;
    declare per_txt_last_name: string;
    declare per_txt_dni: string | null;
    declare per_dat_birthdate: Date | null;
    declare per_int_gender: number | null;
    declare per_txt_email: string | null;
    declare per_txt_phone: string | null;
    declare per_txt_address: string | null;
    declare per_sta_state: number;
    declare per_dat_created_at: Date;
    declare per_dat_updated_at: Date;
    declare per_dat_deleted_at: Date | null;

    static associate(models: {
      users?: ModelStatic<Model>;
      patients?: ModelStatic<Model>;
      doctors?: ModelStatic<Model>;
    }) {
      if (models.users) {
        PersonsModel.hasOne(models.users, { foreignKey: "per_id", as: "user" });
      }
      if (models.patients) {
        PersonsModel.hasOne(models.patients, { foreignKey: "per_id", as: "patient" });
      }
      if (models.doctors) {
        PersonsModel.hasOne(models.doctors, { foreignKey: "per_id", as: "doctor" });
      }
    }
  }

  PersonsModel.init(
    {
      per_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "per_id",
      },
      per_txt_first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "per_txt_first_name",
      },
      per_txt_last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "per_txt_last_name",
      },
      per_txt_dni: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "per_txt_dni",
        unique: true,
      },
      per_dat_birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "per_dat_birthdate",
      },
      per_int_gender: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: "per_int_gender",
      },
      per_txt_email: {
        type: DataTypes.STRING(254),
        allowNull: true,
        field: "per_txt_email",
        validate: {
          isEmail: {
            msg: "Email address must be valid.",
          },
        },
        set(value: string | null) {
          if (typeof value === "string") {
            this.setDataValue("per_txt_email", value.toLowerCase());
          } else {
            this.setDataValue("per_txt_email", null);
          }
        },
      },
      per_txt_phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: "per_txt_phone",
      },
      per_txt_address: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "per_txt_address",
      },
      per_sta_state: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "per_sta_state",
      },
      per_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "per_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      per_dat_updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "per_dat_updated_at",
        defaultValue: DataTypes.NOW,
      },
      per_dat_deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "per_dat_deleted_at",
      },
    },
    {
      modelName: "persons",
      tableName: "persons",
      sequelize,
      timestamps: false,
      paranoid: true,
      deletedAt: "per_dat_deleted_at",
    },
  );

  return PersonsModel;
};
