import type { NextFunction, Request, Response } from 'express';
import type { Product } from '../data/products.js';
import { AppError } from '../middleware/error-handler.js';
import { productRepository } from '../repositories/products.repository.js';
import type { CreateProductInput, UpdateProductInput } from '../validators/products.validator.js';

export type ProductQueryParams = {
  name?: string;
  sku?: string;
  isActive?: 'true' | 'false';
  minPrice?: string;
  maxPrice?: string;
};

export const getProducts = (req: Request<{}, unknown, {}, ProductQueryParams>, res: Response<Product[]>, next: NextFunction): void => {
  try {
    const { name, sku, isActive, minPrice, maxPrice } = req.query;

    const products = productRepository.findAll({
      name,
      sku,
      isActive: isActive === undefined ? undefined : isActive === 'true',
      minPrice: minPrice === undefined ? undefined : Number(minPrice),
      maxPrice: maxPrice === undefined ? undefined : Number(maxPrice),
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = (req: Request<{ id: string }>, res: Response<Product | { message: string }>, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const product = productRepository.findById(Number(id));

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = (req: Request<{}, unknown, CreateProductInput>, res: Response<Product | { message: string }>, next: NextFunction): void => {
  try {
    const createdProduct = productRepository.create(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    next(new AppError(500, 'Failed to create product.'));
  }
};

export const updateProduct = (req: Request<{ id: string }, unknown, UpdateProductInput>, res: Response<Product | { message: string }>, next: NextFunction): void => {
  try {
    const updatedProduct = productRepository.updateById(Number(req.params.id), req.body);

    if (!updatedProduct) {
      throw new AppError(404, 'Product not found');
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = (req: Request<{ id: string }>, res: Response<{ message: string }>, next: NextFunction): void => {
  try {
    const deleted = productRepository.deleteById(Number(req.params.id));

    if (!deleted) {
      throw new AppError(404, 'Product not found');
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
