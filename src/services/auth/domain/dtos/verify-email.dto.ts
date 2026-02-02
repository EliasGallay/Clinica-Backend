import { z } from "zod";

export const verifyEmailDtoSchema = z.object({
  usr_txt_email: z.string().email().max(50),
  usr_txt_verification_code: z.string().min(6).max(6),
});

export type VerifyEmailDto = z.infer<typeof verifyEmailDtoSchema>;
