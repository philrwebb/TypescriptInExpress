import express from 'express';
import type { Router } from 'express';
import { createPet, deletePet, getPetById, getPets, updatePet } from '../controllers/pets.controllers.js';
import { requireToken, validateCreatePet, validateNumericId, validatePetQuery, validateUpdatePet } from '../middleware/pets.middleware.js';

export const petRouter: Router = express.Router();

petRouter.use(requireToken);
petRouter.get('/', validatePetQuery, getPets);
petRouter.post('/', validateCreatePet, createPet);
petRouter.put('/:id', [validateNumericId, validateUpdatePet], updatePet);
petRouter.delete('/:id', [validateNumericId], deletePet);

petRouter.get('/:id', [validateNumericId], getPetById);
