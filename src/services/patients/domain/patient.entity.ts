export class PatientEntity {
  constructor(
    public pat_id: number,
    public per_id: number,
    public pat_sta_state: number,
    public pat_dat_created_at: Date | null,
    public pat_dat_updated_at: Date | null,
    public pat_dat_deleted_at: Date | null,
  ) {}
}
