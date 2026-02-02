import { z } from "zod";

export const requestPasswordResetDtoSchema = z.object({
  usr_txt_email: z.string().email().max(50),
});

export type RequestPasswordResetDto = z.infer<typeof requestPasswordResetDtoSchema>;
