export class RoleEntity {
  constructor(
    public id: string,
    public rol_name: string,
    public rol_description: string | null,
    public rol_weight: number | null,
  ) {}
}
