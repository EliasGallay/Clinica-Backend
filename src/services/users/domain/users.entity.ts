export class UserEntity {
  constructor(
    public usr_idt_id: number,
    public usr_txt_email: string,
    public usr_txt_password: string | null,
    public usr_bol_email_verified: boolean,
    public roles: string[],
    public usr_sta_state: number,
    public usr_sta_employee_state: number,
    public usr_txt_email_verification_code: string | null,
    public usr_dat_email_verification_expires_at: Date | null,
    public usr_int_email_verification_attempts: number,
    public usr_dat_email_verification_last_sent_at: Date | null,
    public usr_txt_password_reset_token: string | null,
    public usr_dat_password_reset_expires_at: Date | null,
    public usr_int_password_reset_attempts: number,
    public usr_dat_password_reset_last_sent_at: Date | null,
    public usr_dat_created_at: Date | null,
    public usr_dat_updated_at: Date | null,
    public date_deleted_at: Date | null,
  ) {}
}
