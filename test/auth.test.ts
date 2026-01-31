import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { app } from "../src/app";
import { UsersModel } from "../src/infrastructure/db";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";

vi.mock("../src/config/adapters/jwt.adapter", () => ({
  signToken: () => "test-token",
}));

const baseUserModel = (): UsersModelInstance =>
  ({
    usr_idt_id: 1,
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
    usr_int_rol: 1,
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
  }) as UsersModelInstance;

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /auth/register", () => {
  it("creates a user and returns 201", async () => {
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(null as any);
    vi.spyOn(UsersModel, "create").mockResolvedValue(baseUserModel() as any);

    const res = await request(app).post("/auth/register").send({
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
      usr_int_rol: 1,
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
    });

    expect(res.status).toBe(201);
    expect(res.body.usr_txt_email).toBe("juan.perez@correo.com");
  });

  it("returns 400 when body is invalid", async () => {
    const res = await request(app).post("/auth/register").send({
      usr_txt_email: "not-an-email",
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("returns token for valid credentials", async () => {
    const model = baseUserModel();
    model.usr_txt_password = bcrypt.hashSync("Password#123", 10);
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(model as any);

    const res = await request(app).post("/auth/login").send({
      usr_txt_email: "juan.perez@correo.com",
      usr_txt_password: "Password#123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf("string");
  });

  it("returns 401 when credentials are invalid", async () => {
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(null as any);

    const res = await request(app).post("/auth/login").send({
      usr_txt_email: "juan.perez@correo.com",
      usr_txt_password: "Password#123",
    });

    expect(res.status).toBe(401);
  });
});
