export const Permissions = {
  USERS: "users",
  PERSONS: "persons",
  PATIENTS: "patients",
  DOCTORS: "doctors",
  ROLES_PERMISSIONS: "roles.permissions",
} as const;

export type PermissionValue = (typeof Permissions)[keyof typeof Permissions];
