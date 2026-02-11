import type { ModulesRepository } from "../modules.repository";

export class DeleteModuleUseCase {
  constructor(private readonly repository: ModulesRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error("MODULE_NOT_FOUND");
    }
    await this.repository.softDelete(id);
  }
}
