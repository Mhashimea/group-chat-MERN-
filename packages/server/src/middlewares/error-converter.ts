import httpStatus from "http-status";
import ApiError from "./api-error";

/**
 * Converts all error to an ApiError instance.
 * This conversion is needed to make sure that
 * the error handler middleware can handle all
 * errors in the same way and send the error messages based
 * on the environment.
 */
export function errorConverter(err: any, req: any, res: any, next: any) {
  let error = err;

  // If the type is not ApiError, convert it.
  if (!(error instanceof ApiError)) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    // Use error code description is not message passed on error
    // or the error object itself is an empty object
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  return res.status(err.statusCode).json({ message: err.message });
}
