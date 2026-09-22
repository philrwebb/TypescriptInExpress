import { db } from '../db.js';
import type { Product } from '../data/products.js';

type ProductFilters = {
  name?: string;
  sku?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

const normalizeProduct = (row: Record<string, unknown>): Product => ({
  id: Number(row.id),
  name: String(row.name),
  description: String(row.description),
  price: Number(row.price),
  stock: Number(row.stock),
  sku: String(row.sku),
  isActive: Boolean(row.isActive),
  createdAt: row.createdAt ? new Date(String(row.createdAt)) : new Date(),
  updatedAt: row.updatedAt ? new Date(String(row.updatedAt)) : undefined,
});

export const productRepository = {
  findAll(filters: ProductFilters = {}): Product[] {
    const clauses: string[] = [];
    const params: Record<string, string | number | boolean> = {};

    if (filters.name) {
      clauses.push('LOWER(name) LIKE LOWER(@name)');
      params.name = `%${filters.name}%`;
    }

    if (filters.sku) {
      clauses.push('LOWER(sku) = LOWER(@sku)');
      params.sku = filters.sku;
    }

    if (filters.isActive !== undefined) {
      clauses.push('isActive = @isActive');
      params.isActive = filters.isActive ? 1 : 0;
    }

    if (filters.minPrice !== undefined) {
      clauses.push('price >= @minPrice');
      params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      clauses.push('price <= @maxPrice');
      params.maxPrice = filters.maxPrice;
    }

    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const query = db.prepare(`SELECT * FROM products ${whereClause} ORDER BY id ASC`);

    const rows = query.all(params) as Record<string, unknown>[];
    return rows.map(normalizeProduct);
  },

  findById(id: number): Product | undefined {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? normalizeProduct(row) : undefined;
  },

  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: Date }): Product {
    const insert = db.prepare(`
      INSERT INTO products (name, description, price, stock, sku, isActive, createdAt, updatedAt)
      VALUES (@name, @description, @price, @stock, @sku, @isActive, @createdAt, @updatedAt)
    `);

    const result = insert.run({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      sku: data.sku,
      isActive: data.isActive ? 1 : 0,
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: null,
    });

    const created = this.findById(Number(result.lastInsertRowid));

    if (!created) {
      throw new Error('Failed to create product.');
    }

    return created;
  },

  updateById(id: number, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | undefined {
    const existingProduct = this.findById(id);
    if (!existingProduct) {
      return undefined;
    }

    const nextProduct = {
      ...existingProduct,
      ...data,
      isActive: data.isActive ?? existingProduct.isActive,
      updatedAt: new Date(),
    };

    const update = db.prepare(`
      UPDATE products
      SET name = @name,
          description = @description,
          price = @price,
          stock = @stock,
          sku = @sku,
          isActive = @isActive,
          updatedAt = @updatedAt
      WHERE id = @id
    `);

    update.run({
      id,
      name: nextProduct.name,
      description: nextProduct.description,
      price: nextProduct.price,
      stock: nextProduct.stock,
      sku: nextProduct.sku,
      isActive: nextProduct.isActive ? 1 : 0,
      updatedAt: nextProduct.updatedAt ? nextProduct.updatedAt.toISOString() : null,
    });

    return this.findById(id);
  },

  deleteById(id: number): boolean {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
