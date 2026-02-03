import type { Request, Response } from "express";
import { DoctorsPostgresDatasourceImpl } from "../infrastructure/doctors.datasource.impl";
import { DoctorRepositoryImpl } from "../infrastructure/doctors.repository.impl";
import { CreateDoctorUseCase } from "../domain/use-cases";
import { PersonsPostgresDatasourceImpl } from "../../persons/infrastructure/persons.datasource.impl";
import { PersonRepositoryImpl } from "../../persons/infrastructure/persons.repository.impl";

const datasource = new DoctorsPostgresDatasourceImpl();
const repository = new DoctorRepositoryImpl(datasource);
const personsDatasource = new PersonsPostgresDatasourceImpl();
const personRepository = new PersonRepositoryImpl(personsDatasource);
const createDoctorUseCase = new CreateDoctorUseCase(repository, personRepository);

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await createDoctorUseCase.execute(req.body);
    return res.status(201).json(doctor);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "PERSON_NOT_FOUND") {
      return res.status(400).json({ message: "Person not found" });
    }
    if (error instanceof Error && error.message === "DOCTOR_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Doctor already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
