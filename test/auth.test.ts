import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Transaction } from "sequelize";
import { app } from "../src/app";
import { RefreshTokensModel, RolesModel, UsersModel, sequelize } from "../src/infrastructure/db";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";
import type { RefreshTokenModelInstance } from "../src/services/auth/infrastructure/data/refresh-token.types";
import { hashRefreshToken } from "../src/services/auth/domain/utils/refresh-token";

vi.mock("../src/config/adapters/jwt.adapter", () => ({
  signToken: () => "test-token",
}));
vi.mock("../src/services/auth/infrastructure/mailersend-email-sender", () => ({
  MailerSendEmailSender: class {
    async sendVerificationEmail(): Promise<void> {}
    async sendPasswordResetEmail(): Promise<void> {}
  },
}));

const baseUserModel = (): UsersModelInstance =>
  ({
    usr_idt_id: 1,
    usr_txt_email: "juan.perez@correo.com",
    usr_txt_password: "",
    usr_bol_email_verified: false,
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
    roles: [{ rol_name: "admin" }],
  }) as UsersModelInstance & { roles: Array<{ rol_name: string }> };

const baseRefreshTokenModel = (
  overrides: Partial<RefreshTokenModelInstance> = {},
): RefreshTokenModelInstance =>
  ({
    rtk_id: "rtk-1",
    user_id: 1,
    rtk_txt_hash: "hash",
    rtk_dat_expires_at: new Date("2026-02-03T03:00:00.000Z"),
    rtk_dat_revoked_at: null,
    rtk_dat_created_at: new Date("2026-02-02T03:00:00.000Z"),
    rtk_dat_last_used_at: null,
    rtk_txt_user_agent: "test-agent",
    rtk_txt_ip: "127.0.0.1",
    ...overrides,
  }) as RefreshTokenModelInstance;

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /auth/register", () => {
  it("creates a user and returns 201", async () => {
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(null as UsersModelInstance | null);
    vi.spyOn(UsersModel, "create").mockResolvedValue(baseUserModel());
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as [number]);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel());
    vi.spyOn(RolesModel, "findAll").mockResolvedValue([
      { id: "role-id", rol_name: "paciente" },
    ] as unknown as Array<{
      id: string;
      rol_name: string;
    }>);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback) =>
      callback({} as Transaction),
    );

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
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(model);
    vi.spyOn(RefreshTokensModel, "create").mockResolvedValue(baseRefreshTokenModel());

    const res = await request(app).post("/auth/login").send({
      usr_txt_email: "juan.perez@correo.com",
      usr_txt_password: "Password#123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf("string");
    expect(res.body.refreshToken).toBeTypeOf("string");
  });

  it("returns 401 when credentials are invalid", async () => {
    vi.spyOn(UsersModel, "findOne").mockResolvedValue(null as UsersModelInstance | null);

    const res = await request(app).post("/auth/login").send({
      usr_txt_email: "juan.perez@correo.com",
      usr_txt_password: "Password#123",
    });

    expect(res.status).toBe(401);
  });
});

describe("POST /auth/refresh", () => {
  it("rotates refresh token and returns new tokens", async () => {
    const refreshToken = "refresh-token-example-1234567890";
    const refreshHash = hashRefreshToken(refreshToken);
    const storedToken = baseRefreshTokenModel({
      rtk_txt_hash: refreshHash,
      rtk_dat_expires_at: new Date("2026-02-03T03:00:00.000Z"),
      rtk_dat_revoked_at: null,
      user_id: 1,
    });
    const user = baseUserModel();
    user.usr_bol_email_verified = true;
    user.usr_sta_state = 1;

    vi.spyOn(RefreshTokensModel, "findOne").mockResolvedValue(storedToken);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(user);
    vi.spyOn(RefreshTokensModel, "update").mockResolvedValue([1] as [number]);
    vi.spyOn(RefreshTokensModel, "create").mockResolvedValue(baseRefreshTokenModel());
    vi.spyOn(sequelize, "transaction").mockImplementation(async (callback) =>
      callback({} as Transaction),
    );

    const res = await request(app).post("/auth/refresh").send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf("string");
    expect(res.body.refreshToken).toBeTypeOf("string");
    expect(res.body.refreshToken).not.toBe(refreshToken);
  });

  it("returns 401 when refresh token is invalid", async () => {
    vi.spyOn(RefreshTokensModel, "findOne").mockResolvedValue(
      null as RefreshTokenModelInstance | null,
    );

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "refresh-token-example-1234567890" });

    expect(res.status).toBe(401);
  });
});

describe("POST /auth/logout", () => {
  it("revokes refresh token and returns 200", async () => {
    const refreshToken = "refresh-token-example-1234567890";
    const refreshHash = hashRefreshToken(refreshToken);
    const storedToken = baseRefreshTokenModel({ rtk_txt_hash: refreshHash });

    vi.spyOn(RefreshTokensModel, "findOne").mockResolvedValue(storedToken);
    const updateSpy = vi.spyOn(RefreshTokensModel, "update").mockResolvedValue([1] as [number]);

    const res = await request(app).post("/auth/logout").send({ refreshToken });

    expect(res.status).toBe(200);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("returns 200 even when refresh token is not found", async () => {
    vi.spyOn(RefreshTokensModel, "findOne").mockResolvedValue(
      null as RefreshTokenModelInstance | null,
    );

    const res = await request(app)
      .post("/auth/logout")
      .send({ refreshToken: "refresh-token-example-1234567890" });

    expect(res.status).toBe(200);
  });
});
