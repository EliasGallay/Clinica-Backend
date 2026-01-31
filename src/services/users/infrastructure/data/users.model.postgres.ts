import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { UsersAttributes, UsersCreationAttributes } from "./users.types";

export default (sequelize: Sequelize) => {
  class UserModel
    extends Model<UsersAttributes, UsersCreationAttributes>
    implements UsersAttributes
  {
    declare usr_idt_id: number;
    declare loc_idt_id: number;
    declare usr_txt_name: string;
    declare usr_txt_lastname: string;
    declare usr_txt_dni: string;
    declare usr_dat_dateofbirth: Date;
    declare usr_int_gender: number;
    declare usr_txt_celphone: string | null;
    declare usr_txt_cuit_cuil: string;
    declare usr_txt_email: string;
    declare usr_txt_streetname: string;
    declare usr_txt_streetnumber: string;
    declare usr_txt_floor: string | null;
    declare usr_txt_department: string | null;
    declare usr_txt_postalcode: string;
    declare usr_int_rol: number;
    declare usr_dat_registrationdate: Date;
    declare usr_int_registerorigin: number;
    declare usr_txt_registeroriginhash: string | null;
    declare usr_dat_terminationdate: Date | null;
    declare usr_int_image: number | null;
    declare usr_txt_password: string | null;
    declare usr_txt_token: string | null;
    declare usr_sta_state: number;
    declare usr_sta_employee_state: number;
    declare usr_txt_verification_code: string | null;
    declare date_deleted_at: Date | null;
    declare usr_txt_image_ext: string | null;

    static associate(models: {
      loan_application?: ModelStatic<Model>;
      rls_usu_org_broker?: ModelStatic<Model>;
      notification?: ModelStatic<Model>;
      locality?: ModelStatic<Model>;
    }) {
      void models;
    }
  }

  UserModel.init(
    {
      usr_idt_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "usr_idt_id",
      },
      loc_idt_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "loc_idt_id",
      },
      usr_txt_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "usr_txt_name",
      },
      usr_txt_lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "usr_txt_lastname",
      },
      usr_txt_dni: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "usr_txt_dni",
      },
      usr_dat_dateofbirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "usr_dat_dateofbirth",
      },
      usr_int_gender: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_int_gender",
      },
      usr_txt_celphone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "usr_txt_celphone",
      },
      usr_txt_cuit_cuil: {
        type: DataTypes.STRING(11),
        allowNull: false,
        field: "usr_txt_cuit_cuil",
      },
      usr_txt_email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "usr_txt_email",
        validate: {
          isEmail: {
            msg: "Email address must be valid.",
          },
        },
        set(value: string) {
          this.setDataValue("usr_txt_email", value.toLowerCase());
        },
      },
      usr_txt_streetname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "usr_txt_streetname",
      },
      usr_txt_streetnumber: {
        type: DataTypes.STRING(4),
        allowNull: false,
        field: "usr_txt_streetnumber",
      },
      usr_txt_floor: {
        type: DataTypes.STRING(2),
        allowNull: true,
        field: "usr_txt_floor",
      },
      usr_txt_department: {
        type: DataTypes.STRING(4),
        allowNull: true,
        field: "usr_txt_department",
      },
      usr_txt_postalcode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "usr_txt_postalcode",
      },
      usr_int_rol: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_int_rol",
      },
      usr_dat_registrationdate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "usr_dat_registrationdate",
      },
      usr_int_registerorigin: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_int_registerorigin",
      },
      usr_txt_registeroriginhash: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "usr_txt_registeroriginhash",
      },
      usr_dat_terminationdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "usr_dat_terminationdate",
      },
      usr_int_image: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "usr_int_image",
      },
      usr_txt_password: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "usr_txt_password",
      },
      usr_txt_token: {
        type: DataTypes.STRING(250),
        allowNull: true,
        field: "usr_txt_token",
      },
      usr_sta_state: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_sta_state",
      },
      usr_sta_employee_state: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_sta_employee_state",
      },
      usr_txt_verification_code: {
        type: DataTypes.STRING(6),
        allowNull: true,
        field: "usr_txt_verification_code",
      },
      date_deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "date_deleted_at",
      },
      usr_txt_image_ext: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "usr_txt_image_ext",
      },
    },
    {
      modelName: "users",
      tableName: "users",
      sequelize,
      timestamps: false,
      paranoid: true,
      deletedAt: "date_deleted_at",
    },
  );

  return UserModel;
};
