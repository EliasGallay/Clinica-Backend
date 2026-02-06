import { z } from "zod";

export const updateRolPermissionDtoSchema = z.object({
  rpe_bol_can_read: z.boolean().optional(),
  rpe_bol_can_write: z.boolean().optional(),
});

export type UpdateRolPermissionDto = z.infer<typeof updateRolPermissionDtoSchema>;
