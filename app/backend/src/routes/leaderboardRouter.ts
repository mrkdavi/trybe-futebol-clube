import { Router } from 'express';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import LeaderboardController from '../controller/LeaderboardController';

const router = Router();

router.get(
  '/',
  errorHandlerWrapper(LeaderboardController.getLeaderboardGeneral),
);

router.get(
  '/home',
  errorHandlerWrapper(LeaderboardController.getLeaderboardHome),
);

router.get(
  '/away',
  errorHandlerWrapper(LeaderboardController.getLeaderboardAway),
);

export default router;
