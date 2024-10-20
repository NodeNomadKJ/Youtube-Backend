import ApiError from "../utils/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  // If the error is an instance of ApiError, use the statusCode, message, and other properties
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: res.statusCode,
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // If it's not an ApiError, respond with a generic 500 error
  return res.status(500).json({
    success: false,
    statusCode: res.statusCode,
    message: "An unexpected error occurred. Please see the logs.",
    errors: err.errors,
    data: null,
  });
};

export default errorMiddleware;
