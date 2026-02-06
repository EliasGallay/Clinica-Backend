import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { DoctorsModel, PersonsModel, UsersModel } from "../src/infrastructure/db";
import type { DoctorsModelInstance } from "../src/services/doctors/infrastructure/data/doctors.types";
import type { PersonsModelInstance } from "../src/services/persons/infrastructure/data/persons.types";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";
import { setupPermissionsMock, teardownPermissionsMock } from "./permissions.mock";

vi.mock("../src/config/adapters/jwt.adapter", () => ({
  verifyToken: (token: string) => {
    if (token === "admin")
      return { usr_idt_id: 1, usr_txt_email: "a@a.com", roles: ["admin"], ver: 0 };
    if (token === "receptionist")
      return { usr_idt_id: 2, usr_txt_email: "r@r.com", roles: ["recepcionista"], ver: 0 };
    if (token === "other")
      return { usr_idt_id: 3, usr_txt_email: "o@o.com", roles: ["other"], ver: 0 };
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

const baseDoctorModel = (): DoctorsModelInstance =>
  ({
    doc_id: 1,
    per_id: 1,
    doc_txt_license: "MP-12345",
    doc_txt_specialty: "Clinica",
    doc_sta_state: 1,
    doc_dat_created_at: new Date("2026-02-02T03:00:00.000Z"),
    doc_dat_updated_at: new Date("2026-02-02T03:00:00.000Z"),
    doc_dat_deleted_at: null,
  }) as DoctorsModelInstance;

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

describe("POST /doctors", () => {
  it("creates doctor for admin", async () => {
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue(basePersonModel());
    vi.spyOn(DoctorsModel, "findOne").mockResolvedValue(null as DoctorsModelInstance | null);
    vi.spyOn(DoctorsModel, "create").mockResolvedValue(baseDoctorModel());

    const res = await request(app).post("/doctors").set("Authorization", "Bearer admin").send({
      per_id: 1,
      doc_txt_license: "MP-12345",
      doc_txt_specialty: "Clinica",
      doc_sta_state: 1,
    });

    expect(res.status).toBe(201);
    expect(res.body.doc_id).toBe(1);
  });

  it("allows receptionist to create doctor", async () => {
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue(basePersonModel());
    vi.spyOn(DoctorsModel, "findOne").mockResolvedValue(null as DoctorsModelInstance | null);
    vi.spyOn(DoctorsModel, "create").mockResolvedValue(baseDoctorModel());

    const res = await request(app)
      .post("/doctors")
      .set("Authorization", "Bearer receptionist")
      .send({
        per_id: 1,
        doc_sta_state: 1,
      });

    expect(res.status).toBe(201);
  });

  it("returns 403 when role is not allowed", async () => {
    const res = await request(app).post("/doctors").set("Authorization", "Bearer other").send({
      per_id: 1,
      doc_sta_state: 1,
    });

    expect(res.status).toBe(403);
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app).post("/doctors").send({
      per_id: 1,
      doc_sta_state: 1,
    });

    expect(res.status).toBe(401);
  });
});
