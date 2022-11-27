import { Router } from 'express';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import AuthController from '../controller/AuthController';
import validateLogin from '../middlewares/loginValidator';
import tokenValidator from '../middlewares/tokenValidator';

const router = Router();

router.post(
  '/login',
  validateLogin,
  errorHandlerWrapper(AuthController.login),
);

router.get(
  '/login/validate',
  tokenValidator,
  errorHandlerWrapper(AuthController.validateToken),
);

export default router;
