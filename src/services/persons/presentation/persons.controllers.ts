import type { Request, Response } from "express";
import { DoctorsPostgresDatasourceImpl } from "../../doctors/infrastructure/doctors.datasource.impl";
import { DoctorRepositoryImpl } from "../../doctors/infrastructure/doctors.repository.impl";
import { PatientsPostgresDatasourceImpl } from "../../patients/infrastructure/patients.datasource.impl";
import { PatientRepositoryImpl } from "../../patients/infrastructure/patients.repository.impl";
import { RolPermissionsPostgresDatasourceImpl } from "../../permissions/infrastructure/rol-permissions.datasource.impl";
import { RolPermissionsRepositoryImpl } from "../../permissions/infrastructure/rol-permissions.repository.impl";
import { UserPostgresDatasourceImpl } from "../../users/infrastructure/users.datasource.impl";
import { UserRepositoryImpl } from "../../users/infrastructure/users.repository.impl";
import type { ResDTO } from "../domain/dtos";
import {
  CreatePersonUseCase,
  DeletePersonUseCase,
  GetPersonByIdUseCase,
  GetPersonsUseCase,
  UpdatePersonUseCase,
} from "../domain/use-cases";
import { PersonsPostgresDatasourceImpl } from "../infrastructure/persons.datasource.impl";
import { PersonRepositoryImpl } from "../infrastructure/persons.repository.impl";

const datasource = new PersonsPostgresDatasourceImpl();
const repository = new PersonRepositoryImpl(datasource);
const usersDatasource = new UserPostgresDatasourceImpl();
const usersRepository = new UserRepositoryImpl(usersDatasource);
const patientsDatasource = new PatientsPostgresDatasourceImpl();
const patientsRepository = new PatientRepositoryImpl(patientsDatasource);
const doctorsDatasource = new DoctorsPostgresDatasourceImpl();
const doctorsRepository = new DoctorRepositoryImpl(doctorsDatasource);
const permissionsDatasource = new RolPermissionsPostgresDatasourceImpl();
const permissionsRepository = new RolPermissionsRepositoryImpl(permissionsDatasource);
const createPersonUseCase = new CreatePersonUseCase(repository);
const getPersonByIdUseCase = new GetPersonByIdUseCase(
  repository,
  usersRepository,
  patientsRepository,
  doctorsRepository,
  permissionsRepository,
);
const getPersonsUseCase = new GetPersonsUseCase(
  repository,
  usersRepository,
  patientsRepository,
  doctorsRepository,
  permissionsRepository,
);
const updatePersonUseCase = new UpdatePersonUseCase(repository);
const deletePersonUseCase = new DeletePersonUseCase(repository);

const ok = <T>(res: Response, status: number, data: T, message = "OK") => {
  const payload: ResDTO<T> = { message, data };
  return res.status(status).json(payload);
};

export const createPerson = async (req: Request, res: Response) => {
  try {
    const person = await createPersonUseCase.execute(req.body);
    return res.status(201).json(person);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "DNI_ALREADY_EXISTS") {
      return res.status(409).json({ message: "DNI already exists" });
    }
    if (error instanceof Error && error.message === "PERSON_EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Person email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPersonById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const person = await getPersonByIdUseCase.execute(id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    return ok(res, 200, person);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPersons = async (_req: Request, res: Response) => {
  try {
    const persons = await getPersonsUseCase.execute();
    return ok(res, 200, persons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePerson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const person = await updatePersonUseCase.execute(id, req.body);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    return res.status(200).json(person);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "DNI_ALREADY_EXISTS") {
      return res.status(409).json({ message: "DNI already exists" });
    }
    if (error instanceof Error && error.message === "PERSON_EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Person email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    await deletePersonUseCase.execute(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "PERSON_NOT_FOUND") {
      return res.status(404).json({ message: "Person not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
