import type { Model } from "sequelize";

export type RolesAttributes = {
  id: string;
  rol_name: string;
  rol_description: string | null;
  rol_weight: number | null;
};

export type RolesModelInstance = Model<RolesAttributes> & RolesAttributes;
