import { Request, Response, Router } from 'express';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import AuthController from '../controller/AuthController';
import validateLogin from '../middlewares/loginValidator';
import tokenValidator from '../middlewares/tokenValidator';

const router = Router();

router.post(
  '/login',
  validateLogin,
  errorHandlerWrapper((req: Request, res: Response) => AuthController.login(req, res)),
);

router.get(
  '/login/validate',
  tokenValidator,
  errorHandlerWrapper((req: Request, res: Response) => AuthController.validateToken(req, res)),
);

export default router;
