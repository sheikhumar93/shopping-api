import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  order_complete: boolean;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders.\n{err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot retrieve order with id: ${id}.\n${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      // when order is created order_complete can never be true
      // so make it a column with a default value of false
      // and do not insert value in this function over here
      const sql =
        'INSERT INTO orders (user_id, order_complete) VALUES ($1, $2) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [o.user_id, o.order_complete]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create order ${o}.\n${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete order with id: ${id}.\n${err}`);
    }
  }
}
