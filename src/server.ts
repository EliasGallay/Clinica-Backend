import "dotenv/config";
import { app } from "./app";
import { ENV, PORT } from "./config";
import { sequelize } from "./infrastructure/db";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("[db] connected");
  } catch (error) {
    console.error("[db] connection failed", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[server] ${ENV} listening on ${PORT}`);
  });
};

void startServer();
