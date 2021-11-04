import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const user = await store.show(id);
  if (user === undefined) {
    res.json(`Cannot find user with id: ${id}`);
  }
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName as string;
    const lastName = req.body.lastName as string;
    const password = req.body.password as string;
    // encrypt password here
    const passwordDigest = password;
    const user: User = {
      firstName,
      lastName,
      passwordDigest
    };
    const newUser = await store.create(user);
    res.json(newUser);
  } catch (err) {
    res.json(err);
  }
};

const user_routes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
};

export default user_routes;
