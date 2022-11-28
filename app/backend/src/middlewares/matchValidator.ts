import { NextFunction, Request, Response } from 'express';
import { UnprocessableEntity } from '../@types/errors';

function matchValidator(req: Request, _res: Response, next: NextFunction) {
  const { homeTeam, awayTeam } = req.body;

  if (homeTeam === awayTeam) {
    throw new UnprocessableEntity('It is not possible to create a match with two equal teams');
  }

  next();
}

export default matchValidator;
