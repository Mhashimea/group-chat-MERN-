/**
 * Custom error class for API errors. When the error is thrown
 * with this class, the error handler will return the error in json format
 * otherwise internal server error will be returned to the client.
 *
 * @class ApiError
 * @extends {Error}
 * @param {number} statusCode
 */
export default class ApiError extends Error {
  /**
   * The HTTP status code of the error.
   */
  statusCode: number | null = null;
  /**
   * Whether the error is operational or not.
   */
  isOperational = false;

  constructor(
    statusCode = 500,
    message: string,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
