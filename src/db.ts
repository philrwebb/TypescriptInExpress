import Database from 'better-sqlite3';
import { seedPets } from './data/pets.js';

const db = new Database('pets.db');
let isInitialized = false;

export const initializeDatabase = (): void => {
  if (isInitialized) {
    return;
  }

  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      adopted INTEGER NOT NULL CHECK (adopted IN (0, 1)),
      age INTEGER NOT NULL,
      breed TEXT,
      intakeDate TEXT,
      adoptionDate TEXT,
      medicalRecord TEXT,
      photo TEXT
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as total FROM pets').get() as { total: number };

  if (count.total === 0) {
    const insertPet = db.prepare(`
      INSERT INTO pets (id, name, species, adopted, age, breed, intakeDate, adoptionDate, medicalRecord, photo)
      VALUES (@id, @name, @species, @adopted, @age, @breed, @intakeDate, @adoptionDate, @medicalRecord, @photo)
    `);

    const insertMany = db.transaction((pets: typeof seedPets) => {
      for (const pet of pets) {
        insertPet.run({
          id: pet.id,
          name: pet.name,
          species: pet.species,
          adopted: pet.adopted ? 1 : 0,
          age: pet.age,
          breed: pet.breed ?? null,
          intakeDate: pet.intakeDate ? new Date(pet.intakeDate).toISOString() : null,
          adoptionDate: pet.adoptionDate ? new Date(pet.adoptionDate).toISOString() : null,
          medicalRecord: pet.medicalRecord ? JSON.stringify(pet.medicalRecord) : null,
          photo: pet.photo ?? null,
        });
      }
    });

    insertMany(seedPets);
  }

  isInitialized = true;
};

export { db };
