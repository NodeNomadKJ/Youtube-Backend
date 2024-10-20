const asyncHandler = (handlerFunction) => {
  return async (req, res, next) => {
    try {
      await handlerFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export { asyncHandler };
