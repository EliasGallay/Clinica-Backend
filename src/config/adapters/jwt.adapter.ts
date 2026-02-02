import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_SEED } from "../const";

export type JwtPayload = {
  usr_idt_id: number;
  usr_txt_email: string;
  roles: string[];
};

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, JWT_SEED, { expiresIn: JWT_EXPIRE as jwt.SignOptions["expiresIn"] });

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, JWT_SEED) as JwtPayload;

