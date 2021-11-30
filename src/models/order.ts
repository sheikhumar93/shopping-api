import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  order_complete: boolean;
};

export type OrderItem = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price?: number;
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
      const sql =
        'INSERT INTO orders (user_id, order_complete) VALUES ($1, $2) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [o.user_id, false]);
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

  async itemsForOrderId(orderId: number): Promise<OrderItem[]> {
    try {
      const sql = 'SELECT * FROM order_items WHERE order_id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [orderId]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot retrieve items for orderId: ${orderId}\n${err}`);
    }
  }

  async addItemToOrder(oI: OrderItem): Promise<OrderItem> {
    try {
      const conn = await client.connect();
      const priceSql = 'SELECT price FROM products WHERE id=($1)';
      const priceResult = await conn.query(priceSql, [oI.product_id]);
      const price = priceResult.rows[0].price * oI.quantity;
      const sql =
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        oI.order_id,
        oI.product_id,
        oI.quantity,
        price
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add item for orderId: ${oI.order_id}\n${err}`);
    }
  }
}
