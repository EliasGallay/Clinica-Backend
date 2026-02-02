import { Router } from "express";
import {
  login,
  register,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "./auth.controllers";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-verification", resendVerification);
authRouter.post("/request-password-reset", requestPasswordReset);
authRouter.post("/reset-password", resetPassword);

export { authRouter };
