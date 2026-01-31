import bcrypt from "bcryptjs";
import type { UpdateUserDto } from "../dtos";
import type { UserRepository } from "../user.repository";
import type { UserEntity } from "../users.entity";

export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: number, data: UpdateUserDto): Promise<UserEntity | null> {
    const updateData: Partial<UserEntity> = { ...data } as Partial<UserEntity>;

    if (data.usr_txt_password) {
      updateData.usr_txt_password = await bcrypt.hash(data.usr_txt_password, 10);
    }

    return this.repository.update(id, updateData);
  }
}
