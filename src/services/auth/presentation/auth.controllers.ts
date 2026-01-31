import type { Request, Response } from "express";
import { loginDtoSchema } from "../domain/dtos";
import { LoginUseCase } from "../domain/use-cases";
import { createUserDtoSchema } from "../../users/domain/dtos";
import { CreateUserUseCase } from "../../users/domain/use-cases";
import { UserPostgresDatasourceImpl } from "../../users/infrastructure/users.datasource.impl";
import { UserRepositoryImpl } from "../../users/infrastructure/users.repository.impl";

const datasource = new UserPostgresDatasourceImpl();
const repository = new UserRepositoryImpl(datasource);
const loginUseCase = new LoginUseCase(repository);
const createUserUseCase = new CreateUserUseCase(repository);

export const login = async (req: Request, res: Response) => {
  const parsed = loginDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const result = await loginUseCase.execute(parsed.data);
    return res.status(200).json(result);
  } catch {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export const register = async (req: Request, res: Response) => {
  const parsed = createUserDtoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const user = await createUserUseCase.execute(parsed.data);
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (error instanceof Error && error.message === "DNI_ALREADY_EXISTS") {
      return res.status(409).json({ message: "DNI already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
