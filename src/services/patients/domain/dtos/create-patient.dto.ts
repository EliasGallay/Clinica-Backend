import { z } from "zod";

export const createPatientDtoSchema = z.object({
  per_id: z.number().int(),
  pat_sta_state: z.number().int(),
});

export type CreatePatientDto = z.infer<typeof createPatientDtoSchema>;
