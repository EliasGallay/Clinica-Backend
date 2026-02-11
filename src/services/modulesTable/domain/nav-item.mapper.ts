import type { ModuleEntity } from "./modules.entity";
import type { NavItem, SideBarItem } from "./dtos";

const toIsoStringOrNull = (value: Date | null): string | null =>
  value ? value.toISOString() : null;

export const toSideBarItem = (submodule: ModuleEntity["mod_submodules"][number]): SideBarItem => ({
  sub_id: submodule.sub_id,
  mod_id: submodule.mod_id,
  sub_txt_key: submodule.sub_txt_key,
  sub_txt_name: submodule.sub_txt_name,
  sub_path_to: submodule.sub_path_to,
  sub_int_order: submodule.sub_int_order,
  sub_sta_state: submodule.sub_sta_state,
  sub_dat_created_at: submodule.sub_dat_created_at
    ? submodule.sub_dat_created_at.toISOString()
    : "",
  sub_dat_updated_at: submodule.sub_dat_updated_at
    ? submodule.sub_dat_updated_at.toISOString()
    : "",
  sub_dat_deleted_at: toIsoStringOrNull(submodule.sub_dat_deleted_at),
  sub_icon: submodule.sub_icon,
});

export const toNavItem = (module: ModuleEntity): NavItem => ({
  mod_id: module.mod_id,
  mod_txt_key: module.mod_txt_key,
  mod_txt_name: module.mod_txt_name,
  mod_path_to: module.mod_path_to,
  mod_int_order: module.mod_int_order,
  mod_sta_state: module.mod_sta_state,
  mod_dat_created_at: module.mod_dat_created_at ? module.mod_dat_created_at.toISOString() : "",
  mod_dat_updated_at: module.mod_dat_updated_at ? module.mod_dat_updated_at.toISOString() : "",
  mod_dat_deleted_at: toIsoStringOrNull(module.mod_dat_deleted_at),
  mod_submodules: module.mod_submodules.map((submodule) => toSideBarItem(submodule)),
});
