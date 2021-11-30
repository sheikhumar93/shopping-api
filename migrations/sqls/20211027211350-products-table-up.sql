CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    sales INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id)
);