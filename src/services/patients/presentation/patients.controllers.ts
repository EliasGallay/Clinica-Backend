import type { Request, Response } from "express";
import { PatientsPostgresDatasourceImpl } from "../infrastructure/patients.datasource.impl";
import { PatientRepositoryImpl } from "../infrastructure/patients.repository.impl";
import { CreatePatientUseCase } from "../domain/use-cases";
import { PersonsPostgresDatasourceImpl } from "../../persons/infrastructure/persons.datasource.impl";
import { PersonRepositoryImpl } from "../../persons/infrastructure/persons.repository.impl";

const datasource = new PatientsPostgresDatasourceImpl();
const repository = new PatientRepositoryImpl(datasource);
const personsDatasource = new PersonsPostgresDatasourceImpl();
const personRepository = new PersonRepositoryImpl(personsDatasource);
const createPatientUseCase = new CreatePatientUseCase(repository, personRepository);

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patient = await createPatientUseCase.execute(req.body);
    return res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "PERSON_NOT_FOUND") {
      return res.status(400).json({ message: "Person not found" });
    }
    if (error instanceof Error && error.message === "PATIENT_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Patient already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
