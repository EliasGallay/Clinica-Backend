import { z } from "zod";

const toNumber = (value: unknown) => (typeof value === "string" ? Number(value) : value);

export const getRolPermissionsQueryDtoSchema = z.object({
  page: z.preprocess(toNumber, z.number().int().min(1)).optional(),
  limit: z.preprocess(toNumber, z.number().int().min(1).max(100)).optional(),
  rol_id: z.string().uuid().optional(),
});

export type GetRolPermissionsQueryDto = z.infer<typeof getRolPermissionsQueryDtoSchema>;
