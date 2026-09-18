import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  species: z.string().trim().min(1, 'Species is required.'),
  adopted: z.boolean(),
  age: z.number().int().nonnegative('Age must be a non-negative integer.'),
  breed: z.string().trim().optional(),
  photo: z.string().trim().optional(),
  medicalRecord: z
    .object({
      vaccinations: z.array(z.string()),
      weightKg: z.number().positive('Weight must be greater than zero.'),
      microchipId: z.string().nullable(),
    })
    .optional(),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
