import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  sales?: number;
  category_id: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products';
      const conn = await client.connect();
      const products = await conn.query(sql);
      conn.release();
      return products.rows;
    } catch (err) {
      throw new Error(`Cannot retrieve products. Error: \n${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await client.connect();
      const product = await conn.query(sql, [id]);
      conn.release();
      return product.rows[0];
    } catch (err) {
      throw new Error(`Cannot retrieve product. Error: \n${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const product = await conn.query(sql, [p.name, p.price, p.category_id]);
      conn.release();
      return product.rows[0];
    } catch (err) {
      throw new Error(`Cannot create product\n${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const conn = await client.connect();
      const product = await conn.query(sql, [id]);
      conn.release();
      return product.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete product. Error: \n${err}`);
    }
  }
}
