import { z } from "zod";

export const updateUserDtoSchema = z.object({
  loc_idt_id: z.number().int().optional(),
  usr_txt_name: z.string().min(1).max(50).optional(),
  usr_txt_lastname: z.string().min(1).max(50).optional(),
  usr_txt_dni: z.string().min(1).max(10).optional(),
  usr_dat_dateofbirth: z.coerce.date().optional(),
  usr_int_gender: z.number().int().optional(),
  usr_txt_celphone: z.string().min(1).max(20).nullable().optional(),
  usr_txt_cuit_cuil: z.string().min(1).max(11).optional(),
  usr_txt_email: z.string().email().max(50).optional(),
  usr_txt_streetname: z.string().min(1).max(50).optional(),
  usr_txt_streetnumber: z.string().min(1).max(4).optional(),
  usr_txt_floor: z.string().min(1).max(2).nullable().optional(),
  usr_txt_department: z.string().min(1).max(4).nullable().optional(),
  usr_txt_postalcode: z.string().min(1).max(10).optional(),
  usr_int_rol: z.number().int().optional(),
  usr_dat_registrationdate: z.coerce.date().optional(),
  usr_int_registerorigin: z.number().int().optional(),
  usr_txt_registeroriginhash: z.string().min(1).max(50).nullable().optional(),
  usr_dat_terminationdate: z.coerce.date().nullable().optional(),
  usr_int_image: z.number().int().nullable().optional(),
  usr_txt_image_ext: z.string().min(1).max(100).nullable().optional(),
  usr_txt_password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character")
    .optional(),
  usr_txt_token: z.string().min(1).max(250).nullable().optional(),
  usr_sta_state: z.number().int().optional(),
  usr_sta_employee_state: z.number().int().optional(),
  usr_txt_verification_code: z.string().min(1).max(6).nullable().optional(),
  date_deleted_at: z.coerce.date().nullable().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;
