import type { Request, Response } from "express";
import { z } from "zod";
import { ModulesPostgresDatasourceImpl } from "../infrastructure/modules.datasource.impl";
import { ModulesRepositoryImpl } from "../infrastructure/modules.repository.impl";
import {
  CreateModuleUseCase,
  DeleteModuleUseCase,
  GetModuleByIdUseCase,
  GetModulesUseCase,
  UpdateModuleUseCase,
} from "../domain/use-cases";
import type { ResDTO } from "../domain/dtos";

const datasource = new ModulesPostgresDatasourceImpl();
const repository = new ModulesRepositoryImpl(datasource);
const getModulesUseCase = new GetModulesUseCase(repository);
const getModuleByIdUseCase = new GetModuleByIdUseCase(repository);
const createModuleUseCase = new CreateModuleUseCase(repository);
const updateModuleUseCase = new UpdateModuleUseCase(repository);
const deleteModuleUseCase = new DeleteModuleUseCase(repository);

const idSchema = z.coerce.number().int().positive();

const ok = <T>(res: Response, status: number, data: T, message = "OK") => {
  const payload: ResDTO<T> = { message, data };
  return res.status(status).json(payload);
};

export const getModules = async (_req: Request, res: Response) => {
  try {
    const modules = await getModulesUseCase.execute();
    return ok(res, 200, modules);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getModuleById = async (req: Request, res: Response) => {
  try {
    const parsed = idSchema.safeParse(req.params.modId);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid modId" });
    }

    const module = await getModuleByIdUseCase.execute(parsed.data);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    return ok(res, 200, module);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createModule = async (req: Request, res: Response) => {
  try {
    const module = await createModuleUseCase.execute(req.body);
    return ok(res, 201, module, "Created");
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "MODULE_KEY_EXISTS") {
      return res.status(409).json({ message: "Module key already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const parsed = idSchema.safeParse(req.params.modId);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid modId" });
    }

    const updated = await updateModuleUseCase.execute(parsed.data, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Module not found" });
    }
    return ok(res, 200, updated, "Updated");
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "MODULE_KEY_EXISTS") {
      return res.status(409).json({ message: "Module key already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const parsed = idSchema.safeParse(req.params.modId);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid modId" });
    }

    await deleteModuleUseCase.execute(parsed.data);
    return ok(res, 200, null, "Deleted");
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "MODULE_NOT_FOUND") {
      return res.status(404).json({ message: "Module not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
