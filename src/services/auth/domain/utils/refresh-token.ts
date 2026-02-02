import crypto from "crypto";
import { REFRESH_TOKEN_EXPIRE } from "../../../../config/const";

const UNITS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

const parseDurationToMs = (value: string): number => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const match = /^(\d+)(ms|s|m|h|d)?$/.exec(trimmed);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = match[2] ?? "s";
  const factor = UNITS[unit];
  return Number.isFinite(amount) ? amount * factor : 0;
};

export const generateRefreshToken = (): string => crypto.randomBytes(32).toString("base64url");

export const hashRefreshToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const getRefreshTokenExpiry = (): Date => {
  const ms = parseDurationToMs(REFRESH_TOKEN_EXPIRE);
  const ttl = ms > 0 ? ms : 7 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ttl);
};
