import express from 'express';
import type { Router } from 'express';
import { createPet, deletePet, getPetById, getPets, updatePet } from '../controllers/pets.controllers.js';
import { requireSession } from '../middleware/auth.middleware.js';
import { validateCreatePet, validateNumericId, validatePetQuery, validateUpdatePet } from '../middleware/pets.middleware.js';

export const petRouter: Router = express.Router();

petRouter.use(requireSession);
petRouter.get('/', validatePetQuery, getPets);
petRouter.post('/', validateCreatePet, createPet);
petRouter.put('/:id', [validateNumericId, validateUpdatePet], updatePet);
petRouter.delete('/:id', [validateNumericId], deletePet);

petRouter.get('/:id', [validateNumericId], getPetById);
