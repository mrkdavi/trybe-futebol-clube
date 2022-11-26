import { Express } from 'express';
import authRouter from './authRouter';

export default function createRoutes(app: Express) {
  app.use('/', authRouter);
}
