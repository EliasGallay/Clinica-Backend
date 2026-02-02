import { z } from "zod";

export const registerDtoSchema = z.object({
  usr_txt_email: z.string().email().max(254),
  usr_txt_password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
});

export type RegisterDto = z.infer<typeof registerDtoSchema>;
