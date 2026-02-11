import { z } from "zod";

export const createModuleDtoSchema = z.object({
  mod_txt_key: z.string().min(1).max(60),
  mod_txt_name: z.string().min(1).max(100),
  mod_int_order: z.number().int().min(0),
  mod_sta_state: z.number().int(),
  mod_path_to: z.string().min(1).max(60),
});

export type CreateModuleDto = z.infer<typeof createModuleDtoSchema>;
