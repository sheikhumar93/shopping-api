CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    quantity INTEGER DEFAULT 0,
    price INTEGER DEFAULT 0
);