import { z } from "zod";

export const loginDtoSchema = z.object({
  usr_txt_email: z.string().email().max(254),
  usr_txt_password: z.string().min(1).max(100),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;
