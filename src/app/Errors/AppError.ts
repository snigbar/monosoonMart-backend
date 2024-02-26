class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
