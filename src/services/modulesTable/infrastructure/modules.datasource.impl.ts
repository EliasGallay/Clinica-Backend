import type { CreateModuleInput, ModuleEntity } from "../domain/modules.entity";
import { ModulesDatasource } from "../domain/modules.datasource";
import { ModulesTableModel, SubmodulesModel } from "../../../infrastructure/db";
import {
  toModuleEntity,
  toModuleEntityWithSubmodules,
} from "./data/modules.mapper";
import type {
  ModulesTableAttributes,
  ModulesTableCreationAttributes,
  ModulesTableModelInstance,
} from "./data/modulesTable.types";
import type { SubmodulesModelInstance } from "./data/submodules.types";

type ModulesTableModelWithSubmodules = ModulesTableModelInstance & {
  mod_submodules?: SubmodulesModelInstance[];
};

export class ModulesPostgresDatasourceImpl implements ModulesDatasource {
  async getAllWithSubmodules(): Promise<ModuleEntity[]> {
    const models = (await ModulesTableModel.findAll({
      include: [{ model: SubmodulesModel, as: "mod_submodules", required: false }],
      order: [
        ["mod_int_order", "ASC"],
        [{ model: SubmodulesModel, as: "mod_submodules" }, "sub_int_order", "ASC"],
      ],
    })) as ModulesTableModelWithSubmodules[];
    return models.map((model) => toModuleEntityWithSubmodules(model));
  }

  async getByIdWithSubmodules(id: number): Promise<ModuleEntity | null> {
    const model = (await ModulesTableModel.findByPk(id, {
      include: [{ model: SubmodulesModel, as: "mod_submodules", required: false }],
      order: [[{ model: SubmodulesModel, as: "mod_submodules" }, "sub_int_order", "ASC"]],
    })) as ModulesTableModelWithSubmodules | null;
    return model ? toModuleEntityWithSubmodules(model) : null;
  }

  async getById(id: number): Promise<ModuleEntity | null> {
    const model = (await ModulesTableModel.findByPk(id)) as ModulesTableModelInstance | null;
    return model ? toModuleEntity(model) : null;
  }

  async getByKey(key: string): Promise<ModuleEntity | null> {
    const model = (await ModulesTableModel.findOne({
      where: { mod_txt_key: key },
    })) as ModulesTableModelInstance | null;
    return model ? toModuleEntity(model) : null;
  }

  async create(data: CreateModuleInput): Promise<ModuleEntity> {
    const created = (await ModulesTableModel.create(
      data as ModulesTableCreationAttributes,
    )) as ModulesTableModelInstance;
    return toModuleEntity(created);
  }

  async update(id: number, data: Partial<ModuleEntity>): Promise<ModuleEntity | null> {
    const [updated] = await ModulesTableModel.update(
      data as Partial<ModulesTableAttributes>,
      { where: { mod_id: id } },
    );
    if (!updated) return null;
    const reloaded = (await ModulesTableModel.findByPk(id)) as ModulesTableModelInstance | null;
    return reloaded ? toModuleEntity(reloaded) : null;
  }

  async softDelete(id: number): Promise<void> {
    await ModulesTableModel.update(
      { mod_dat_deleted_at: new Date() },
      { where: { mod_id: id } },
    );
  }
}
