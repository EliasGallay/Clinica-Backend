# AGENTS.md

## Purpose

This repository contains the backend application for a **medical clinic management system**.

Main features:

- User authentication and role-based access
- Patient management
- Medical staff management
- Appointments and scheduling
- Clinical records (future stages)

This project is currently in **development stage** and is NOT intended for production use.

## Medical Domain Notice

This project handles **health-related data**.

- All data used in development must be **fake or anonymized**
- Do NOT use real patient data
- Do NOT assume regulatory compliance (HIPAA, GDPR, etc.)

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication

## Local Setup

1. Install dependencies:
   npm install

2. Configure environment variables:
   cp .env.example .env

3. Run database migrations / sync models (per project scripts)

4. Start development server:
   npm run dev

## Useful Commands

- npm run dev # start development server
- npm run build # build project
- npm run test # run tests
- npm run lint # lint code

## Tests

- Tests are written using the configured test framework (see package.json scripts)
- Database-related tests may require mocks or a test database
- External services (email, storage) should be mocked

## Code Conventions

- TypeScript is mandatory
- Usage of the `any` type in TypeScript is not allowed.
- Use the project architecture:
  routes -> controller -> use-case -> repository -> datasource
- Do not bypass use-cases
- Keep business logic outside controllers
- Follow existing naming conventions

## Contribution Rules

- Do not commit secrets or real credentials
- Do not introduce breaking changes without discussion
- Respect existing architecture and patterns
- Keep commits small and descriptive

## Security

- Never log sensitive data (passwords, medical info)
- Never log JWT tokens or other credentials
- JWT secrets must be stored in environment variables
- Access control must always be role-based
