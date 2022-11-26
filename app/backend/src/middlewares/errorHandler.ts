import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Express,
} from 'express';
import BaseError from '../@types/errors/BaseError';

export const createErrorHandler = (app: Express) => {
  app.use((err: BaseError, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof BaseError) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    }
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  });
};

export const errorHandlerWrapper = (fnHandler: RequestHandler) => (
  (req: Request, res: Response, next: NextFunction) => (
    Promise.resolve(fnHandler(req, res, next)).catch((e) => next(e))
  )
);
