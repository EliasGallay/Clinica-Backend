import { Op } from "sequelize";
import { vi } from "vitest";
import { RolesModel, RolPermissionsModel } from "../src/infrastructure/db";
import { clearPermissionsCache } from "../src/services/auth/presentation/auth.middlewares";

const permissionItems = ["users", "persons", "patients", "doctors", "roles.permissions"];

export const setupPermissionsMock = () => {
  const rolesSpy = vi.spyOn(RolesModel, "findAll").mockImplementation((options) => {
    const where = options?.where as { rol_name?: unknown } | undefined;
    const roleNames = where?.rol_name;
    let names: string[] = [];
    if (roleNames && typeof roleNames === "object") {
      const value = (roleNames as Record<PropertyKey, unknown>)[Op.in as unknown as PropertyKey];
      names = Array.isArray(value) ? value : [];
    }
    if (names.includes("other")) {
      return Promise.resolve([] as unknown as Awaited<ReturnType<typeof RolesModel.findAll>>);
    }
    const roles = (names.length ? names : ["admin"]).map((name, index) => ({
      id: `role-${index + 1}`,
      rol_name: name,
    }));
    return Promise.resolve(roles as unknown as Awaited<ReturnType<typeof RolesModel.findAll>>);
  });

  const permissions = permissionItems.map((name) => ({
    rpe_permission_txt_name: name,
    rpe_bol_can_read: true,
    rpe_bol_can_write: true,
  }));

  const permissionsSpy = vi
    .spyOn(RolPermissionsModel, "findAll")
    .mockResolvedValue(
      permissions as unknown as Awaited<ReturnType<typeof RolPermissionsModel.findAll>>,
    );

  return { rolesSpy, permissionsSpy };
};

export const teardownPermissionsMock = () => {
  clearPermissionsCache();
};
