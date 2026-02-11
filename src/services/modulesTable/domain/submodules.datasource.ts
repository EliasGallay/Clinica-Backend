import type { CreateSubmoduleInput, SubmoduleEntity } from "./submodules.entity";

export abstract class SubmodulesDatasource {
  abstract getAllByModuleId(modId: number): Promise<SubmoduleEntity[]>;
  abstract getById(id: number): Promise<SubmoduleEntity | null>;
  abstract getByKey(modId: number, key: string): Promise<SubmoduleEntity | null>;
  abstract create(data: CreateSubmoduleInput): Promise<SubmoduleEntity>;
  abstract update(id: number, data: Partial<SubmoduleEntity>): Promise<SubmoduleEntity | null>;
  abstract softDelete(id: number): Promise<void>;
}
