import type { UserRepository } from "../../../users/domain/user.repository";
import { compareCode, isExpired } from "../utils/verification";

export class VerifyEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, code: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.usr_txt_email_verification_code || !user.usr_dat_email_verification_expires_at) {
      throw new Error("NO_VERIFICATION_PENDING");
    }

    if (isExpired(user.usr_dat_email_verification_expires_at)) {
      await this.userRepository.update(user.usr_idt_id, {
        usr_int_email_verification_attempts: user.usr_int_email_verification_attempts + 1,
      });
      throw new Error("VERIFICATION_EXPIRED");
    }

    const isValid = await compareCode(code, user.usr_txt_email_verification_code);
    if (!isValid) {
      await this.userRepository.update(user.usr_idt_id, {
        usr_int_email_verification_attempts: user.usr_int_email_verification_attempts + 1,
      });
      throw new Error("INVALID_CODE");
    }

    return this.userRepository.update(user.usr_idt_id, {
      usr_bol_email_verified: true,
      usr_sta_state: 1,
      usr_txt_email_verification_code: null,
      usr_dat_email_verification_expires_at: null,
      usr_int_email_verification_attempts: 0,
    });
  }
}
