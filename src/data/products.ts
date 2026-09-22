export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

export const seedProducts: Product[] = [
  {
    id: 1,
    name: 'Classic Tee',
    description: 'A soft cotton t-shirt for everyday wear.',
    price: 24.99,
    stock: 32,
    sku: 'TEE-CLASSIC-001',
    isActive: true,
    createdAt: new Date('2024-01-15T08:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Coffee Mug',
    description: 'Ceramic mug with a durable finish and comfortable handle.',
    price: 14.5,
    stock: 18,
    sku: 'MUG-COFFEE-002',
    isActive: true,
    createdAt: new Date('2024-02-04T12:30:00.000Z'),
  },
  {
    id: 3,
    name: 'Notebook Pro',
    description: 'A premium lined notebook suitable for planning and notes.',
    price: 19.99,
    stock: 9,
    sku: 'NOTEBOOK-PRO-003',
    isActive: false,
    createdAt: new Date('2024-03-22T09:00:00.000Z'),
  },
];
