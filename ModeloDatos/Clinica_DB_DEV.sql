-- Optional: enable UUID generation (requires privileges)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE persons (
  per_id SERIAL PRIMARY KEY,
  per_txt_first_name VARCHAR(100) NOT NULL,
  per_txt_last_name VARCHAR(100) NOT NULL,
  per_txt_dni VARCHAR(20) NULL,
  per_dat_birthdate DATE NULL,
  per_int_gender SMALLINT NULL,
  per_txt_email VARCHAR(254) NULL,
  per_txt_phone VARCHAR(30) NULL,
  per_txt_address VARCHAR(200) NULL,
  per_sta_state SMALLINT NOT NULL,
  per_dat_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  per_dat_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  per_dat_deleted_at TIMESTAMP NULL,

  CONSTRAINT uq_persons_dni UNIQUE (per_txt_dni)
);

CREATE TABLE users (
  usr_idt_id SERIAL PRIMARY KEY,
  per_id INT NULL UNIQUE,

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

  CONSTRAINT uq_users_email UNIQUE (usr_txt_email),
  CONSTRAINT fk_users_person FOREIGN KEY (per_id) REFERENCES persons (per_id) ON DELETE SET NULL
);

CREATE TABLE patients (
  pat_id SERIAL PRIMARY KEY,
  per_id INT NOT NULL UNIQUE,
  pat_sta_state SMALLINT NOT NULL,
  pat_dat_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  pat_dat_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  pat_dat_deleted_at TIMESTAMP NULL,

  CONSTRAINT fk_patients_person FOREIGN KEY (per_id) REFERENCES persons (per_id) ON DELETE CASCADE
);

CREATE TABLE doctors (
  doc_id SERIAL PRIMARY KEY,
  per_id INT NOT NULL UNIQUE,
  doc_txt_license VARCHAR(30) NULL,
  doc_txt_specialty VARCHAR(100) NULL,
  doc_sta_state SMALLINT NOT NULL,
  doc_dat_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  doc_dat_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  doc_dat_deleted_at TIMESTAMP NULL,

  CONSTRAINT fk_doctors_person FOREIGN KEY (per_id) REFERENCES persons (per_id) ON DELETE CASCADE
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

CREATE TABLE refresh_token (
  rtk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INT NOT NULL,
  rtk_txt_hash VARCHAR(64) NOT NULL,
  rtk_dat_expires_at TIMESTAMP NOT NULL,
  rtk_dat_revoked_at TIMESTAMP NULL,
  rtk_dat_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  rtk_dat_last_used_at TIMESTAMP NULL,
  rtk_txt_user_agent VARCHAR(200) NULL,
  rtk_txt_ip VARCHAR(45) NULL,

  CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users (usr_idt_id) ON DELETE CASCADE,
  CONSTRAINT uq_refresh_token_hash UNIQUE (rtk_txt_hash)
);

CREATE INDEX idx_refresh_token_user ON refresh_token (user_id);
