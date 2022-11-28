import { Express } from 'express';
import authRouter from './authRouter';
import teamRouter from './teamRouter';
import matchesRouter from './matchesRouter';

export default function createRoutes(app: Express) {
  app.use('/', authRouter);
  app.use('/teams', teamRouter);
  app.use('/matches', matchesRouter);
}
