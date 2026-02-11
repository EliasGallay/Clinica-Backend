import type { ModulesTableModelInstance } from "./modulesTable.types";
import type { SubmodulesModelInstance } from "./submodules.types";
import { ModuleEntity } from "../../domain/modules.entity";
import { SubmoduleEntity } from "../../domain/submodules.entity";

type ModulesTableModelWithSubmodules = ModulesTableModelInstance & {
  mod_submodules?: SubmodulesModelInstance[];
};

export const toSubmoduleEntity = (model: SubmodulesModelInstance): SubmoduleEntity =>
  new SubmoduleEntity(
    model.sub_id,
    model.mod_id,
    model.sub_txt_key,
    model.sub_txt_name,
    model.sub_int_order,
    model.sub_sta_state,
    model.sub_dat_created_at,
    model.sub_dat_updated_at,
    model.sub_dat_deleted_at,
    model.sub_path_to,
    model.sub_icon,
  );

export const toModuleEntity = (model: ModulesTableModelInstance): ModuleEntity =>
  new ModuleEntity(
    model.mod_id,
    model.mod_txt_key,
    model.mod_txt_name,
    model.mod_int_order,
    model.mod_sta_state,
    model.mod_dat_created_at,
    model.mod_dat_updated_at,
    model.mod_dat_deleted_at,
    model.mod_path_to,
    [],
  );

export const toModuleEntityWithSubmodules = (
  model: ModulesTableModelWithSubmodules,
): ModuleEntity => {
  const submodules = (model.mod_submodules ?? [])
    .slice()
    .sort((left, right) => left.sub_int_order - right.sub_int_order)
    .map((submodule) => toSubmoduleEntity(submodule));
  return new ModuleEntity(
    model.mod_id,
    model.mod_txt_key,
    model.mod_txt_name,
    model.mod_int_order,
    model.mod_sta_state,
    model.mod_dat_created_at,
    model.mod_dat_updated_at,
    model.mod_dat_deleted_at,
    model.mod_path_to,
    submodules,
  );
};
