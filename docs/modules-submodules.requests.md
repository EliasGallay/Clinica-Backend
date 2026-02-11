# Modules/Submodules Requests

## Modules

```bash
curl -X GET http://localhost:3000/modules \
  -H "Authorization: Bearer <token>"
```

```bash
curl -X GET http://localhost:3000/modules/1 \
  -H "Authorization: Bearer <token>"
```

```bash
curl -X POST http://localhost:3000/modules \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mod_txt_key": "appointments",
    "mod_txt_name": "Turnos",
    "mod_int_order": 1,
    "mod_sta_state": 1,
    "mod_path_to": "/appointments"
  }'
```

```bash
curl -X PUT http://localhost:3000/modules/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mod_txt_name": "Agenda",
    "mod_int_order": 2
  }'
```

```bash
curl -X DELETE http://localhost:3000/modules/1 \
  -H "Authorization: Bearer <token>"
```

## Submodules

```bash
curl -X GET "http://localhost:3000/submodules?mod_id=1" \
  -H "Authorization: Bearer <token>"
```

```bash
curl -X GET http://localhost:3000/submodules/10 \
  -H "Authorization: Bearer <token>"
```

```bash
curl -X POST http://localhost:3000/submodules \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mod_id": 1,
    "sub_txt_key": "patients",
    "sub_txt_name": "Pacientes",
    "sub_int_order": 1,
    "sub_sta_state": 1,
    "sub_path_to": "/patients",
    "sub_icon": "users"
  }'
```

```bash
curl -X PUT http://localhost:3000/submodules/10 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sub_txt_name": "Listado",
    "sub_int_order": 2
  }'
```

```bash
curl -X DELETE http://localhost:3000/submodules/10 \
  -H "Authorization: Bearer <token>"
```
