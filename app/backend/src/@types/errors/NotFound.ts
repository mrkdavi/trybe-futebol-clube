import BaseError from './BaseError';

export default class NotFound extends BaseError {
  constructor(msg = 'Not Found') {
    super(msg);
    this.statusCode = 404;
  }
}
