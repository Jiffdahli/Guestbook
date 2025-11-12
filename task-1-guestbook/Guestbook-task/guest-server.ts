import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

// start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server ===> http://localhost:${PORT}`);
});

// middleware
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  // simple request logger
  // eslint-disable-next-line no-console
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});



