import type { Request, Response } from "express";
import { UserPostgresDatasourceImpl } from "../infrastructure/users.datasource.impl";
import { UserRepositoryImpl } from "../infrastructure/users.repository.impl";
import { PersonsPostgresDatasourceImpl } from "../../persons/infrastructure/persons.datasource.impl";
import { PersonRepositoryImpl } from "../../persons/infrastructure/persons.repository.impl";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../domain/use-cases";
import {
  generateVerificationCode,
  getVerificationExpiry,
  hashCode,
} from "../../auth/domain/utils/verification";
import { MailerSendEmailSender } from "../../auth/infrastructure/mailersend-email-sender";
import { ConsoleEmailSender } from "../../auth/infrastructure/console-email-sender";
import { EMAIL_SEND_ENABLED } from "../../../config/const";

const datasource = new UserPostgresDatasourceImpl();
const repository = new UserRepositoryImpl(datasource);
const personsDatasource = new PersonsPostgresDatasourceImpl();
const personRepository = new PersonRepositoryImpl(personsDatasource);
const createUserUseCase = new CreateUserUseCase(repository, personRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(repository);
const updateUserUseCase = new UpdateUserUseCase(repository);
const deleteUserUseCase = new DeleteUserUseCase(repository);
const emailSender = EMAIL_SEND_ENABLED ? new MailerSendEmailSender() : new ConsoleEmailSender();

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
    const code = generateVerificationCode();
    const codeHash = await hashCode(code);
    const expiresAt = getVerificationExpiry();

    const updatedUser = await repository.update(user.usr_idt_id, {
      usr_txt_email_verification_code: codeHash,
      usr_dat_email_verification_expires_at: expiresAt,
      usr_int_email_verification_attempts: 0,
      usr_dat_email_verification_last_sent_at: new Date(),
    });

    try {
      await emailSender.sendVerificationEmail(user.usr_txt_email, code);
    } catch (error) {
      console.warn("[email] send verification failed", error);
    }
    if (process.env.NODE_ENV === "development") {
      console.info(`[email] verification code (dev) email=${user.usr_txt_email} code=${code}`);
    }
    return res.status(201).json(toSafeUser(updatedUser ?? user));
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (error instanceof Error && error.message === "PERSON_NOT_FOUND") {
      return res.status(400).json({ message: "Person not found" });
    }
    if (error instanceof Error && error.message === "PERSON_ALREADY_LINKED") {
      return res.status(409).json({ message: "Person already linked" });
    }
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { usr_idt_id?: number } }).user;
    const id = user?.usr_idt_id;
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const found = await getUserByIdUseCase.execute(id);
    if (!found) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(toSafeUser(found));
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

    const requester = (req as Request & { user?: { roles?: string[]; usr_idt_id?: number } }).user;
    const requesterRoles = requester?.roles ?? [];
    const requesterId = requester?.usr_idt_id;
    if (requesterRoles.includes("recepcionista")) {
      if (req.body?.roles) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const target = await getUserByIdUseCase.execute(id);
      if (!target) {
        return res.status(404).json({ message: "User not found" });
      }
      if (target.roles.includes("admin")) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (target.roles.includes("recepcionista") && requesterId !== target.usr_idt_id) {
        return res.status(403).json({ message: "Forbidden" });
      }
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
