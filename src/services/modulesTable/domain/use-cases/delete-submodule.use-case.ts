import type { SubmodulesRepository } from "../submodules.repository";

export class DeleteSubmoduleUseCase {
  constructor(private readonly repository: SubmodulesRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error("SUBMODULE_NOT_FOUND");
    }
    await this.repository.softDelete(id);
  }
}
