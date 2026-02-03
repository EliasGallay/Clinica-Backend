export class DoctorEntity {
  constructor(
    public doc_id: number,
    public per_id: number,
    public doc_txt_license: string | null,
    public doc_txt_specialty: string | null,
    public doc_sta_state: number,
    public doc_dat_created_at: Date | null,
    public doc_dat_updated_at: Date | null,
    public doc_dat_deleted_at: Date | null,
  ) {}
}
