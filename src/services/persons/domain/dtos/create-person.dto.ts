import { z } from "zod";

export const createPersonDtoSchema = z.object({
  per_txt_first_name: z.string().min(1).max(100),
  per_txt_last_name: z.string().min(1).max(100),
  per_txt_dni: z.string().min(6).max(20).optional().nullable(),
  per_dat_birthdate: z.coerce.date().optional().nullable(),
  per_int_gender: z.number().int().optional().nullable(),
  per_txt_email: z.string().email().max(254).optional().nullable(),
  per_txt_phone: z.string().max(30).optional().nullable(),
  per_txt_address: z.string().max(200).optional().nullable(),
  per_sta_state: z.number().int(),
});

export type CreatePersonDto = z.infer<typeof createPersonDtoSchema>;
