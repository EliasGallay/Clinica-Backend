CREATE TABLE users (
  usr_idt_id SERIAL PRIMARY KEY,

  usr_txt_email VARCHAR(254) NOT NULL,
  usr_txt_password VARCHAR(100) NOT NULL,
  usr_bol_email_verified BOOLEAN NOT NULL DEFAULT FALSE,

  usr_int_rol SMALLINT NOT NULL,
  usr_sta_state SMALLINT NOT NULL,
  usr_sta_employee_state SMALLINT NOT NULL,

  usr_txt_email_verification_code VARCHAR(60) NULL,
  usr_dat_email_verification_expires_at TIMESTAMP NULL,
  usr_int_email_verification_attempts SMALLINT NOT NULL DEFAULT 0,
  usr_dat_email_verification_last_sent_at TIMESTAMP NULL,

  usr_txt_password_reset_token VARCHAR(120) NULL,
  usr_dat_password_reset_expires_at TIMESTAMP NULL,
  usr_int_password_reset_attempts SMALLINT NOT NULL DEFAULT 0,
  usr_dat_password_reset_last_sent_at TIMESTAMP NULL,

  usr_dat_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  usr_dat_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  date_deleted_at TIMESTAMP NULL,

  CONSTRAINT uq_users_email UNIQUE (usr_txt_email)
);
