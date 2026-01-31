import express from "express";
import { healthRouter } from "./services/health/presentation";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRouter);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export { app };
