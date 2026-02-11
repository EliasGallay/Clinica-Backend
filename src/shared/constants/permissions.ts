export const Permissions = {
  USERS: "users",
  PERSONS: "persons",
  PATIENTS: "patients",
  DOCTORS: "doctors",
  MODULES: "modules",
  SUBMODULES: "submodules",
  ROLES_PERMISSIONS: "roles.permissions",
} as const;

export type PermissionValue = (typeof Permissions)[keyof typeof Permissions];
