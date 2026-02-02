import express from "express";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { healthRouter } from "./services/health/presentation";
import { usersRouter } from "./services/users/presentation";
import { authRouter } from "./services/auth/presentation";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = YAML.load(path.join(process.cwd(), "docs", "swagger-docs.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export { app };
