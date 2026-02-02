import { z } from "zod";

export const logoutDtoSchema = z.object({
  refreshToken: z.string().min(20).max(500),
});

export type LogoutDto = z.infer<typeof logoutDtoSchema>;
