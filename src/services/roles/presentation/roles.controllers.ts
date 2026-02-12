import type { Request, Response } from "express";
import { RolesPostgresDatasourceImpl } from "../infrastructure/roles.datasource.impl";
import { RoleRepositoryImpl } from "../infrastructure/roles.repository.impl";
import { GetRolesUseCase } from "../domain/use-cases";

const datasource = new RolesPostgresDatasourceImpl();
const repository = new RoleRepositoryImpl(datasource);
const getRolesUseCase = new GetRolesUseCase(repository);

export const getAllRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await getRolesUseCase.execute();
    return res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
