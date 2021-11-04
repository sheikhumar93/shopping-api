import express, { Request, Response } from 'express';
import category_routes from './handlers/categories';
import product_routes from './handlers/products';
import user_routes from './handlers/users';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

// Changed to express.json since bodyParser is deprecated
app.use(express.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

category_routes(app);
product_routes(app);
user_routes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
