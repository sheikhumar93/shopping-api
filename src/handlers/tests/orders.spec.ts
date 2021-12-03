import supertest from 'supertest';
import app from '../../server';
import client from '../../database';

const request = supertest(app);

describe('Orders endpoints', () => {
  let token = '';

  it('POST, create /orders', async () => {
    const user = {
      firstName: 'John',
      lastName: 'Wick',
      password: 'dontkillmydogordie!'
    };
    const userReq = await request.post('/users').send(user);
    token = userReq.body.access_token;
    const order = {
      userId: 1
    };
    await request
      .post('/orders')
      .set('Authorization', 'Bearer ' + token)
      .send(order)
      .expect(200, {
        id: 1,
        user_id: 1,
        order_complete: false
      });
  });

  it('POST, addProduct /orders/:id/items', async () => {
    const category = {
      name: 'Phones'
    };
    await request.post('/categories').send(category);
    const product = {
      categoryId: 1,
      name: 'iPhone 13',
      price: 700
    };
    await request
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(product);
    const item = {
      productId: 1,
      quantity: 2
    };
    await request
      .post('/orders/1/items')
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(200, {
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 2,
        price: 1400
      });
  });

  it('GET, show /orders/:userId', async () => {
    await request
      .get('/orders/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('GET, itemsInOrder /orders/:id/items', async () => {
    await request
      .get('/orders/1/items')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, [
        {
          id: 1,
          order_id: 1,
          product_id: 1,
          quantity: 2,
          price: 1400
        }
      ]);
  });

  it('PATCH, completeOrder /orders/:id', async () => {
    await request
      .patch('/orders/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, { id: 1, user_id: 1, order_complete: true });
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
