import type { CreateSubmoduleDto } from "../dtos";
import type { ModulesRepository } from "../modules.repository";
import type { SubmodulesRepository } from "../submodules.repository";
import { SubmoduleEntity } from "../submodules.entity";

export class CreateSubmoduleUseCase {
  constructor(
    private readonly submodulesRepository: SubmodulesRepository,
    private readonly modulesRepository: ModulesRepository,
  ) {}

  async execute(data: CreateSubmoduleDto): Promise<SubmoduleEntity> {
    const module = await this.modulesRepository.getById(data.mod_id);
    if (!module) {
      throw new Error("MODULE_NOT_FOUND");
    }

    const existing = await this.submodulesRepository.getByKey(data.mod_id, data.sub_txt_key);
    if (existing) {
      throw new Error("SUBMODULE_KEY_EXISTS");
    }

    const entity = new SubmoduleEntity(
      0,
      data.mod_id,
      data.sub_txt_key,
      data.sub_txt_name,
      data.sub_int_order,
      data.sub_sta_state,
      new Date(),
      new Date(),
      null,
      data.sub_path_to,
      data.sub_icon ?? null,
    );

    return this.submodulesRepository.create({
      mod_id: entity.mod_id,
      sub_txt_key: entity.sub_txt_key,
      sub_txt_name: entity.sub_txt_name,
      sub_int_order: entity.sub_int_order,
      sub_sta_state: entity.sub_sta_state,
      sub_path_to: entity.sub_path_to,
      sub_icon: entity.sub_icon,
    });
  }
}
