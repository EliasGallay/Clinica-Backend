import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class RolModel extends Model {
    declare id: string;
    declare rol_name: string;
    declare rol_description: string | null;
    declare rol_weight: number | null;

    static associate(models: { users?: ModelStatic<Model>; usr_rol?: ModelStatic<Model> }) {
      if (models.users && models.usr_rol) {
        RolModel.belongsToMany(models.users, {
          through: models.usr_rol,
          as: "users",
          foreignKey: "rol_id",
          otherKey: "user_id",
        });
      }
    }
  }

  RolModel.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      rol_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "rol_name",
      },
      rol_description: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "rol_description",
      },
      rol_weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "rol_weight",
      },
    },
    {
      modelName: "rol",
      tableName: "rol",
      sequelize,
      timestamps: false,
      paranoid: false,
    },
  );

  return RolModel;
};
