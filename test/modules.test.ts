import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { ModulesTableModel, SubmodulesModel, UsersModel } from "../src/infrastructure/db";
import type { ModulesTableModelInstance } from "../src/services/modulesTable/infrastructure/data/modulesTable.types";
import type { SubmodulesModelInstance } from "../src/services/modulesTable/infrastructure/data/submodules.types";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";
import { setupPermissionsMock, teardownPermissionsMock } from "./permissions.mock";

vi.mock("../src/config/adapters/jwt.adapter", () => ({
  verifyToken: (token: string) => {
    if (token === "admin")
      return { usr_idt_id: 1, usr_txt_email: "a@a.com", roles: ["admin"], ver: 0 };
    if (token === "other")
      return { usr_idt_id: 2, usr_txt_email: "o@o.com", roles: ["other"], ver: 0 };
    throw new Error("Invalid token");
  },
}));

const baseAuthUser = (): UsersModelInstance =>
  ({
    usr_idt_id: 1,
    usr_int_token_version: 0,
    date_deleted_at: null,
  }) as UsersModelInstance;

const baseModuleModel = (overrides?: Partial<ModulesTableModelInstance>): ModulesTableModelInstance =>
  ({
    mod_id: 1,
    mod_txt_key: "appointments",
    mod_txt_name: "Turnos",
    mod_int_order: 1,
    mod_sta_state: 1,
    mod_dat_created_at: new Date("2026-02-01T03:00:00.000Z"),
    mod_dat_updated_at: new Date("2026-02-01T03:00:00.000Z"),
    mod_dat_deleted_at: null,
    mod_path_to: "/appointments",
    ...overrides,
  }) as ModulesTableModelInstance;

const baseSubmoduleModel = (
  overrides?: Partial<SubmodulesModelInstance>,
): SubmodulesModelInstance =>
  ({
    sub_id: 10,
    mod_id: 1,
    sub_txt_key: "patients",
    sub_txt_name: "Pacientes",
    sub_int_order: 1,
    sub_sta_state: 1,
    sub_dat_created_at: new Date("2026-02-01T03:00:00.000Z"),
    sub_dat_updated_at: new Date("2026-02-01T03:00:00.000Z"),
    sub_dat_deleted_at: null,
    sub_path_to: "/patients",
    sub_icon: "users",
    ...overrides,
  }) as SubmodulesModelInstance;

beforeEach(() => {
  vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseAuthUser());
  setupPermissionsMock();
});

afterEach(() => {
  teardownPermissionsMock();
  vi.restoreAllMocks();
});

describe("GET /modules", () => {
  it("returns modules with submodules", async () => {
    const module = baseModuleModel();
    const submodule = baseSubmoduleModel();
    const withSubmodules = {
      ...module,
      mod_submodules: [submodule],
    } as ModulesTableModelInstance & { mod_submodules: SubmodulesModelInstance[] };

    vi.spyOn(ModulesTableModel, "findAll").mockResolvedValue([withSubmodules]);

    const res = await request(app).get("/modules").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("OK");
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].mod_txt_key).toBe("appointments");
    expect(Array.isArray(res.body.data[0].mod_submodules)).toBe(true);
    expect(res.body.data[0].mod_submodules.length).toBe(1);
  });
});

describe("GET /modules/:modId", () => {
  it("returns module by id", async () => {
    const module = baseModuleModel();
    const submodule = baseSubmoduleModel();
    const withSubmodules = {
      ...module,
      mod_submodules: [submodule],
    } as ModulesTableModelInstance & { mod_submodules: SubmodulesModelInstance[] };

    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(withSubmodules);

    const res = await request(app).get("/modules/1").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(res.body.data.mod_id).toBe(1);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).get("/modules/abc").set("Authorization", "Bearer admin");
    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(null);
    const res = await request(app).get("/modules/999").set("Authorization", "Bearer admin");
    expect(res.status).toBe(404);
  });
});

describe("POST /modules", () => {
  it("creates module", async () => {
    vi.spyOn(ModulesTableModel, "findOne").mockResolvedValue(null);
    vi.spyOn(ModulesTableModel, "create").mockResolvedValue(baseModuleModel());

    const res = await request(app)
      .post("/modules")
      .set("Authorization", "Bearer admin")
      .send({
        mod_txt_key: "appointments",
        mod_txt_name: "Turnos",
        mod_int_order: 1,
        mod_sta_state: 1,
        mod_path_to: "/appointments",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.mod_txt_key).toBe("appointments");
  });

  it("returns 409 when key exists", async () => {
    vi.spyOn(ModulesTableModel, "findOne").mockResolvedValue(baseModuleModel());

    const res = await request(app)
      .post("/modules")
      .set("Authorization", "Bearer admin")
      .send({
        mod_txt_key: "appointments",
        mod_txt_name: "Turnos",
        mod_int_order: 1,
        mod_sta_state: 1,
        mod_path_to: "/appointments",
      });

    expect(res.status).toBe(409);
  });
});

describe("PUT /modules/:modId", () => {
  it("updates module", async () => {
    vi.spyOn(ModulesTableModel, "findByPk")
      .mockResolvedValueOnce(baseModuleModel())
      .mockResolvedValueOnce(baseModuleModel({ mod_txt_name: "Agenda" }));
    vi.spyOn(ModulesTableModel, "update").mockResolvedValue([1]);

    const res = await request(app)
      .put("/modules/1")
      .set("Authorization", "Bearer admin")
      .send({ mod_txt_name: "Agenda" });

    expect(res.status).toBe(200);
    expect(res.body.data.mod_txt_name).toBe("Agenda");
  });

  it("returns 409 when key exists", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(baseModuleModel());
    vi.spyOn(ModulesTableModel, "findOne").mockResolvedValue(baseModuleModel({ mod_id: 2 }));

    const res = await request(app)
      .put("/modules/1")
      .set("Authorization", "Bearer admin")
      .send({ mod_txt_key: "appointments" });

    expect(res.status).toBe(409);
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(null);
    const res = await request(app)
      .put("/modules/999")
      .set("Authorization", "Bearer admin")
      .send({ mod_txt_name: "Agenda" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /modules/:modId", () => {
  it("soft deletes module", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(baseModuleModel());
    vi.spyOn(ModulesTableModel, "update").mockResolvedValue([1]);

    const res = await request(app).delete("/modules/1").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(null);
    const res = await request(app).delete("/modules/999").set("Authorization", "Bearer admin");
    expect(res.status).toBe(404);
  });
});
