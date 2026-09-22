import express from 'express';
import type { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/products.controllers.js';
import { requireSession } from '../middleware/auth.middleware.js';
import { validateCreateProduct, validateProductQuery, validateUpdateProduct } from '../middleware/products.middleware.js';
import { validateNumericId } from '../middleware/pets.middleware.js';

export const productRouter: Router = express.Router();

productRouter.use(requireSession);
productRouter.get('/', validateProductQuery, getProducts);
productRouter.post('/', validateCreateProduct, createProduct);
productRouter.put('/:id', [validateNumericId, validateUpdateProduct], updateProduct);
productRouter.delete('/:id', [validateNumericId], deleteProduct);
productRouter.get('/:id', [validateNumericId], getProductById);
