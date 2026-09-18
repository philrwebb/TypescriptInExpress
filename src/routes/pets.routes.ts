import express from 'express';
import type { Router } from 'express';
import { createPet, deletePet, getPetById, getPets, updatePet } from '../controllers/pets.controllers.js';
import { validateCreatePet, validateNumericId, validatePetQuery, validateUpdatePet, pleaseAuth } from '../middleware/pets.middleware.js';

export const petRouter: Router = express.Router();

petRouter.get('/', validatePetQuery, getPets);
petRouter.post('/', validateCreatePet, createPet);
petRouter.put('/:id', [pleaseAuth, validateNumericId, validateUpdatePet], updatePet);
petRouter.delete('/:id', [pleaseAuth, validateNumericId], deletePet);

petRouter.get('/:id', [pleaseAuth, validateNumericId], getPetById);
