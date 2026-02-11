import type { ModulesRepository } from "../modules.repository";
import type { CreateModuleDto } from "../dtos";
import { ModuleEntity } from "../modules.entity";

export class CreateModuleUseCase {
  constructor(private readonly repository: ModulesRepository) {}

  async execute(data: CreateModuleDto): Promise<ModuleEntity> {
    const existing = await this.repository.getByKey(data.mod_txt_key);
    if (existing) {
      throw new Error("MODULE_KEY_EXISTS");
    }

    const entity = new ModuleEntity(
      0,
      data.mod_txt_key,
      data.mod_txt_name,
      data.mod_int_order,
      data.mod_sta_state,
      new Date(),
      new Date(),
      null,
      data.mod_path_to,
      [],
    );

    return this.repository.create({
      mod_txt_key: entity.mod_txt_key,
      mod_txt_name: entity.mod_txt_name,
      mod_int_order: entity.mod_int_order,
      mod_sta_state: entity.mod_sta_state,
      mod_path_to: entity.mod_path_to,
    });
  }
}
