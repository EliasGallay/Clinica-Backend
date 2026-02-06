INSERT INTO rol (rol_name, rol_description, rol_weight)
SELECT 'admin', 'Administrador', 1
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_name = 'admin');

INSERT INTO rol (rol_name, rol_description, rol_weight)
SELECT 'recepcionista', 'Recepcionista', 2
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_name = 'recepcionista');

INSERT INTO persons (
  per_txt_first_name,
  per_txt_last_name,
  per_txt_dni,
  per_txt_email,
  per_sta_state,
  per_dat_created_at,
  per_dat_updated_at
)
SELECT
  'Admin',
  'Clinica',
  '41240538',
  'admin@clinica.it.com',
  1,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM persons WHERE per_txt_dni = '41240538'
);

INSERT INTO users (
  per_id,
  usr_txt_email,
  usr_txt_password,
  usr_bol_email_verified,
  usr_sta_state,
  usr_sta_employee_state,
  usr_dat_created_at,
  usr_dat_updated_at
)
SELECT
  p.per_id,
  'admin@clinica.it.com',
  '$2b$10$dZo3082P6AHKvDsJDPa5LurT8ks3WoCyS4ylALMugPOGw/sGHD7r.',
  TRUE,
  1,
  1,
  NOW(),
  NOW()
FROM persons p
WHERE p.per_txt_dni = '41240538'
  AND NOT EXISTS (SELECT 1 FROM users WHERE usr_txt_email = 'admin@clinica.it.com');

INSERT INTO usr_rol (user_id, rol_id)
SELECT u.usr_idt_id, r.id
FROM users u
JOIN rol r ON r.rol_name = 'admin'
WHERE u.usr_txt_email = 'admin@clinica.it.com'
  AND NOT EXISTS (
    SELECT 1
    FROM usr_rol ur
    WHERE ur.user_id = u.usr_idt_id
      AND ur.rol_id = r.id
  );

INSERT INTO rol_permission (
  rol_id,
  rpe_permission_txt_name,
  rpe_permission_txt_description,
  rpe_bol_can_read,
  rpe_bol_can_write
)
SELECT r.id, p.perm, p.description, TRUE, TRUE
FROM rol r
CROSS JOIN (
  VALUES
    ('users', 'Permite gestionar usuarios.'),
    ('persons', 'Permite gestionar personas.'),
    ('patients', 'Permite gestionar pacientes.'),
    ('doctors', 'Permite gestionar doctores.'),
    ('roles.permissions', 'Permite gestionar permisos de roles.')
) AS p(perm, description)
WHERE r.rol_name = 'admin'
ON CONFLICT (rol_id, rpe_permission_txt_name) DO NOTHING;

INSERT INTO rol_permission (
  rol_id,
  rpe_permission_txt_name,
  rpe_permission_txt_description,
  rpe_bol_can_read,
  rpe_bol_can_write
)
SELECT r.id, p.perm, p.description, TRUE, TRUE
FROM rol r
CROSS JOIN (
  VALUES
    ('users', 'Permite gestionar usuarios.'),
    ('persons', 'Permite gestionar personas.'),
    ('patients', 'Permite gestionar pacientes.'),
    ('doctors', 'Permite gestionar doctores.'),
    ('roles.permissions', 'Permite gestionar permisos de roles.')
) AS p(perm, description)
WHERE r.rol_name = 'recepcionista'
ON CONFLICT (rol_id, rpe_permission_txt_name) DO NOTHING;
