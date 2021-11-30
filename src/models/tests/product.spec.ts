import { Product, ProductStore } from '../product';
import { Category, CategoryStore } from '../category';

const store = new ProductStore();

describe('Product Model', () => {
  it('should have a index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a product', async () => {
    const category: Category = {
      name: 'Phones'
    };
    const categoryStore = new CategoryStore();
    await categoryStore.create(category);
    const product: Product = {
      name: 'iPhone 13 Pro',
      price: 699,
      category_id: 1
    };
    const result = await store.create(product);
    expect(result).toEqual({
      id: 1,
      name: 'iPhone 13 Pro',
      price: 699,
      category_id: 1,
      sales: 0
    });
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: 'iPhone 13 Pro',
        price: 699,
        category_id: 1,
        sales: 0
      }
    ]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      name: 'iPhone 13 Pro',
      price: 699,
      category_id: 1,
      sales: 0
    });
  });

  it('delete method should remove the product', async () => {
    store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
