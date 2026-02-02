import type { Request, Response } from "express";
import { UserPostgresDatasourceImpl } from "../infrastructure/users.datasource.impl";
import { UserRepositoryImpl } from "../infrastructure/users.repository.impl";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../domain/use-cases";

const datasource = new UserPostgresDatasourceImpl();
const repository = new UserRepositoryImpl(datasource);
const createUserUseCase = new CreateUserUseCase(repository);
const getUserByIdUseCase = new GetUserByIdUseCase(repository);
const updateUserUseCase = new UpdateUserUseCase(repository);
const deleteUserUseCase = new DeleteUserUseCase(repository);

const toSafeUser = (user: Awaited<ReturnType<typeof getUserByIdUseCase.execute>>) => {
  if (!user) return user;
  const {
    usr_txt_password,
    usr_txt_email_verification_code,
    usr_dat_email_verification_expires_at,
    usr_int_email_verification_attempts,
    usr_dat_email_verification_last_sent_at,
    usr_txt_password_reset_token,
    usr_dat_password_reset_expires_at,
    usr_int_password_reset_attempts,
    usr_dat_password_reset_last_sent_at,
    ...safe
  } = user;
  void usr_txt_password;
  void usr_txt_email_verification_code;
  void usr_dat_email_verification_expires_at;
  void usr_int_email_verification_attempts;
  void usr_dat_email_verification_last_sent_at;
  void usr_txt_password_reset_token;
  void usr_dat_password_reset_expires_at;
  void usr_int_password_reset_attempts;
  void usr_dat_password_reset_last_sent_at;
  return safe;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserUseCase.execute(req.body);
    return res.status(201).json(toSafeUser(user));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const user = await getUserByIdUseCase.execute(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(toSafeUser(user));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const user = await updateUserUseCase.execute(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(toSafeUser(user));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    await deleteUserUseCase.execute(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
