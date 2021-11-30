import { Order, OrderItem, OrderStore } from '../order';
import { Product, ProductStore } from '../product';
import { Category, CategoryStore } from '../category';
import { User, UserStore } from '../user';
import client from '../../database';

const categoryStore = new CategoryStore();
const productStore = new ProductStore();
const userStore = new UserStore();
const store = new OrderStore();

describe('Order Model', () => {
  it('should have a index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add an empty order', async () => {
    const user: User = {
      first_name: 'John',
      last_name: 'Wick',
      password: 'dontkillmydogordie!'
    };

    await userStore.create(user);
    const order: Order = {
      user_id: 1,
      order_complete: false
    };
    const result = await store.create(order);
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      order_complete: false
    });
  });

  it('add items to order', async () => {
    const category: Category = {
      name: 'Phones'
    };
    await categoryStore.create(category);
    const product: Product = {
      name: 'iPhone 13 Pro',
      price: 699,
      category_id: 1
    };
    await productStore.create(product);
    const order: Order = {
      user_id: 1,
      order_complete: false
    };
    await store.create(order);
    const orderItem: OrderItem = {
      order_id: 1,
      product_id: 1,
      quantity: 2
    };
    const result = await store.addItemToOrder(orderItem);
    expect(result).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 2,
      price: 1398
    });
  });

  it('retrieve all items in an order', async () => {
    const results = await store.itemsForOrderId(1);
    expect(results[0]).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 2,
      price: 1398
    });
  });

  afterAll(async () => {
    const tableNames = [
      'order_items',
      'orders',
      'products',
      'categories',
      'users'
    ];
    const conn = await client.connect();
    for (let i = 0; i < tableNames.length; i++) {
      const sql = `DELETE FROM ${tableNames[i]}`;
      await conn.query(sql);
      const alterSql = `ALTER SEQUENCE ${tableNames[i]}_id_seq RESTART WITH 1`;
      await conn.query(alterSql);
    }
    conn.release();
  });
});
