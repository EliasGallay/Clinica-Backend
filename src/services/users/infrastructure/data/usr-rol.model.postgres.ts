import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class UsrRolModel extends Model {
    declare user_id: number;
    declare rol_id: string;

    static associate(models: {
      users?: ModelStatic<Model>;
      rol?: ModelStatic<Model>;
    }) {
      if (models.users) {
        UsrRolModel.belongsTo(models.users, { foreignKey: "user_id", as: "user" });
      }
      if (models.rol) {
        UsrRolModel.belongsTo(models.rol, { foreignKey: "rol_id", as: "role" });
      }
    }
  }

  UsrRolModel.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "user_id",
      },
      rol_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "rol_id",
      },
    },
    {
      modelName: "usr_rol",
      tableName: "usr_rol",
      sequelize,
      timestamps: false,
      paranoid: false,
    },
  );

  return UsrRolModel;
};
