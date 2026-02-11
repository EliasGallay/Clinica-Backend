import { z } from "zod";

export const updateSubmoduleDtoSchema = z.object({
  mod_id: z.number().int().positive().optional(),
  sub_txt_key: z.string().min(1).max(60).optional(),
  sub_txt_name: z.string().min(1).max(100).optional(),
  sub_int_order: z.number().int().min(0).optional(),
  sub_sta_state: z.number().int().optional(),
  sub_path_to: z.string().min(1).max(60).optional(),
  sub_icon: z.string().max(60).optional().nullable(),
});

export type UpdateSubmoduleDto = z.infer<typeof updateSubmoduleDtoSchema>;
