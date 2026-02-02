import type { UserRepository } from "../../../users/domain/user.repository";
import { generateVerificationCode, getVerificationExpiry, hashCode } from "../utils/verification";

export class RequestPasswordResetUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<{ code: string } | null> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return null;
    }

    const code = generateVerificationCode();
    const codeHash = await hashCode(code);
    const expiresAt = getVerificationExpiry();

    await this.userRepository.update(user.usr_idt_id, {
      usr_txt_password_reset_token: codeHash,
      usr_dat_password_reset_expires_at: expiresAt,
      usr_int_password_reset_attempts: 0,
      usr_dat_password_reset_last_sent_at: new Date(),
    });

    return { code };
  }
}
