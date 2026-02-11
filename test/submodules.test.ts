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

describe("GET /submodules", () => {
  it("returns submodules by mod_id", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(baseModuleModel());
    vi.spyOn(SubmodulesModel, "findAll").mockResolvedValue([baseSubmoduleModel()]);

    const res = await request(app)
      .get("/submodules?mod_id=1")
      .set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("returns 400 for invalid mod_id", async () => {
    const res = await request(app)
      .get("/submodules?mod_id=abc")
      .set("Authorization", "Bearer admin");
    expect(res.status).toBe(400);
  });

  it("returns 404 when module not found", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(null);
    const res = await request(app)
      .get("/submodules?mod_id=999")
      .set("Authorization", "Bearer admin");
    expect(res.status).toBe(404);
  });
});

describe("GET /submodules/:subId", () => {
  it("returns submodule by id", async () => {
    vi.spyOn(SubmodulesModel, "findByPk").mockResolvedValue(baseSubmoduleModel());
    const res = await request(app).get("/submodules/10").set("Authorization", "Bearer admin");
    expect(res.status).toBe(200);
    expect(res.body.data.sub_id).toBe(10);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).get("/submodules/abc").set("Authorization", "Bearer admin");
    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(SubmodulesModel, "findByPk").mockResolvedValue(null);
    const res = await request(app).get("/submodules/999").set("Authorization", "Bearer admin");
    expect(res.status).toBe(404);
  });
});

describe("POST /submodules", () => {
  it("creates submodule", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(baseModuleModel());
    vi.spyOn(SubmodulesModel, "findOne").mockResolvedValue(null);
    vi.spyOn(SubmodulesModel, "create").mockResolvedValue(baseSubmoduleModel());

    const res = await request(app)
      .post("/submodules")
      .set("Authorization", "Bearer admin")
      .send({
        mod_id: 1,
        sub_txt_key: "patients",
        sub_txt_name: "Pacientes",
        sub_int_order: 1,
        sub_sta_state: 1,
        sub_path_to: "/patients",
        sub_icon: "users",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.sub_txt_key).toBe("patients");
  });

  it("returns 404 when module not found", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(null);

    const res = await request(app)
      .post("/submodules")
      .set("Authorization", "Bearer admin")
      .send({
        mod_id: 999,
        sub_txt_key: "patients",
        sub_txt_name: "Pacientes",
        sub_int_order: 1,
        sub_sta_state: 1,
        sub_path_to: "/patients",
      });

    expect(res.status).toBe(404);
  });

  it("returns 409 when key exists", async () => {
    vi.spyOn(ModulesTableModel, "findByPk").mockResolvedValue(baseModuleModel());
    vi.spyOn(SubmodulesModel, "findOne").mockResolvedValue(baseSubmoduleModel());

    const res = await request(app)
      .post("/submodules")
      .set("Authorization", "Bearer admin")
      .send({
        mod_id: 1,
        sub_txt_key: "patients",
        sub_txt_name: "Pacientes",
        sub_int_order: 1,
        sub_sta_state: 1,
        sub_path_to: "/patients",
      });

    expect(res.status).toBe(409);
  });
});

describe("PUT /submodules/:subId", () => {
  it("updates submodule", async () => {
    vi.spyOn(SubmodulesModel, "findByPk")
      .mockResolvedValueOnce(baseSubmoduleModel())
      .mockResolvedValueOnce(baseSubmoduleModel({ sub_txt_name: "Listado" }));
    vi.spyOn(SubmodulesModel, "update").mockResolvedValue([1]);

    const res = await request(app)
      .put("/submodules/10")
      .set("Authorization", "Bearer admin")
      .send({ sub_txt_name: "Listado" });

    expect(res.status).toBe(200);
    expect(res.body.data.sub_txt_name).toBe("Listado");
  });

  it("returns 409 when key exists", async () => {
    vi.spyOn(SubmodulesModel, "findByPk").mockResolvedValue(baseSubmoduleModel());
    vi.spyOn(SubmodulesModel, "findOne").mockResolvedValue(baseSubmoduleModel({ sub_id: 11 }));

    const res = await request(app)
      .put("/submodules/10")
      .set("Authorization", "Bearer admin")
      .send({ sub_txt_key: "patients" });

    expect(res.status).toBe(409);
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(SubmodulesModel, "findByPk").mockResolvedValue(null);
    const res = await request(app)
      .put("/submodules/999")
      .set("Authorization", "Bearer admin")
      .send({ sub_txt_name: "Listado" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /submodules/:subId", () => {
  it("soft deletes submodule", async () => {
    vi.spyOn(SubmodulesModel, "findByPk").mockResolvedValue(baseSubmoduleModel());
    vi.spyOn(SubmodulesModel, "update").mockResolvedValue([1]);

    const res = await request(app).delete("/submodules/10").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(SubmodulesModel, "findByPk").mockResolvedValue(null);
    const res = await request(app).delete("/submodules/999").set("Authorization", "Bearer admin");
    expect(res.status).toBe(404);
  });
});
