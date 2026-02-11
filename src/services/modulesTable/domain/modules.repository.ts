import type { CreateModuleInput, ModuleEntity } from "./modules.entity";

export interface ModulesRepository {
  getAllWithSubmodules(): Promise<ModuleEntity[]>;
  getByIdWithSubmodules(id: number): Promise<ModuleEntity | null>;
  getById(id: number): Promise<ModuleEntity | null>;
  getByKey(key: string): Promise<ModuleEntity | null>;
  create(data: CreateModuleInput): Promise<ModuleEntity>;
  update(id: number, data: Partial<ModuleEntity>): Promise<ModuleEntity | null>;
  softDelete(id: number): Promise<void>;
}
