import express, { Request, Response } from 'express';
import { Order, OrderItem, OrderStore } from '../models/order';
import { verifyAuthToken } from './users';

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.userId);
  try {
    const userOrder = await store.show(userId);
    res.json(userOrder);
  } catch (err) {
    res.status(400).json(`Cannot show order for orderId: ${userId}.\n${err}`);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.body.userId);
    const order: Order = {
      user_id: userId
    };
    const orderCreated = await store.create(order);
    res.json(orderCreated);
  } catch (err) {
    res.status(400).json(`Could not create order.\n${err}`);
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id);
    const productId: number = parseInt(req.body.productId);
    const quantity: number = parseInt(req.body.quantity);
    const orderItem: OrderItem = {
      order_id: orderId,
      product_id: productId,
      quantity
    };
    const addedItem = await store.addItemToOrder(orderItem);
    res.json(addedItem);
  } catch (err) {
    res.status(400).json(`Could not add item to order.\n${err}`);
  }
};

const itemsInOrder = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id);
    const orderItems: OrderItem[] = await store.itemsForOrderId(orderId);
    res.json(orderItems);
  } catch (err) {
    res.status(400).json(`Cannot retrieve items.\n${err}`);
  }
};

const completeOrder = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.id);
    const order = await store.completeOrder(orderId);
    res.json(order);
  } catch (err) {
    res.status(400).json(`${err}`);
  }
};

const checkOrderStatus = async (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const orderId: number = parseInt(req.params.id);
    const orderComplete = await store.checkOrderStatus(orderId);
    if (orderComplete) {
      return res.status(400).json(`Order is already complete`);
    } else {
      next();
    }
  } catch (err) {
    throw new Error(`${err}`);
  }
};

const orderRoutes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/items', verifyAuthToken, checkOrderStatus, addProduct);
  app.get('/orders/:userId', verifyAuthToken, show);
  app.get('/orders/:id/items', verifyAuthToken, itemsInOrder);
  app.patch('/orders/:id', verifyAuthToken, checkOrderStatus, completeOrder);
};

export default orderRoutes;
