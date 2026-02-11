export class SubmoduleEntity {
  constructor(
    public sub_id: number,
    public mod_id: number,
    public sub_txt_key: string,
    public sub_txt_name: string,
    public sub_int_order: number,
    public sub_sta_state: number,
    public sub_dat_created_at: Date | null,
    public sub_dat_updated_at: Date | null,
    public sub_dat_deleted_at: Date | null,
    public sub_path_to: string,
    public sub_icon: string | null,
  ) {}
}

export type CreateSubmoduleInput = Omit<
  SubmoduleEntity,
  "sub_id" | "sub_dat_created_at" | "sub_dat_updated_at" | "sub_dat_deleted_at"
>;
