import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import { sequelize } from "../src/infrastructure/db";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /health", () => {
  it("returns 200 when db is up", async () => {
    vi.spyOn(sequelize, "authenticate").mockResolvedValue(undefined as never);

    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.db).toBe("up");
  });

  it("returns 503 when db is down", async () => {
    vi.spyOn(sequelize, "authenticate").mockRejectedValue(new Error("db down"));

    const res = await request(app).get("/health");

    expect(res.status).toBe(503);
    expect(res.body.status).toBe("down");
    expect(res.body.db).toBe("down");
  });
});

describe("GET /", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
