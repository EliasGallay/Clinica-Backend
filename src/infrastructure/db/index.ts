import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, ENV } from "../../config/const";
import initUsersModel from "../../services/users/infrastructure/data/users.model.postgres";
import initRolModel from "../../services/users/infrastructure/data/rol.model.postgres";
import initUsrRolModel from "../../services/users/infrastructure/data/usr-rol.model.postgres";
import initRefreshTokenModel from "../../services/auth/infrastructure/data/refresh-token.model.postgres";
import initPersonsModel from "../../services/persons/infrastructure/data/persons.model.postgres";
import initPatientsModel from "../../services/patients/infrastructure/data/patients.model.postgres";
import initDoctorsModel from "../../services/doctors/infrastructure/data/doctors.model.postgres";
import initRolPermissionModel from "../../services/permissions/infrastructure/data/rol-permission.model.postgres";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: ENV === "development" ? console.log : false,
  define: {
    paranoid: true,
    timestamps: false,
    freezeTableName: true,
  },
});

const modelDefiners = [
  initUsersModel,
  initRolModel,
  initUsrRolModel,
  initRefreshTokenModel,
  initPersonsModel,
  initPatientsModel,
  initDoctorsModel,
  initRolPermissionModel,
];

for (const defineModel of modelDefiners) {
  defineModel(sequelize);
}

type SequelizeModelWithAssociate = {
  associate?: (models: typeof sequelize.models) => void;
};

Object.values(sequelize.models).forEach((model) => {
  const typedModel = model as SequelizeModelWithAssociate;
  if (typedModel.associate) {
    typedModel.associate(sequelize.models);
  }
});

export const UsersModel = sequelize.models.users;
export const RolesModel = sequelize.models.rol;
export const UserRolesModel = sequelize.models.usr_rol;
export const RefreshTokensModel = sequelize.models.refresh_token;
export const PersonsModel = sequelize.models.persons;
export const PatientsModel = sequelize.models.patients;
export const DoctorsModel = sequelize.models.doctors;
export const RolPermissionsModel = sequelize.models.rol_permission;
