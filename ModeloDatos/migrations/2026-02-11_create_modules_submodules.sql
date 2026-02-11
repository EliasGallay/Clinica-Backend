-- up
CREATE TABLE IF NOT EXISTS modules (
  mod_id SERIAL PRIMARY KEY,
  mod_txt_key VARCHAR(60) NOT NULL UNIQUE,
  mod_txt_name VARCHAR(100) NOT NULL,
  mod_int_order INT NOT NULL DEFAULT 0,
  mod_sta_state SMALLINT NOT NULL,
  mod_dat_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  mod_dat_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  mod_dat_deleted_at TIMESTAMP NULL,
  mod_path_to VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS submodules (
  sub_id SERIAL PRIMARY KEY,
  mod_id INT NOT NULL,
  sub_txt_key VARCHAR(60) NOT NULL,
  sub_txt_name VARCHAR(100) NOT NULL,
  sub_int_order INT NOT NULL DEFAULT 0,
  sub_sta_state SMALLINT NOT NULL,
  sub_dat_created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  sub_dat_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  sub_dat_deleted_at TIMESTAMP NULL,
  sub_path_to VARCHAR(60) NOT NULL,
  sub_icon VARCHAR(60) NULL,
  CONSTRAINT fk_submodules_mod_id FOREIGN KEY (mod_id)
    REFERENCES modules (mod_id)
    ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_modules_key ON modules (mod_txt_key);
CREATE UNIQUE INDEX IF NOT EXISTS uq_submodules_mod_key ON submodules (mod_id, sub_txt_key);
CREATE INDEX IF NOT EXISTS idx_submodules_mod ON submodules (mod_id);

-- down
DROP TABLE IF EXISTS submodules;
DROP TABLE IF EXISTS modules;
