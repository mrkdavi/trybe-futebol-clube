import BaseError from './BaseError';

export default class BadRequest extends BaseError {
  constructor(msg = 'Bad Request') {
    super(msg);
    this.statusCode = 400;
  }
}
