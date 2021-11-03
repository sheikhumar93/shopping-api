import client from '../database';

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password_digest: string;
};

export class OrderStore {
  async index(): Promise<User[]> {
    try {
      const sql = 'SELECT * FROM users';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users.\n{err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot retrieve user with id: ${id}.\n${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      // do not insert the password digest directly
      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.password_digest
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create order ${u}.\n${err}`);
    }
  }
}
