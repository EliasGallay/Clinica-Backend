import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { RolesModel, UsersModel, sequelize } from "../src/infrastructure/db";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";

vi.mock("../src/config/adapters/jwt.adapter", () => ({
  verifyToken: (token: string) => {
    if (token === "admin")
      return { usr_idt_id: 1, usr_txt_email: "a@a.com", roles: ["admin"] };
    if (token === "receptionist")
      return { usr_idt_id: 2, usr_txt_email: "r@r.com", roles: ["recepcionista"] };
    if (token === "doctor")
      return { usr_idt_id: 3, usr_txt_email: "d@d.com", roles: ["medico"] };
    if (token === "patient-1")
      return { usr_idt_id: 10, usr_txt_email: "p1@p.com", roles: ["paciente"] };
    if (token === "patient-2")
      return { usr_idt_id: 11, usr_txt_email: "p2@p.com", roles: ["paciente"] };
    throw new Error("Invalid token");
  },
}));

const baseUserModel = (id = 10): UsersModelInstance =>
  ({
    usr_idt_id: id,
    loc_idt_id: 1,
    usr_txt_name: "Juan",
    usr_txt_lastname: "Perez",
    usr_txt_dni: "12345678",
    usr_dat_dateofbirth: new Date("1990-01-01"),
    usr_int_gender: 1,
    usr_txt_celphone: "3511234567",
    usr_txt_cuit_cuil: "20345678901",
    usr_txt_email: "juan.perez@correo.com",
    usr_txt_streetname: "Calle Falsa",
    usr_txt_streetnumber: "1234",
    usr_txt_floor: "2",
    usr_txt_department: "B",
    usr_txt_postalcode: "5000",
    usr_dat_registrationdate: new Date("2025-01-01"),
    usr_int_registerorigin: 1,
    usr_txt_registeroriginhash: "web",
    usr_dat_terminationdate: null,
    usr_int_image: null,
    usr_txt_password: null,
    usr_txt_token: null,
    usr_sta_state: 1,
    usr_sta_employee_state: 1,
    usr_txt_verification_code: null,
    date_deleted_at: null,
    usr_txt_image_ext: null,
    roles: [{ rol_name: "paciente" }],
  }) as UsersModelInstance & { roles: Array<{ rol_name: string }> };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /users/:id", () => {
  it("allows patient to access their own profile", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(10) as any);

    const res = await request(app).get("/users/10").set("Authorization", "Bearer patient-1");

    expect(res.status).toBe(200);
  });

  it("forbids patient from accessing another profile", async () => {
    const res = await request(app).get("/users/11").set("Authorization", "Bearer patient-1");

    expect(res.status).toBe(403);
  });

  it("returns 404 when user does not exist", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(null as any);

    const res = await request(app).get("/users/99").set("Authorization", "Bearer admin");

    expect(res.status).toBe(404);
  });
});

describe("PUT /users/:id", () => {
  it("allows receptionist to update", async () => {
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as any);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(10) as any);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback) =>
      callback({} as any),
    );

    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer receptionist")
      .send({ usr_txt_name: "Juan Carlos" });

    expect(res.status).toBe(200);
  });

  it("forbids doctor from updating", async () => {
    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer doctor")
      .send({ usr_txt_name: "Juan Carlos" });

    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid body", async () => {
    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer admin")
      .send({ usr_txt_password: "weak" });

    expect(res.status).toBe(400);
  });

  it("returns 404 when user does not exist", async () => {
    vi.spyOn(UsersModel, "update").mockResolvedValue([0] as any);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(null as any);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback) =>
      callback({} as any),
    );

    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer admin")
      .send({ usr_txt_name: "Juan Carlos" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /users/:id", () => {
  it("allows admin to delete", async () => {
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as any);

    const res = await request(app).delete("/users/10").set("Authorization", "Bearer admin");

    expect(res.status).toBe(204);
  });

  it("forbids receptionist from deleting", async () => {
    const res = await request(app).delete("/users/10").set("Authorization", "Bearer receptionist");

    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).delete("/users/abc").set("Authorization", "Bearer admin");

    expect(res.status).toBe(400);
  });
});

describe("POST /users", () => {
  const validBody = {
    loc_idt_id: 1,
    usr_txt_name: "Juan",
    usr_txt_lastname: "Perez",
    usr_txt_dni: "12345678",
    usr_dat_dateofbirth: "1990-01-01",
    usr_int_gender: 1,
    usr_txt_celphone: "3511234567",
    usr_txt_cuit_cuil: "20345678901",
    usr_txt_email: "juan.perez@correo.com",
    usr_txt_streetname: "Calle Falsa",
    usr_txt_streetnumber: "1234",
    usr_txt_floor: "2",
    usr_txt_department: "B",
    usr_txt_postalcode: "5000",
    roles: ["admin"],
    usr_dat_registrationdate: "2025-01-01",
    usr_int_registerorigin: 1,
    usr_txt_registeroriginhash: "web",
    usr_dat_terminationdate: null,
    usr_int_image: null,
    usr_txt_image_ext: null,
    usr_txt_password: "Password#123",
    usr_txt_token: null,
    usr_sta_state: 1,
    usr_sta_employee_state: 1,
    usr_txt_verification_code: null,
    date_deleted_at: null,
  };

  it("allows admin to create", async () => {
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(null as any);
    vi.spyOn(UsersModel, "create").mockResolvedValue(baseUserModel(10) as any);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(10) as any);
    vi.spyOn(RolesModel, "findAll").mockResolvedValue([{ id: "role-id", rol_name: "admin" }] as any);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback) =>
      callback({} as any),
    );

    const res = await request(app)
      .post("/users")
      .set("Authorization", "Bearer admin")
      .send(validBody);

    expect(res.status).toBe(201);
  });

  it("forbids doctor to create", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", "Bearer doctor")
      .send(validBody);

    expect(res.status).toBe(403);
  });
});
