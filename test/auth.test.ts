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
    usr_txt_email: "juan.perez@correo.com",
    usr_txt_password: null,
    usr_bol_email_verified: false,
    usr_int_rol: 1,
    usr_sta_state: 1,
    usr_sta_employee_state: 1,
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
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as any);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel() as any);

    const res = await request(app).post("/auth/register").send({
      usr_txt_email: "juan.perez@correo.com",
      usr_txt_password: "Password#123",
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
    model.usr_bol_email_verified = true;
    model.usr_sta_state = 1;
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
