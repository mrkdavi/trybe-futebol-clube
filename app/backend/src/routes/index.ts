import { Express } from 'express';
import authRouter from './authRouter';
import teamRouter from './teamRouter';

export default function createRoutes(app: Express) {
  app.use('/', authRouter);
  app.use('/teams', teamRouter);
}
