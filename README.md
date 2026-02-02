# Clinica Backend

Backend en Node.js + TypeScript con Express, Sequelize y Postgres.

## Requisitos

- Node.js 20+
- Postgres (local o Docker)

## Stack tecnico

- Runtime: Node.js + TypeScript
- Web: Express
- ORM: Sequelize + pg
- Tests: Vitest + Supertest
- Calidad: ESLint + Prettier + Husky

## Configuracion

1. Copia `.env.example` a `.env`.
2. Completa las variables segun tu entorno.

Variables principales:

- `NODE_ENV` (development | production)
- `PORT`
- `JWT_SEED`
- `JWT_EXPIRE`
- `REFRESH_TOKEN_EXPIRE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `EMAIL_SEND_ENABLED` (true/false, si es false loguea los codigos en consola)

## Scripts

- `npm run dev` inicia el servidor en modo desarrollo
- `npm run build` compila a `dist/`
- `npm run start` ejecuta el build
- `npm run lint` ejecuta ESLint
- `npm run fix` corre lint:fix + prettier
- `npm test` corre Vitest

## Health check

Endpoint: `GET /health`

Respuestas:

- `200` cuando la app y la DB estan OK (`db: "up"`)
- `503` cuando la DB no responde (`db: "down"`)

## Estructura (DDD)

- `src/config` variables de entorno y constantes
- `src/infrastructure` conexiones externas compartidas (DB, etc.)
- `src/services/<modulo>/domain` logica de dominio
- `src/services/<modulo>/infrastructure` persistencia/adapters del modulo
- `src/services/<modulo>/presentation` controladores y rutas

## Pre-commit

Husky ejecuta:

1. `npm run fix`
2. `npm test`
