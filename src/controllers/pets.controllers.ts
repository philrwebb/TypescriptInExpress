import type { NextFunction, Request, Response } from 'express';
import type { Pet } from '../data/pets.js';
import { AppError } from '../middleware/error-handler.js';
import { petRepository } from '../repositories/pets.repository.js';
import type { CreatePetInput, UpdatePetInput } from '../validators/pets.validator.js';

export type PetQueryParams = {
  species?: string;
  adopted?: 'true' | 'false';
  minAge?: string;
  maxAge?: string;
};

export const getPets = (req: Request<{}, unknown, {}, PetQueryParams>, res: Response<Pet[]>, next: NextFunction): void => {
  try {
    const { species, adopted, minAge, maxAge } = req.query;

    const pets = petRepository.findAll({
      species,
      adopted: adopted === undefined ? undefined : adopted === 'true',
      minAge: minAge === undefined ? undefined : Number(minAge),
      maxAge: maxAge === undefined ? undefined : Number(maxAge),
    });

    res.json(pets);
  } catch (error) {
    next(error);
  }
};

export const getPetById = (req: Request<{ id: string }>, res: Response<Pet | { message: string }>, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const pet = petRepository.findById(Number(id));

    if (!pet) {
      throw new AppError(404, 'Pet not found');
    }

    res.json(pet);
  } catch (error) {
    next(error);
  }
};

export const createPet = (req: Request<{}, unknown, CreatePetInput>, res: Response<Pet | { message: string }>, next: NextFunction): void => {
  try {
    const createdPet = petRepository.create(req.body);
    res.status(201).json(createdPet);
  } catch (error) {
    next(new AppError(500, 'Failed to create pet.'));
  }
};

export const updatePet = (req: Request<{ id: string }, unknown, UpdatePetInput>, res: Response<Pet | { message: string }>, next: NextFunction): void => {
  try {
    const updatedPet = petRepository.updateById(Number(req.params.id), req.body);

    if (!updatedPet) {
      throw new AppError(404, 'Pet not found');
    }

    res.json(updatedPet);
  } catch (error) {
    next(error);
  }
};

export const deletePet = (req: Request<{ id: string }>, res: Response<{ message: string }>, next: NextFunction): void => {
  try {
    const deleted = petRepository.deleteById(Number(req.params.id));

    if (!deleted) {
      throw new AppError(404, 'Pet not found');
    }

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    next(error);
  }
};
