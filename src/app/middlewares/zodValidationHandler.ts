import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsyncRequest';
import { NextFunction, Request, Response } from 'express';

const zodValidationHandler = (validationSchema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await validationSchema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    next();
  });
};

export default zodValidationHandler;
