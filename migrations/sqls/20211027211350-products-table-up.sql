CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price integer NOT NULL,
    sales integer DEFAULT 0,
    category_id bigint REFERENCES categories(id)
);  