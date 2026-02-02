-- Prerequisite: pgcrypto extension
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  usr_idt_id SERIAL PRIMARY KEY,

  usr_txt_email VARCHAR(254) NOT NULL,
  usr_txt_password VARCHAR(100) NOT NULL,
  usr_bol_email_verified BOOLEAN NOT NULL DEFAULT FALSE,

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

CREATE TABLE rol (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rol_name VARCHAR NOT NULL,
  rol_description VARCHAR(50) NULL,
  rol_weight INT NULL,

  CONSTRAINT uq_rol_name UNIQUE (rol_name)
);

CREATE TABLE usr_rol (
  user_id INT NOT NULL,
  rol_id UUID NOT NULL,

  CONSTRAINT pk_usr_rol PRIMARY KEY (user_id, rol_id),
  CONSTRAINT fk_usr_rol_user FOREIGN KEY (user_id) REFERENCES users (usr_idt_id) ON DELETE CASCADE,
  CONSTRAINT fk_usr_rol_role FOREIGN KEY (rol_id) REFERENCES rol (id) ON DELETE CASCADE
);
