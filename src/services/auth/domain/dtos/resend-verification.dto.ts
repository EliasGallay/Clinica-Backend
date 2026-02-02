import { z } from "zod";

export const resendVerificationDtoSchema = z.object({
  usr_txt_email: z.string().email().max(50),
});

export type ResendVerificationDto = z.infer<typeof resendVerificationDtoSchema>;
