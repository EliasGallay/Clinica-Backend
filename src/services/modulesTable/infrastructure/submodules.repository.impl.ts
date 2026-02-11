import type { CreateSubmoduleInput, SubmoduleEntity } from "../domain/submodules.entity";
import type { SubmodulesRepository } from "../domain/submodules.repository";
import type { SubmodulesDatasource } from "../domain/submodules.datasource";

export class SubmodulesRepositoryImpl implements SubmodulesRepository {
  constructor(private readonly datasource: SubmodulesDatasource) {}

  getAllByModuleId(modId: number): Promise<SubmoduleEntity[]> {
    return this.datasource.getAllByModuleId(modId);
  }

  getById(id: number): Promise<SubmoduleEntity | null> {
    return this.datasource.getById(id);
  }

  getByKey(modId: number, key: string): Promise<SubmoduleEntity | null> {
    return this.datasource.getByKey(modId, key);
  }

  create(data: CreateSubmoduleInput): Promise<SubmoduleEntity> {
    return this.datasource.create(data);
  }

  update(id: number, data: Partial<SubmoduleEntity>): Promise<SubmoduleEntity | null> {
    return this.datasource.update(id, data);
  }

  softDelete(id: number): Promise<void> {
    return this.datasource.softDelete(id);
  }
}
