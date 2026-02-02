import bcrypt from "bcryptjs";
import type { LoginDto } from "../dtos";
import type { UserRepository } from "../../../users/domain/user.repository";
import { signToken } from "../../../../config/adapters/jwt.adapter";

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.getByEmail(data.usr_txt_email);
    if (!user || !user.usr_txt_password) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(data.usr_txt_password, user.usr_txt_password);
    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.usr_bol_email_verified || user.usr_sta_state !== 1) {
      throw new Error("ACCOUNT_INACTIVE");
    }

    const token = signToken({
      usr_idt_id: user.usr_idt_id,
      usr_txt_email: user.usr_txt_email,
      usr_int_rol: user.usr_int_rol,
    });

    return { token };
  }
}
