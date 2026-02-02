INSERT INTO rol (rol_name, rol_description, rol_weight)
SELECT 'admin', 'Administrador', 1
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_name = 'admin');

INSERT INTO rol (rol_name, rol_description, rol_weight)
SELECT 'recepcionista', 'Recepcionista', 2
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_name = 'recepcionista');

INSERT INTO rol (rol_name, rol_description, rol_weight)
SELECT 'medico', 'Medico', 3
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_name = 'medico');

INSERT INTO rol (rol_name, rol_description, rol_weight)
SELECT 'paciente', 'Paciente', 4
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE rol_name = 'paciente');

INSERT INTO users (
  usr_txt_email,
  usr_txt_password,
  usr_bol_email_verified,
  usr_sta_state,
  usr_sta_employee_state,
  usr_dat_created_at,
  usr_dat_updated_at
)
SELECT
  'admin@clinica.local',
  '$2b$10$REEMPLAZAR_POR_HASH_REAL',
  TRUE,
  1,
  1,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE usr_txt_email = 'admin@clinica.local');

INSERT INTO usr_rol (user_id, rol_id)
SELECT u.usr_idt_id, r.id
FROM users u
JOIN rol r ON r.rol_name = 'admin'
WHERE u.usr_txt_email = 'admin@clinica.local'
  AND NOT EXISTS (
    SELECT 1
    FROM usr_rol ur
    WHERE ur.user_id = u.usr_idt_id
      AND ur.rol_id = r.id
  );

