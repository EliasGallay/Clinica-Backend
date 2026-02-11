import type { CreateSubmoduleInput, SubmoduleEntity } from "../domain/submodules.entity";
import { SubmodulesDatasource } from "../domain/submodules.datasource";
import { SubmodulesModel } from "../../../infrastructure/db";
import { toSubmoduleEntity } from "./data/modules.mapper";
import type {
  SubmodulesAttributes,
  SubmodulesCreationAttributes,
  SubmodulesModelInstance,
} from "./data/submodules.types";

export class SubmodulesPostgresDatasourceImpl implements SubmodulesDatasource {
  async getAllByModuleId(modId: number): Promise<SubmoduleEntity[]> {
    const models = (await SubmodulesModel.findAll({
      where: { mod_id: modId },
      order: [["sub_int_order", "ASC"]],
    })) as SubmodulesModelInstance[];
    return models.map((model) => toSubmoduleEntity(model));
  }

  async getById(id: number): Promise<SubmoduleEntity | null> {
    const model = (await SubmodulesModel.findByPk(id)) as SubmodulesModelInstance | null;
    return model ? toSubmoduleEntity(model) : null;
  }

  async getByKey(modId: number, key: string): Promise<SubmoduleEntity | null> {
    const model = (await SubmodulesModel.findOne({
      where: { mod_id: modId, sub_txt_key: key },
    })) as SubmodulesModelInstance | null;
    return model ? toSubmoduleEntity(model) : null;
  }

  async create(data: CreateSubmoduleInput): Promise<SubmoduleEntity> {
    const created = (await SubmodulesModel.create(
      data as SubmodulesCreationAttributes,
    )) as SubmodulesModelInstance;
    return toSubmoduleEntity(created);
  }

  async update(id: number, data: Partial<SubmoduleEntity>): Promise<SubmoduleEntity | null> {
    const [updated] = await SubmodulesModel.update(
      data as Partial<SubmodulesAttributes>,
      { where: { sub_id: id } },
    );
    if (!updated) return null;
    const reloaded = (await SubmodulesModel.findByPk(id)) as SubmodulesModelInstance | null;
    return reloaded ? toSubmoduleEntity(reloaded) : null;
  }

  async softDelete(id: number): Promise<void> {
    await SubmodulesModel.update(
      { sub_dat_deleted_at: new Date() },
      { where: { sub_id: id } },
    );
  }
}
