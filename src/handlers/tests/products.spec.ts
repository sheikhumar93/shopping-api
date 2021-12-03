import supertest from 'supertest';

import { Category } from '../../models/category';
import app from '../../server';
import client from '../../database';

const request = supertest(app);

describe('Products endpoints', () => {
  it('POST, create /products', async () => {
    const category: Category = {
      name: 'Phones'
    };
    await request.post('/categories').send(category);
    const authenticate = await request
      .post('/users/authenticate')
      .send({ firstName: 'John', password: 'dontkillmydogordie!' });
    const token = authenticate.body.access_token;
    const product = {
      categoryId: 1,
      name: 'iPhone 13',
      price: 700
    };
    await request
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(product)
      .expect(200);
  });

  it('GET, index /products', async () => {
    await request
      .get('/products')
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(1);
      });
  });

  it('GET, show /products/:id', async () => {
    await request.get('/products/1').expect(200);
  });

  afterAll(async () => {
    const tableNames = ['products', 'users'];
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
