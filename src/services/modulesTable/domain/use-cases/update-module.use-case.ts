import type { ModulesRepository } from "../modules.repository";
import type { UpdateModuleDto } from "../dtos";
import type { ModuleEntity } from "../modules.entity";

export class UpdateModuleUseCase {
  constructor(private readonly repository: ModulesRepository) {}

  async execute(id: number, data: UpdateModuleDto): Promise<ModuleEntity | null> {
    const current = await this.repository.getById(id);
    if (!current) {
      return null;
    }

    if (data.mod_txt_key) {
      const keyOwner = await this.repository.getByKey(data.mod_txt_key);
      if (keyOwner && keyOwner.mod_id !== id) {
        throw new Error("MODULE_KEY_EXISTS");
      }
    }

    return this.repository.update(id, { ...data, mod_dat_updated_at: new Date() });
  }
}
