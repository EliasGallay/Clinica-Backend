import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import type { UsersAttributes, UsersCreationAttributes } from "./users.types";

export default (sequelize: Sequelize) => {
  class UserModel
    extends Model<UsersAttributes, UsersCreationAttributes>
    implements UsersAttributes
  {
    declare usr_idt_id: number;
    declare usr_txt_email: string;
    declare usr_txt_password: string;
    declare usr_bol_email_verified: boolean;
    declare usr_int_rol: number;
    declare usr_sta_state: number;
    declare usr_sta_employee_state: number;
    declare usr_txt_email_verification_code: string | null;
    declare usr_dat_email_verification_expires_at: Date | null;
    declare usr_int_email_verification_attempts: number;
    declare usr_dat_email_verification_last_sent_at: Date | null;
    declare usr_txt_password_reset_token: string | null;
    declare usr_dat_password_reset_expires_at: Date | null;
    declare usr_int_password_reset_attempts: number;
    declare usr_dat_password_reset_last_sent_at: Date | null;
    declare usr_dat_created_at: Date;
    declare usr_dat_updated_at: Date;
    declare date_deleted_at: Date | null;

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
      usr_txt_email: {
        type: DataTypes.STRING(254),
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
      usr_txt_password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "usr_txt_password",
      },
      usr_bol_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "usr_bol_email_verified",
        defaultValue: false,
      },
      usr_int_rol: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_int_rol",
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
      usr_txt_email_verification_code: {
        type: DataTypes.STRING(60),
        allowNull: true,
        field: "usr_txt_email_verification_code",
      },
      usr_dat_email_verification_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "usr_dat_email_verification_expires_at",
      },
      usr_int_email_verification_attempts: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_int_email_verification_attempts",
        defaultValue: 0,
      },
      usr_dat_email_verification_last_sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "usr_dat_email_verification_last_sent_at",
      },
      usr_txt_password_reset_token: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: "usr_txt_password_reset_token",
      },
      usr_dat_password_reset_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "usr_dat_password_reset_expires_at",
      },
      usr_int_password_reset_attempts: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: "usr_int_password_reset_attempts",
        defaultValue: 0,
      },
      usr_dat_password_reset_last_sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "usr_dat_password_reset_last_sent_at",
      },
      usr_dat_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "usr_dat_created_at",
        defaultValue: DataTypes.NOW,
      },
      usr_dat_updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "usr_dat_updated_at",
        defaultValue: DataTypes.NOW,
      },
      date_deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "date_deleted_at",
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
