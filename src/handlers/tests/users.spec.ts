import supertest from 'supertest';

import app from '../../server';

const request = supertest(app);

describe('Users endpoints', () => {
  let token = '';

  it('POST, create /users', async () => {
    const user = {
      firstName: 'John',
      lastName: 'Wick',
      password: 'dontkillmydogordie!'
    };
    await request.post('/users').send(user).expect(200);
  });

  it('POST, authenticate /users/authenticate', async () => {
    await request
      .post('/users/authenticate')
      .send({ firstName: 'John', password: 'dontkillmydogordie!' })
      .expect(200)
      .then((response) => {
        token = response.body.access_token;
      });
  });

  it('GET, index /users', async () => {
    await request
      .get('/users')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(1);
      });
  });

  it('GET, show /users/:id', async () => {
    await request
      .get('/users/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });
});
