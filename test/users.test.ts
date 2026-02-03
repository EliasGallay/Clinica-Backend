import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Transaction } from "sequelize";
import { app } from "../src/app";
import { PersonsModel, RolesModel, UsersModel, sequelize } from "../src/infrastructure/db";
import type { UsersModelInstance } from "../src/services/users/infrastructure/data/users.types";
import type { PersonsModelInstance } from "../src/services/persons/infrastructure/data/persons.types";

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
vi.mock("../src/services/auth/infrastructure/mailersend-email-sender", () => ({
  MailerSendEmailSender: class {
    async sendVerificationEmail(): Promise<void> {}
    async sendPasswordResetEmail(): Promise<void> {}
  },
}));

const baseUserModel = (id = 10): UsersModelInstance =>
  ({
    usr_idt_id: id,
    per_id: 1,
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
    usr_txt_password: "",
    usr_txt_token: null,
    usr_sta_state: 1,
    usr_sta_employee_state: 1,
    usr_int_token_version: 0,
    usr_txt_verification_code: null,
    date_deleted_at: null,
    usr_txt_image_ext: null,
    roles: [{ rol_name: "admin" }],
  }) as unknown as UsersModelInstance & { roles: Array<{ rol_name: string }> };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /users/:id", () => {
  it("allows admin to access a profile", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(10));

    const res = await request(app).get("/users/10").set("Authorization", "Bearer admin");

    expect(res.status).toBe(200);
  });

  it("returns 404 when user does not exist", async () => {
    vi.spyOn(UsersModel, "findByPk")
      .mockResolvedValueOnce(baseUserModel(1))
      .mockResolvedValueOnce(null as UsersModelInstance | null);

    const res = await request(app).get("/users/99").set("Authorization", "Bearer admin");

    expect(res.status).toBe(404);
  });
});

describe("GET /users/me", () => {
  it("returns current user for receptionist", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(2));

    const res = await request(app).get("/users/me").set("Authorization", "Bearer receptionist");

    expect(res.status).toBe(200);
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app).get("/users/me");

    expect(res.status).toBe(401);
  });
});
describe("PUT /users/:id", () => {
  it("forbids receptionist to update other staff", async () => {
    const model = baseUserModel(10);
    (model as UsersModelInstance & { roles: Array<{ rol_name: string }> }).roles = [
      { rol_name: "recepcionista" },
    ];
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as [number]);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(model);
    vi.spyOn(sequelize, "transaction").mockImplementation((async (...args: unknown[]) => {
      const callback = typeof args[0] === "function" ? args[0] : args[1];
      return (callback as (transaction: Transaction) => unknown)({} as Transaction);
    }) as unknown as typeof sequelize.transaction);

    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer receptionist")
      .send({ usr_txt_name: "Juan Carlos" });

    expect(res.status).toBe(403);
  });

  it("forbids receptionist from updating admin", async () => {
    const model = baseUserModel(10);
    (model as UsersModelInstance & { roles: Array<{ rol_name: string }> }).roles = [
      { rol_name: "admin" },
    ];
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(model);

    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer receptionist")
      .send({ usr_txt_name: "Juan Carlos" });

    expect(res.status).toBe(403);
  });

  it("forbids receptionist from updating another receptionist", async () => {
    const model = baseUserModel(10);
    (model as UsersModelInstance & { roles: Array<{ rol_name: string }> }).roles = [
      { rol_name: "recepcionista" },
    ];
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(model);

    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer receptionist")
      .send({ usr_txt_email: "new@correo.com" });

    expect(res.status).toBe(403);
  });

  it("allows receptionist to update self", async () => {
    const model = baseUserModel(2);
    (model as UsersModelInstance & { roles: Array<{ rol_name: string }> }).roles = [
      { rol_name: "recepcionista" },
    ];
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as [number]);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(model);
    vi.spyOn(sequelize, "transaction").mockImplementation((async (...args: unknown[]) => {
      const callback = typeof args[0] === "function" ? args[0] : args[1];
      return (callback as (transaction: Transaction) => unknown)({} as Transaction);
    }) as unknown as typeof sequelize.transaction);

    const res = await request(app)
      .put("/users/2")
      .set("Authorization", "Bearer receptionist")
      .send({ usr_txt_email: "self@correo.com" });

    expect(res.status).toBe(200);
  });

  it("forbids receptionist from changing roles", async () => {
    const model = baseUserModel(10);
    (model as UsersModelInstance & { roles: Array<{ rol_name: string }> }).roles = [
      { rol_name: "recepcionista" },
    ];
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(model);

    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer receptionist")
      .send({ roles: ["admin"] });

    expect(res.status).toBe(403);
  });

  it("forbids doctor from updating", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(3));
    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer other")
      .send({ usr_txt_name: "Juan Carlos" });

    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid body", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(1));
    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer admin")
      .send({ usr_txt_password: "weak" });

    expect(res.status).toBe(400);
  });

  it("returns 404 when user does not exist", async () => {
    vi.spyOn(UsersModel, "update").mockResolvedValue([0] as [number]);
    vi.spyOn(UsersModel, "findByPk")
      .mockResolvedValueOnce(baseUserModel(1))
      .mockResolvedValueOnce(null as UsersModelInstance | null);
    vi.spyOn(sequelize, "transaction").mockImplementation((async (...args: unknown[]) => {
      const callback = typeof args[0] === "function" ? args[0] : args[1];
      return (callback as (transaction: Transaction) => unknown)({} as Transaction);
    }) as unknown as typeof sequelize.transaction);

    const res = await request(app)
      .put("/users/10")
      .set("Authorization", "Bearer admin")
      .send({ usr_txt_name: "Juan Carlos" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /users/:id", () => {
  it("allows admin to delete", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(1));
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as [number]);

    const res = await request(app).delete("/users/10").set("Authorization", "Bearer admin");

    expect(res.status).toBe(204);
  });

  it("forbids receptionist from deleting", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(2));
    const res = await request(app).delete("/users/10").set("Authorization", "Bearer receptionist");

    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid id", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(1));
    const res = await request(app).delete("/users/abc").set("Authorization", "Bearer admin");

    expect(res.status).toBe(400);
  });
});

describe("POST /users", () => {
  const validBody = {
    usr_txt_email: "juan.perez@correo.com",
    roles: ["admin"],
    usr_txt_password: "Password#123",
    usr_sta_state: 1,
    usr_sta_employee_state: 1,
    per_id: 1,
  };

  it("allows admin to create", async () => {
    vi.spyOn(UsersModel, "findOne")
      .mockResolvedValueOnce(null as UsersModelInstance | null)
      .mockResolvedValueOnce(null as UsersModelInstance | null);
    vi.spyOn(PersonsModel, "findByPk").mockResolvedValue({
      per_id: 1,
    } as unknown as PersonsModelInstance);
    vi.spyOn(UsersModel, "create").mockResolvedValue(baseUserModel(10));
    vi.spyOn(UsersModel, "update").mockResolvedValue([1] as [number]);
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(10));
    vi.spyOn(RolesModel, "findAll").mockResolvedValue([
      { id: "role-id", rol_name: "admin" },
    ] as unknown as Array<ReturnType<typeof RolesModel.build>>);
    vi.spyOn(sequelize, "transaction").mockImplementation((async (...args: unknown[]) => {
      const callback = typeof args[0] === "function" ? args[0] : args[1];
      return (callback as (transaction: Transaction) => unknown)({} as Transaction);
    }) as unknown as typeof sequelize.transaction);

    const res = await request(app)
      .post("/users")
      .set("Authorization", "Bearer admin")
      .send(validBody);

    expect(res.status).toBe(201);
  });

  it("forbids doctor to create", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(3));
    const res = await request(app)
      .post("/users")
      .set("Authorization", "Bearer other")
      .send(validBody);

    expect(res.status).toBe(403);
  });

  it("forbids receptionist to create", async () => {
    vi.spyOn(UsersModel, "findByPk").mockResolvedValue(baseUserModel(2));
    const res = await request(app)
      .post("/users")
      .set("Authorization", "Bearer receptionist")
      .send(validBody);

    expect(res.status).toBe(403);
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app).post("/users").send(validBody);

    expect(res.status).toBe(401);
  });
});
