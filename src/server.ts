import express, { Request, Response } from 'express';

import categoryRoutes from './handlers/categories';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

// Changed to express.json since bodyParser is deprecated
app.use(express.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

categoryRoutes(app);
productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
