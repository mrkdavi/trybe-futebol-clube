import { Router } from 'express';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import MatchesController from '../controller/MatchesController';
import authentication from '../middlewares/authentication';
import matchValidator from '../middlewares/matchValidator';

const router = Router();

router.get(
  '/',
  errorHandlerWrapper(MatchesController.getAllMatches),
);

router.post(
  '/',
  authentication,
  matchValidator,
  errorHandlerWrapper(MatchesController.createMatch),
);

// router.get(
//   '/:id',
//   errorHandlerWrapper(MatchesController.getMatchById),
// );

router.patch(
  '/:id',
  errorHandlerWrapper(MatchesController.updateGoals),
);

router.patch(
  '/:id/finish',
  errorHandlerWrapper(MatchesController.finishMatch),
);

export default router;
