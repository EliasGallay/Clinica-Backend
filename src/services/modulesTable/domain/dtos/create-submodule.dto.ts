import { z } from "zod";

export const createSubmoduleDtoSchema = z.object({
  mod_id: z.number().int().positive(),
  sub_txt_key: z.string().min(1).max(60),
  sub_txt_name: z.string().min(1).max(100),
  sub_int_order: z.number().int().min(0),
  sub_sta_state: z.number().int(),
  sub_path_to: z.string().min(1).max(60),
  sub_icon: z.string().max(60).optional().nullable(),
});

export type CreateSubmoduleDto = z.infer<typeof createSubmoduleDtoSchema>;
