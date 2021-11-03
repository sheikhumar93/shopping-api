import client from '../database';

export type Category = {
  id?: number;
  name: string;
};

export class CategoryStore {
  async index(): Promise<Category[]> {
    try {
      const sql = 'SELECT * FROM categories';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get categories. Error \n${err}`);
    }
  }

  async show(id: number): Promise<Category> {
    try {
      const sql = 'SELECT * FROM categories WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot retrieve category ${id}. Error: \n${err}`);
    }
  }

  async create(c: Category): Promise<Category> {
    try {
      const sql = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [c.name]);
      conn.release();
      const category = result.rows[0];
      return category;
    } catch (err) {
      throw new Error(`Could not add new category ${c.name}. Error: \n${err}`);
    }
  }

  async delete(id: number): Promise<Category> {
    try {
      const sql = 'DELETE FROM categories WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      const category = result.rows[0];
      return category;
    } catch (err) {
      throw new Error(`Could not delete category ${id}. Error: \n${err}`);
    }
  }
}
