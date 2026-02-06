import type { Request, Response } from "express";
import { z } from "zod";
import { RolPermissionsPostgresDatasourceImpl } from "../infrastructure/rol-permissions.datasource.impl";
import { RolPermissionsRepositoryImpl } from "../infrastructure/rol-permissions.repository.impl";
import {
  GetRolPermissionsUseCase,
  UpdateRolPermissionUseCase,
  getRolPermissionsQueryDtoSchema,
} from "../domain";
import { RolPermissionsModel, sequelize } from "../../../infrastructure/db";

const datasource = new RolPermissionsPostgresDatasourceImpl();
const repository = new RolPermissionsRepositoryImpl(datasource);
const getRolPermissionsUseCase = new GetRolPermissionsUseCase(repository);
const updateRolPermissionUseCase = new UpdateRolPermissionUseCase(repository);

type RequestUser = {
  usr_int_rol?: number;
  usr_txt_email?: string;
  usr_idt_id?: number;
};

const touchRequester = (req: Request) => {
  const user = req.body?.user as RequestUser | undefined;
  void user?.usr_int_rol;
  void user?.usr_txt_email;
  void user?.usr_idt_id;
};

const rolIdSchema = z.string().uuid();

const parseRolId = (req: Request, res: Response) => {
  const parsed = rolIdSchema.safeParse(req.params.rolId);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid rolId" });
    return null;
  }
  return parsed.data;
};

export const getRolPermissions = async (req: Request, res: Response) => {
  try {
    touchRequester(req);
    const rolId = parseRolId(req, res);
    if (!rolId) return;

    const parsed = getRolPermissionsQueryDtoSchema.safeParse({
      ...req.query,
      rol_id: rolId,
    });
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const result = await getRolPermissionsUseCase.execute(parsed.data);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPermissionsCatalog = async (req: Request, res: Response) => {
  try {
    touchRequester(req);
    const rows = (await RolPermissionsModel.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("rpe_permission_txt_name")),
          "rpe_permission_txt_name",
        ],
        "rpe_permission_txt_description",
      ],
      order: [
        ["rpe_permission_txt_name", "ASC"],
        ["rpe_permission_txt_description", "ASC"],
      ],
      raw: true,
    })) as unknown as Array<{
      rpe_permission_txt_name: string;
      rpe_permission_txt_description: string;
    }>;
    const items = rows.map((row) => ({
      rpe_permission_txt_name: row.rpe_permission_txt_name,
      rpe_permission_txt_description: row.rpe_permission_txt_description,
    }));
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRolPermission = async (req: Request, res: Response) => {
  try {
    touchRequester(req);
    const rolId = parseRolId(req, res);
    if (!rolId) return;

    const permissionId = Number(req.params.permissionId);
    if (Number.isNaN(permissionId)) {
      return res.status(400).json({ message: "Invalid permission id" });
    }

    const permission = await updateRolPermissionUseCase.execute(rolId, permissionId, req.body);
    if (!permission) {
      return res.status(404).json({ message: "Role permission not found" });
    }
    return res.status(200).json(permission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
