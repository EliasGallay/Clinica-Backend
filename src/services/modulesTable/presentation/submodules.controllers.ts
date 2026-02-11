import type { Request, Response } from "express";
import { z } from "zod";
import { ModulesPostgresDatasourceImpl } from "../infrastructure/modules.datasource.impl";
import { ModulesRepositoryImpl } from "../infrastructure/modules.repository.impl";
import { SubmodulesPostgresDatasourceImpl } from "../infrastructure/submodules.datasource.impl";
import { SubmodulesRepositoryImpl } from "../infrastructure/submodules.repository.impl";
import {
  CreateSubmoduleUseCase,
  DeleteSubmoduleUseCase,
  GetSubmoduleByIdUseCase,
  GetSubmodulesUseCase,
  UpdateSubmoduleUseCase,
} from "../domain/use-cases";
import type { ResDTO } from "../domain/dtos";

const modulesDatasource = new ModulesPostgresDatasourceImpl();
const modulesRepository = new ModulesRepositoryImpl(modulesDatasource);
const submodulesDatasource = new SubmodulesPostgresDatasourceImpl();
const submodulesRepository = new SubmodulesRepositoryImpl(submodulesDatasource);

const getSubmodulesUseCase = new GetSubmodulesUseCase(submodulesRepository, modulesRepository);
const getSubmoduleByIdUseCase = new GetSubmoduleByIdUseCase(submodulesRepository);
const createSubmoduleUseCase = new CreateSubmoduleUseCase(submodulesRepository, modulesRepository);
const updateSubmoduleUseCase = new UpdateSubmoduleUseCase(submodulesRepository, modulesRepository);
const deleteSubmoduleUseCase = new DeleteSubmoduleUseCase(submodulesRepository);

const idSchema = z.coerce.number().int().positive();

const ok = <T>(res: Response, status: number, data: T, message = "OK") => {
  const payload: ResDTO<T> = { message, data };
  return res.status(status).json(payload);
};

export const getSubmodules = async (req: Request, res: Response) => {
  try {
    const parsed = idSchema.safeParse(req.query.mod_id);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid mod_id" });
    }

    const submodules = await getSubmodulesUseCase.execute(parsed.data);
    return ok(res, 200, submodules);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "MODULE_NOT_FOUND") {
      return res.status(404).json({ message: "Module not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubmoduleById = async (req: Request, res: Response) => {
  try {
    const parsed = idSchema.safeParse(req.params.subId);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid subId" });
    }

    const submodule = await getSubmoduleByIdUseCase.execute(parsed.data);
    if (!submodule) {
      return res.status(404).json({ message: "Submodule not found" });
    }
    return ok(res, 200, submodule);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSubmodule = async (req: Request, res: Response) => {
  try {
    const submodule = await createSubmoduleUseCase.execute(req.body);
    return ok(res, 201, submodule, "Created");
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "MODULE_NOT_FOUND") {
      return res.status(404).json({ message: "Module not found" });
    }
    if (error instanceof Error && error.message === "SUBMODULE_KEY_EXISTS") {
      return res.status(409).json({ message: "Submodule key already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubmodule = async (req: Request, res: Response) => {
  try {
    const parsed = idSchema.safeParse(req.params.subId);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid subId" });
    }

    const updated = await updateSubmoduleUseCase.execute(parsed.data, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Submodule not found" });
    }
    return ok(res, 200, updated, "Updated");
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "MODULE_NOT_FOUND") {
      return res.status(404).json({ message: "Module not found" });
    }
    if (error instanceof Error && error.message === "SUBMODULE_KEY_EXISTS") {
      return res.status(409).json({ message: "Submodule key already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubmodule = async (req: Request, res: Response) => {
  try {
    const parsed = idSchema.safeParse(req.params.subId);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid subId" });
    }

    await deleteSubmoduleUseCase.execute(parsed.data);
    return ok(res, 200, null, "Deleted");
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "SUBMODULE_NOT_FOUND") {
      return res.status(404).json({ message: "Submodule not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
