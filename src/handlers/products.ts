import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from './users';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const product = await store.show(id);
  if (product === undefined) {
    res.json(`Cannot find product with id: ${id}`);
  }
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name as string;
    const price = parseInt(req.body.price as string);
    const categoryId = parseInt(req.body.categoryId as string);
    const product: Product = {
      name,
      price,
      category_id: categoryId
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    console.log(`2che ${err}`);
    res.json(err);
  }
};

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
};

export default product_routes;
