import { NextFunction, Request, Response } from 'express';
import AppError from '../Errors/AppError';

export default function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars , no-unused-vars
  next: NextFunction,
) {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';

  // wrong mongodb id error
  if (err.name === 'CastError') {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    err = new AppError(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new AppError(message, 400);
  }

  // wrong jwt error
  if (err.name === 'JsonWebTokenError') {
    const message = `Your url is invalid please try again letter`;
    err = new AppError(message, 400);
  }

  // jwt expired
  if (err.name === 'TokenExpiredError') {
    const message = `Your Url is expired please try again letter!`;
    err = new AppError(message, 400);
  }

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    error: err,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
}
