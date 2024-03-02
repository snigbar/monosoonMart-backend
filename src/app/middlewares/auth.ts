import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { TUser } from '../modules/users/user.interface';
import catchAsync from '../utils/catchAsyncRequest';
import AppError from '../Errors/AppError';
import httpStatus from 'http-status';
import config from '../configs/config';
import UserModel from '../modules/users/user.model';

export const auth = (...roles: TUser['role'][]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.auth_token as string;
    // validating if role is available
    if (!token) {
      throw new AppError('you are not authorized', httpStatus.UNAUTHORIZED);
    }
    const decoded = jwt.verify(token, config.jwt_auth_token) as JwtPayload;
    const { role, _id, iat } = decoded;
    // find the use
    const user = await UserModel.findById(_id);
    // if no user
    if (!user) {
      throw new AppError('you are not authorized', httpStatus.UNAUTHORIZED);
    }

    // if user deleted
    if (user.isDeleted) {
      throw new AppError('you are unauthorized', httpStatus.UNAUTHORIZED);
    }
    // checking the roles
    if (roles && !roles.includes(role)) {
      throw new AppError('you are unauthorized', httpStatus.UNAUTHORIZED);
    }
    // checking if password changed after jwt token issued
    if (
      user.passwordChangedAt &&
      (await UserModel.isJwtIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat,
      ))
    ) {
      throw new AppError('you are unauthorized', httpStatus.UNAUTHORIZED);
    }
    // add user to request
    req.user = decoded as JwtPayload;
    next();
  });
};
