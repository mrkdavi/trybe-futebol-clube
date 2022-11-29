import { Express } from 'express';
import authRouter from './authRouter';
import teamRouter from './teamRouter';
import matchesRouter from './matchesRouter';
import leaderboardRouter from './leaderboardRouter';

export default function createRoutes(app: Express) {
  app.use('/', authRouter);
  app.use('/teams', teamRouter);
  app.use('/matches', matchesRouter);
  app.use('/leaderboard', leaderboardRouter);
}
