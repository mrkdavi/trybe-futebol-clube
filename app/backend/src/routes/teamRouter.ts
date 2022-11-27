import { Router } from 'express';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import TeamController from '../controller/TeamController';

const router = Router();

router.get(
  '/',
  errorHandlerWrapper(TeamController.getAllTeams),
);
router.get(
  '/:id',
  errorHandlerWrapper(TeamController.getTeamById),
);

export default router;
