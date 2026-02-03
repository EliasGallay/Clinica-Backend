import { z } from "zod";

export const refreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(20).max(500),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenDtoSchema>;
