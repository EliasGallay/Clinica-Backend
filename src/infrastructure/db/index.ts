import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, ENV } from "../../config/const";
import initUsersModel from "../../services/users/infrastructure/data/users.model.postgres";

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

const modelDefiners = [initUsersModel];

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
