import bcrypt from "bcryptjs";
import type { UserRepository } from "../../../users/domain/user.repository";
import { compareCode, isExpired } from "../utils/verification";

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, code: string, newPassword: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.usr_txt_password_reset_token || !user.usr_dat_password_reset_expires_at) {
      throw new Error("NO_RESET_PENDING");
    }

    if (isExpired(user.usr_dat_password_reset_expires_at)) {
      await this.userRepository.update(user.usr_idt_id, {
        usr_int_password_reset_attempts: user.usr_int_password_reset_attempts + 1,
      });
      throw new Error("RESET_EXPIRED");
    }

    const isValid = await compareCode(code, user.usr_txt_password_reset_token);
    if (!isValid) {
      await this.userRepository.update(user.usr_idt_id, {
        usr_int_password_reset_attempts: user.usr_int_password_reset_attempts + 1,
      });
      throw new Error("INVALID_CODE");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.userRepository.update(user.usr_idt_id, {
      usr_txt_password: hashedPassword,
      usr_txt_password_reset_token: null,
      usr_dat_password_reset_expires_at: null,
      usr_int_password_reset_attempts: 0,
    });
  }
}
