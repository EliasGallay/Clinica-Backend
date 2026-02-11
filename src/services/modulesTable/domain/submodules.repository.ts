import type { CreateSubmoduleInput, SubmoduleEntity } from "./submodules.entity";

export interface SubmodulesRepository {
  getAllByModuleId(modId: number): Promise<SubmoduleEntity[]>;
  getById(id: number): Promise<SubmoduleEntity | null>;
  getByKey(modId: number, key: string): Promise<SubmoduleEntity | null>;
  create(data: CreateSubmoduleInput): Promise<SubmoduleEntity>;
  update(id: number, data: Partial<SubmoduleEntity>): Promise<SubmoduleEntity | null>;
  softDelete(id: number): Promise<void>;
}
