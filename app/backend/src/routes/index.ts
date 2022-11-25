import { Express } from 'express';
import authRouter from './auth';

export default function createRoutes(app: Express) {
  app.use('/', authRouter);
}
