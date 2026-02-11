import type { ModulesRepository } from "../modules.repository";
import type { NavItem } from "../dtos";
import { toNavItem } from "../nav-item.mapper";

export class GetModulesUseCase {
  constructor(private readonly repository: ModulesRepository) {}

  async execute(): Promise<NavItem[]> {
    const modules = await this.repository.getAllWithSubmodules();
    return modules.map((module) => toNavItem(module));
  }
}
