import { z } from "zod";
import { Role } from "../../../../shared/constants";

export const createUserDtoSchema = z.object({
  usr_txt_email: z.string().email().max(254),
  roles: z.array(z.nativeEnum(Role)).min(1),
  usr_txt_password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
  usr_bol_email_verified: z.boolean().optional(),
  usr_sta_state: z.number().int(),
  usr_sta_employee_state: z.number().int(),
});

export type CreateUserDto = z.infer<typeof createUserDtoSchema>;
