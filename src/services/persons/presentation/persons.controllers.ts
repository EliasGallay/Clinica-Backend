import type { Request, Response } from "express";
import { PersonsPostgresDatasourceImpl } from "../infrastructure/persons.datasource.impl";
import { PersonRepositoryImpl } from "../infrastructure/persons.repository.impl";
import { CreatePersonUseCase, GetPersonByIdUseCase } from "../domain/use-cases";

const datasource = new PersonsPostgresDatasourceImpl();
const repository = new PersonRepositoryImpl(datasource);
const createPersonUseCase = new CreatePersonUseCase(repository);
const getPersonByIdUseCase = new GetPersonByIdUseCase(repository);

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
    return res.status(200).json(person);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
