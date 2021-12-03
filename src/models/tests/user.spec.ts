import { User, UserStore } from '../user';

const store = new UserStore();

describe('User Model', () => {
  it('should have a index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a user', async () => {
    const user: User = {
      first_name: 'John',
      last_name: 'Wick',
      password: 'dontkillmydogordie!'
    };
    const result = await store.create(user);
    expect(result.id).toEqual(1);
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toEqual(1);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(1);
    expect(result.id).toEqual(1);
  });
});
