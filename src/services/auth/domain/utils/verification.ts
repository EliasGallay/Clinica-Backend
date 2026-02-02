import bcrypt from "bcryptjs";

const VERIFICATION_CODE_TTL_MINUTES = 10;

export const generateVerificationCode = (): string =>
  String(Math.floor(100000 + Math.random() * 900000));

export const getVerificationExpiry = (): Date =>
  new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000);

export const isExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return true;
  const expiry = expiresAt.getTime();
  if (Number.isNaN(expiry)) return true;
  return Date.now() > expiry;
};

export const hashCode = async (code: string): Promise<string> => bcrypt.hash(code, 10);

export const compareCode = async (code: string, hash: string): Promise<boolean> =>
  bcrypt.compare(code, hash);
