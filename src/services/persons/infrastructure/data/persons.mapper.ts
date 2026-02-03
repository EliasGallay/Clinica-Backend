import type { PersonsModelInstance } from "./persons.types";
import { PersonEntity } from "../../domain/person.entity";

export const toPersonEntity = (model: PersonsModelInstance): PersonEntity =>
  new PersonEntity(
    model.per_id,
    model.per_txt_first_name,
    model.per_txt_last_name,
    model.per_txt_dni,
    model.per_dat_birthdate,
    model.per_int_gender,
    model.per_txt_email,
    model.per_txt_phone,
    model.per_txt_address,
    model.per_sta_state,
    model.per_dat_created_at,
    model.per_dat_updated_at,
    model.per_dat_deleted_at,
  );
