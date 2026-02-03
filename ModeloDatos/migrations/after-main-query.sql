-- up
ALTER TABLE users
  ADD COLUMN usr_int_token_version INTEGER NOT NULL DEFAULT 0;