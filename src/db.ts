import Database from 'better-sqlite3';
import { seedPets } from './data/pets.js';
import { seedProducts } from './data/products.js';

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

  db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL CHECK(length(description) <= 256),
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        sku TEXT NOT NULL UNIQUE,
        isActive INTEGER NOT NULL DEFAULT 1 CHECK (isActive IN (0, 1)),
        createdAt TEXT NOT NULL,
        updatedAt TEXT
      );
  `);

  const productCount = db.prepare('SELECT COUNT(*) as total FROM products').get() as { total: number };

  if (productCount.total === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, description, price, stock, sku, isActive, createdAt, updatedAt)
      VALUES (@id, @name, @description, @price, @stock, @sku, @isActive, @createdAt, @updatedAt)
    `);

    const insertManyProducts = db.transaction((products: typeof seedProducts) => {
      for (const product of products) {
        insertProduct.run({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          sku: product.sku,
          isActive: product.isActive ? 1 : 0,
          createdAt: new Date(product.createdAt).toISOString(),
          updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : null,
        });
      }
    });

    insertManyProducts(seedProducts);
  }

  isInitialized = true;
};

export { db };
