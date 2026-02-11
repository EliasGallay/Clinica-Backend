import type { SubmoduleEntity } from "./submodules.entity";

export class ModuleEntity {
  constructor(
    public mod_id: number,
    public mod_txt_key: string,
    public mod_txt_name: string,
    public mod_int_order: number,
    public mod_sta_state: number,
    public mod_dat_created_at: Date | null,
    public mod_dat_updated_at: Date | null,
    public mod_dat_deleted_at: Date | null,
    public mod_path_to: string,
    public mod_submodules: SubmoduleEntity[],
  ) {}
}

export type CreateModuleInput = Omit<
  ModuleEntity,
  "mod_id" | "mod_dat_created_at" | "mod_dat_updated_at" | "mod_dat_deleted_at" | "mod_submodules"
>;
