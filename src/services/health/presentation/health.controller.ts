import { Request, Response } from "express";
import { sequelize } from "../../../infrastructure/db";

export const getHealth = async (_req: Request, res: Response) => {
  const base = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  try {
    await sequelize.authenticate();
    res.status(200).json({ ...base, db: "up" });
  } catch {
    res.status(503).json({ ...base, db: "down" });
  }
};
