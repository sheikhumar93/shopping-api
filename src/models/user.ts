import client from '../database';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserStore {
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
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS!)
      );
      const result = await conn.query(sql, [u.first_name, u.last_name, hash]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create user ${u}.\n${err}`);
    }
  }

  async authenticate(
    firstName: string,
    password: string
  ): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE first_name=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [firstName]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (
        bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)
      ) {
        return user;
      }
    }
    return null;
  }
}
