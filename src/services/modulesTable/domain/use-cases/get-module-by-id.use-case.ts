import type { ModulesRepository } from "../modules.repository";
import type { NavItem } from "../dtos";
import { toNavItem } from "../nav-item.mapper";

export class GetModuleByIdUseCase {
  constructor(private readonly repository: ModulesRepository) {}

  async execute(id: number): Promise<NavItem | null> {
    const module = await this.repository.getByIdWithSubmodules(id);
    return module ? toNavItem(module) : null;
  }
}
