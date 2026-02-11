import type { CreateModuleInput, ModuleEntity } from "./modules.entity";

export abstract class ModulesDatasource {
  abstract getAllWithSubmodules(): Promise<ModuleEntity[]>;
  abstract getByIdWithSubmodules(id: number): Promise<ModuleEntity | null>;
  abstract getById(id: number): Promise<ModuleEntity | null>;
  abstract getByKey(key: string): Promise<ModuleEntity | null>;
  abstract create(data: CreateModuleInput): Promise<ModuleEntity>;
  abstract update(id: number, data: Partial<ModuleEntity>): Promise<ModuleEntity | null>;
  abstract softDelete(id: number): Promise<void>;
}
