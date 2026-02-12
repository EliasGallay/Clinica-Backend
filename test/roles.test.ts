import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { RolesModel, UsersModel } from "../src/infrastructure/db";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";
import { setupPermissionsMock, teardownPermissionsMock } from "./permissions.mock";

vi.mock("../src/config/adapters/jwt.adapter", () => ({
  verifyToken: (token: string) => {
    if (token === "admin")
      return { usr_idt_id: 1, usr_txt_email: "a@a.com", roles: ["admin"], ver: 0 };
    throw new Error("Invalid token");
  },
}));

const baseAuthUser = (): UsersModelInstance =>
  ({
    usr_idt_id: 1,
    usr_int_token_version: 0,
    date_deleted_at: null,
  }) as UsersModelInstance;

beforeEach(() => {
  vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseAuthUser());
  setupPermissionsMock();
});

afterEach(() => {
  teardownPermissionsMock();
  vi.restoreAllMocks();
});

describe("GET /roles/all", () => {
  it("returns roles list", async () => {
    vi.spyOn(RolesModel, "findAll").mockResolvedValue([
      { id: "role-1", rol_name: "admin", rol_description: "Admin", rol_weight: 1 },
      { id: "role-2", rol_name: "recepcionista", rol_description: "Recepcion", rol_weight: 2 },
    ] as unknown as Awaited<ReturnType<typeof RolesModel.findAll>>);

    const res = await request(app).get("/roles/all").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("rol_name");
  });
});
