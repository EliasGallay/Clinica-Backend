import type { CreateModuleInput, ModuleEntity } from "../domain/modules.entity";
import type { ModulesRepository } from "../domain/modules.repository";
import type { ModulesDatasource } from "../domain/modules.datasource";

export class ModulesRepositoryImpl implements ModulesRepository {
  constructor(private readonly datasource: ModulesDatasource) {}

  getAllWithSubmodules(): Promise<ModuleEntity[]> {
    return this.datasource.getAllWithSubmodules();
  }

  getByIdWithSubmodules(id: number): Promise<ModuleEntity | null> {
    return this.datasource.getByIdWithSubmodules(id);
  }

  getById(id: number): Promise<ModuleEntity | null> {
    return this.datasource.getById(id);
  }

  getByKey(key: string): Promise<ModuleEntity | null> {
    return this.datasource.getByKey(key);
  }

  create(data: CreateModuleInput): Promise<ModuleEntity> {
    return this.datasource.create(data);
  }

  update(id: number, data: Partial<ModuleEntity>): Promise<ModuleEntity | null> {
    return this.datasource.update(id, data);
  }

  softDelete(id: number): Promise<void> {
    return this.datasource.softDelete(id);
  }
}
