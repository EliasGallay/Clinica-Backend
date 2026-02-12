import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { DoctorsModel, PatientsModel, PersonsModel, UsersModel } from "../src/infrastructure/db";
import type { PersonsModelInstance } from "../src/services/persons/infrastructure/data/persons.types";
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

const baseUserModel = (perId: number): UsersModelInstance =>
  ({
    usr_idt_id: 10,
    per_id: perId,
    usr_txt_email: "user@correo.com",
    usr_txt_password: "hashed",
    usr_bol_email_verified: true,
    usr_sta_state: 1,
    usr_sta_employee_state: 1,
    usr_int_token_version: 0,
    usr_txt_email_verification_code: null,
    usr_dat_email_verification_expires_at: null,
    usr_int_email_verification_attempts: 0,
    usr_dat_email_verification_last_sent_at: null,
    usr_txt_password_reset_token: null,
    usr_dat_password_reset_expires_at: null,
    usr_int_password_reset_attempts: 0,
    usr_dat_password_reset_last_sent_at: null,
    usr_dat_created_at: new Date("2026-02-02T03:00:00.000Z"),
    usr_dat_updated_at: new Date("2026-02-02T03:00:00.000Z"),
    date_deleted_at: null,
    roles: [{ rol_name: "admin" }],
  }) as unknown as UsersModelInstance;

const basePatientModel = (perId: number) =>
  ({
    pat_id: 1,
    per_id: perId,
    pat_sta_state: 1,
    pat_dat_created_at: new Date("2026-02-02T03:00:00.000Z"),
    pat_dat_updated_at: new Date("2026-02-02T03:00:00.000Z"),
    pat_dat_deleted_at: null,
  }) as unknown as Awaited<ReturnType<typeof PatientsModel.findOne>>;

const baseDoctorModel = (perId: number) =>
  ({
    doc_id: 1,
    per_id: perId,
    doc_txt_license: "MP-12345",
    doc_txt_specialty: "Clinica",
    doc_sta_state: 1,
    doc_dat_created_at: new Date("2026-02-02T03:00:00.000Z"),
    doc_dat_updated_at: new Date("2026-02-02T03:00:00.000Z"),
    doc_dat_deleted_at: null,
  }) as unknown as Awaited<ReturnType<typeof DoctorsModel.findOne>>;

beforeEach(() => {
  vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseAuthUser());
  vi.spyOn(UsersModel, "findOne").mockResolvedValue(null);
  vi.spyOn(PatientsModel, "findOne").mockResolvedValue(null);
  vi.spyOn(DoctorsModel, "findOne").mockResolvedValue(null);
  setupPermissionsMock();
});

afterEach(() => {
  teardownPermissionsMock();
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
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(baseUserModel(1));
    vi.spyOn(PatientsModel, "findOne").mockResolvedValue(basePatientModel(1));
    vi.spyOn(DoctorsModel, "findOne").mockResolvedValue(baseDoctorModel(1));

    const res = await request(app).get("/persons/1").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(res.body.data.person_data.per_id).toBe(1);
    expect(res.body.data.patient_data.per_id).toBe(1);
    expect(res.body.data.doctor_data.per_id).toBe(1);
    expect(Array.isArray(res.body.data.permissions)).toBe(true);
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

describe("GET /persons/all", () => {
  it("returns 200 with list payload", async () => {
    vi.spyOn(PersonsModel, "findAll").mockResolvedValue([basePersonModel()]);
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(baseUserModel(1));
    vi.spyOn(PatientsModel, "findOne").mockResolvedValue(basePatientModel(1));
    vi.spyOn(DoctorsModel, "findOne").mockResolvedValue(null);

    const res = await request(app).get("/persons/all").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].person_data.per_id).toBe(1);
    expect(res.body.data[0].patient_data.per_id).toBe(1);
    expect(res.body.data[0].doctor_data).toBe(null);
  });
});

describe("PUT /persons/:id", () => {
  it("updates person for admin", async () => {
    const updated = basePersonModel();
    updated.per_txt_last_name = "Gomez";
    vi.spyOn(PersonsModel, "findByPk")
      .mockResolvedValueOnce(basePersonModel())
      .mockResolvedValueOnce(updated);
    vi.spyOn(PersonsModel, "update").mockResolvedValue([1]);

    const res = await request(app)
      .put("/persons/1")
      .set("Authorization", "Bearer admin")
      .send({ per_txt_last_name: "Gomez" });

    expect(res.status).toBe(200);
    expect(res.body.per_txt_last_name).toBe("Gomez");
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue(null);

    const res = await request(app)
      .put("/persons/999")
      .set("Authorization", "Bearer admin")
      .send({ per_txt_last_name: "Gomez" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /persons/:id", () => {
  it("soft deletes person", async () => {
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue(basePersonModel());
    vi.spyOn(PersonsModel, "update").mockResolvedValue([1]);

    const res = await request(app).delete("/persons/1").set("Authorization", "Bearer admin");

    expect(res.status).toBe(204);
  });

  it("returns 404 when not found", async () => {
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue(null);

    const res = await request(app).delete("/persons/999").set("Authorization", "Bearer admin");

    expect(res.status).toBe(404);
  });
});
