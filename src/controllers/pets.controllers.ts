import type { Request, Response } from 'express';
import type { Pet } from '../data/pets.js';
import { petRepository } from '../repositories/pets.repository.js';
import type { CreatePetInput, UpdatePetInput } from '../validators/pets.validator.js';

export type PetQueryParams = {
  species?: string;
  adopted?: 'true' | 'false';
  minAge?: string;
  maxAge?: string;
};

export const getPets = (req: Request<{}, unknown, {}, PetQueryParams>, res: Response<Pet[]>): void => {
  const { species, adopted, minAge, maxAge } = req.query;

  const pets = petRepository.findAll({
    species,
    adopted: adopted === undefined ? undefined : adopted === 'true',
    minAge: minAge === undefined ? undefined : Number(minAge),
    maxAge: maxAge === undefined ? undefined : Number(maxAge),
  });

  res.json(pets);
};

export const getPetById = (req: Request<{ id: string }>, res: Response<Pet | { message: string }>): void => {
  const { id } = req.params;
  const pet = petRepository.findById(Number(id));

  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ message: 'Pet not found' });
  }
};

export const createPet = (req: Request<{}, unknown, CreatePetInput>, res: Response<Pet | { message: string }>): void => {
  try {
    const createdPet = petRepository.create(req.body);
    res.status(201).json(createdPet);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create pet.' });
  }
};

export const updatePet = (req: Request<{ id: string }, unknown, UpdatePetInput>, res: Response<Pet | { message: string }>): void => {
  const updatedPet = petRepository.updateById(Number(req.params.id), req.body);

  if (!updatedPet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  res.json(updatedPet);
};

export const deletePet = (req: Request<{ id: string }>, res: Response<{ message: string }>): void => {
  const deleted = petRepository.deleteById(Number(req.params.id));

  if (!deleted) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  res.status(200).json({ message: 'Pet deleted successfully' });
};
