import { NextFunction, Response, Request } from 'express';
import { Unauthorized } from '../@types/errors';

function tokenValidator(req: Request, _res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Unauthorized('Token not found');
  }

  next();
}

export default tokenValidator;
