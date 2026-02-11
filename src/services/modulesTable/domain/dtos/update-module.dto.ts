import { z } from "zod";

export const updateModuleDtoSchema = z.object({
  mod_txt_key: z.string().min(1).max(60).optional(),
  mod_txt_name: z.string().min(1).max(100).optional(),
  mod_int_order: z.number().int().min(0).optional(),
  mod_sta_state: z.number().int().optional(),
  mod_path_to: z.string().min(1).max(60).optional(),
});

export type UpdateModuleDto = z.infer<typeof updateModuleDtoSchema>;
