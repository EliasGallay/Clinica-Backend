export class PersonEntity {
  constructor(
    public per_id: number,
    public per_txt_first_name: string,
    public per_txt_last_name: string,
    public per_txt_dni: string | null,
    public per_dat_birthdate: Date | null,
    public per_int_gender: number | null,
    public per_txt_email: string | null,
    public per_txt_phone: string | null,
    public per_txt_address: string | null,
    public per_sta_state: number,
    public per_dat_created_at: Date | null,
    public per_dat_updated_at: Date | null,
    public per_dat_deleted_at: Date | null,
  ) {}
}

export type CreatePersonInput = Omit<
  PersonEntity,
  "per_id" | "per_dat_created_at" | "per_dat_updated_at" | "per_dat_deleted_at"
>;
