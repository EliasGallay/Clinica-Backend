import { z } from "zod";

export const createDoctorDtoSchema = z.object({
  per_id: z.number().int(),
  doc_txt_license: z.string().max(30).optional().nullable(),
  doc_txt_specialty: z.string().max(100).optional().nullable(),
  doc_sta_state: z.number().int(),
});

export type CreateDoctorDto = z.infer<typeof createDoctorDtoSchema>;
