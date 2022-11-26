export default class BaseError extends Error {
  statusCode: number;

  constructor(msg = '') {
    super(msg);
    this.statusCode = 400;
  }
}
