import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { PersonsModel, UsersModel } from "../src/infrastructure/db";
import type { PersonsModelInstance } from "../src/services/persons/infrastructure/data/persons.types";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";

vi.mock("../src/config/adapters/jwt.adapter", () => ({
  verifyToken: (token: string) => {
    if (token === "admin")
      return { usr_idt_id: 1, usr_txt_email: "a@a.com", roles: ["admin"], ver: 0 };
    if (token === "other")
      return { usr_idt_id: 2, usr_txt_email: "o@o.com", roles: ["other"], ver: 0 };
    throw new Error("Invalid token");
  },
}));

const basePersonModel = (): PersonsModelInstance =>
  ({
    per_id: 1,
    per_txt_first_name: "Juan",
    per_txt_last_name: "Perez",
    per_txt_dni: "12345678",
    per_dat_birthdate: new Date("1990-01-01"),
    per_int_gender: 1,
    per_txt_email: "juan.perez@correo.com",
    per_txt_phone: "3511234567",
    per_txt_address: "Calle Falsa 1234",
    per_sta_state: 1,
    per_dat_created_at: new Date("2026-02-02T03:00:00.000Z"),
    per_dat_updated_at: new Date("2026-02-02T03:00:00.000Z"),
    per_dat_deleted_at: null,
  }) as PersonsModelInstance;

const baseAuthUser = (): UsersModelInstance =>
  ({
    usr_idt_id: 1,
    usr_int_token_version: 0,
    date_deleted_at: null,
  }) as UsersModelInstance;

beforeEach(() => {
  vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseAuthUser());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /persons", () => {
  it("creates person for admin", async () => {
    vi.spyOn(PersonsModel, "findOne").mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    vi.spyOn(PersonsModel, "create").mockResolvedValue(basePersonModel());

    const res = await request(app).post("/persons").set("Authorization", "Bearer admin").send({
      per_txt_first_name: "Juan",
      per_txt_last_name: "Perez",
      per_txt_dni: "12345678",
      per_dat_birthdate: "1990-01-01",
      per_int_gender: 1,
      per_txt_email: "juan.perez@correo.com",
      per_txt_phone: "3511234567",
      per_txt_address: "Calle Falsa 1234",
      per_sta_state: 1,
    });

    expect(res.status).toBe(201);
    expect(res.body.per_txt_email).toBe("juan.perez@correo.com");
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app).post("/persons").send({
      per_txt_first_name: "Juan",
      per_txt_last_name: "Perez",
      per_sta_state: 1,
    });

    expect(res.status).toBe(401);
  });

  it("returns 403 when role is not allowed", async () => {
    const res = await request(app).post("/persons").set("Authorization", "Bearer other").send({
      per_txt_first_name: "Juan",
      per_txt_last_name: "Perez",
      per_sta_state: 1,
    });

    expect(res.status).toBe(403);
  });
});

describe("GET /persons/:id", () => {
  it("returns 200 for admin", async () => {
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue(basePersonModel());

    const res = await request(app).get("/persons/1").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(res.body.per_id).toBe(1);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).get("/persons/abc").set("Authorization", "Bearer admin");

    expect(res.status).toBe(400);
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue(null);

    const res = await request(app).get("/persons/999").set("Authorization", "Bearer admin");

    expect(res.status).toBe(404);
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app).get("/persons/1");

    expect(res.status).toBe(401);
  });

  it("returns 403 when role is not allowed", async () => {
    const res = await request(app).get("/persons/1").set("Authorization", "Bearer other");

    expect(res.status).toBe(403);
  });
});
