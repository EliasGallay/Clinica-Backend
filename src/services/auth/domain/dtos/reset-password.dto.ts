import { z } from "zod";

export const resetPasswordDtoSchema = z.object({
  usr_txt_email: z.string().email().max(50),
  usr_txt_verification_code: z.string().min(6).max(6),
  usr_txt_password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>;
