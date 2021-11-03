import express, { Request, Response } from 'express';
import { Category, CategoryStore } from '../models/category';

const store = new CategoryStore();

const index = async (req: Request, res: Response) => {
  const categories = await store.index();
  res.json(categories);
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const category = await store.show(id);
  if (category === undefined) {
    res.json(`No category with id: ${id}`);
  }
  res.json(category);
};

const create = async (req: Request, res: Response) => {
  try {
    const category: Category = {
      name: req.body.name
    };
    const newCategory = await store.create(category);
    res.json(newCategory);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const deleted = await store.delete(id);
  if (deleted === undefined) {
    res.json(`No category to delete with id: ${id}`);
  }
  res.json(deleted);
};

const category_routes = (app: express.Application) => {
  app.get('/categories', index);
  app.get('/categories/:id', show);
  app.post('/categories', create);
  app.delete('/categories/:id', destroy);
};

export default category_routes;
