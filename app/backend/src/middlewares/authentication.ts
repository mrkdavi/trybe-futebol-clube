import { NextFunction, Response } from 'express';
import { UserRequest } from '../@types/middleware/UserRequest';
import { Unauthorized } from '../@types/errors';

import { verifyToken } from '../utils/token';

function authentication(req: UserRequest, _res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Unauthorized('Token not found');
  }

  try {
    const user = verifyToken(authorization);
    req.user = user;
  } catch (e) {
    throw new Unauthorized('Expired or invalid token');
  }

  next();
}

export default authentication;
