import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { User, UserStore } from '../models/user';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await store.show(id);
  if (user === undefined) {
    res.json(`Cannot find user with id: ${id}`);
  }
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const firstName = req.body.firstName as string;
    const lastName = req.body.lastName as string;
    const password = req.body.password as string;
    const user: User = {
      first_name: firstName,
      last_name: lastName,
      password
    };
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, process.env.BCRYPT_PASSWORD!);
    res.json({ access_token: token });
  } catch (err) {
    res.status(400).json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName as string;
    const password = req.body.password as string;
    const u = await store.authenticate(firstName, password);
    const token = jwt.sign({ user: u }, process.env.BCRYPT_PASSWORD!);
    res.json({ access_token: token });
  } catch (err) {
    res.status(401).json({ err });
  }
};

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader!.split(' ')[1];
    // eslint-disable-next-line no-unused-vars
    const _ = jwt.verify(token, process.env.BCRYPT_PASSWORD!) as JwtPayload;
    next();
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index); // available for admin users only
  app.get('/users/:id', verifyAuthToken, show);
  app.post(
    '/users',
    body('firstName').isString(),
    body('lastName').isString(),
    body('password').isString().isLength({ min: 4 }),
    create
  );
  app.post('/users/authenticate', authenticate);
};

export default userRoutes;
