export class RolPermissionEntity {
  constructor(
    public rpe_id: number,
    public rol_id: string,
    public rpe_permission_txt_name: string,
    public rpe_permission_txt_description: string,
    public rpe_bol_can_read: boolean,
    public rpe_bol_can_write: boolean,
    public rpe_dat_created_at: Date | null,
    public rpe_dat_updated_at: Date | null,
  ) {}
}
