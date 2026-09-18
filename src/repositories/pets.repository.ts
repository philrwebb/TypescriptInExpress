import { db } from '../db.js';
import type { Pet } from '../data/pets.js';
import type { CreatePetInput, UpdatePetInput } from '../validators/pets.validator.js';

type PetFilters = {
  species?: string;
  adopted?: boolean;
  minAge?: number;
  maxAge?: number;
};

const normalizePet = (row: Record<string, unknown>): Pet => {
  const medicalRecord = typeof row.medicalRecord === 'string' && row.medicalRecord ? JSON.parse(row.medicalRecord) : undefined;

  return {
    id: Number(row.id),
    name: String(row.name),
    species: String(row.species),
    adopted: Boolean(row.adopted),
    age: Number(row.age),
    breed: row.breed ? String(row.breed) : undefined,
    intakeDate: row.intakeDate ? new Date(String(row.intakeDate)) : undefined,
    adoptionDate: row.adoptionDate ? new Date(String(row.adoptionDate)) : undefined,
    medicalRecord,
    photo: row.photo ? String(row.photo) : undefined,
  };
};

export const petRepository = {
  findAll(filters: PetFilters = {}): Pet[] {
    const clauses: string[] = [];
    const params: Record<string, string | number | boolean> = {};

    if (filters.species) {
      clauses.push('LOWER(species) = LOWER(@species)');
      params.species = filters.species;
    }

    if (filters.adopted !== undefined) {
      clauses.push('adopted = @adopted');
      params.adopted = filters.adopted ? 1 : 0;
    }

    if (filters.minAge !== undefined) {
      clauses.push('age >= @minAge');
      params.minAge = filters.minAge;
    }

    if (filters.maxAge !== undefined) {
      clauses.push('age <= @maxAge');
      params.maxAge = filters.maxAge;
    }

    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const query = db.prepare(`SELECT * FROM pets ${whereClause} ORDER BY id ASC`);

    const rows = query.all(params) as Record<string, unknown>[];
    return rows.map(normalizePet);
  },

  findById(id: number): Pet | undefined {
    const row = db.prepare('SELECT * FROM pets WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? normalizePet(row) : undefined;
  },

  create(data: CreatePetInput): Pet {
    const insert = db.prepare(`
      INSERT INTO pets (name, species, adopted, age, breed, intakeDate, adoptionDate, medicalRecord, photo)
      VALUES (@name, @species, @adopted, @age, @breed, @intakeDate, @adoptionDate, @medicalRecord, @photo)
    `);

    const result = insert.run({
      name: data.name,
      species: data.species,
      adopted: data.adopted ? 1 : 0,
      age: data.age,
      breed: data.breed ?? null,
      intakeDate: new Date().toISOString(),
      adoptionDate: null,
      medicalRecord: data.medicalRecord ? JSON.stringify(data.medicalRecord) : null,
      photo: data.photo ?? null,
    });

    const createdPet = this.findById(Number(result.lastInsertRowid));

    if (!createdPet) {
      throw new Error('Failed to create pet.');
    }

    return createdPet;
  },

  updateById(id: number, data: UpdatePetInput): Pet | undefined {
    const existingPet = this.findById(id);
    if (!existingPet) {
      return undefined;
    }

    const nextPet = {
      ...existingPet,
      ...data,
      adopted: data.adopted ?? existingPet.adopted,
      age: data.age ?? existingPet.age,
      breed: data.breed ?? existingPet.breed,
      photo: data.photo ?? existingPet.photo,
    };

    const update = db.prepare(`
      UPDATE pets
      SET name = @name,
          species = @species,
          adopted = @adopted,
          age = @age,
          breed = @breed,
          intakeDate = @intakeDate,
          adoptionDate = @adoptionDate,
          medicalRecord = @medicalRecord,
          photo = @photo
      WHERE id = @id
    `);

    update.run({
      id,
      name: nextPet.name,
      species: nextPet.species,
      adopted: nextPet.adopted ? 1 : 0,
      age: nextPet.age,
      breed: nextPet.breed ?? null,
      intakeDate: nextPet.intakeDate ? new Date(nextPet.intakeDate).toISOString() : null,
      adoptionDate: nextPet.adoptionDate ? new Date(nextPet.adoptionDate).toISOString() : null,
      medicalRecord: nextPet.medicalRecord ? JSON.stringify(nextPet.medicalRecord) : null,
      photo: nextPet.photo ?? null,
    });

    return this.findById(id);
  },

  deleteById(id: number): boolean {
    const result = db.prepare('DELETE FROM pets WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
