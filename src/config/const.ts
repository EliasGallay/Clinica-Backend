export const ENV = process.env.NODE_ENV ?? "development";
export const PORT = Number(process.env.PORT ?? 3000);

export const JWT_SEED = process.env.JWT_SEED ?? "";
export const JWT_EXPIRE = process.env.JWT_EXPIRE ?? "1d";
export const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE ?? "7d";

export const DB_NAME = process.env.DB_NAME ?? "";
export const DB_USER = process.env.DB_USER ?? "";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_HOST = process.env.DB_HOST ?? "localhost";
export const DB_PORT = Number(process.env.DB_PORT ?? 5432);

export const EMAIL_SEND_ENABLED = (process.env.EMAIL_SEND_ENABLED ?? "true") === "true";
