import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsyncRequest';
import handleResponse from '../../utils/handleResponse';
import userServices from './user.services';

// user Registration
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUserInDB(
    req.body,
    req.file?.path as string,
  );

  handleResponse(res, {
    statusCode: 201,
    success: true,
    message: 'account created',
    data: result,
  });
});

// get me
const getMe = catchAsync(async (req: Request, res: Response) => {
  const { _id, role } = req.user;
  const result = await userServices.getUserFromDB(_id, role);

  handleResponse(res, {
    statusCode: 201,
    success: true,
    message: 'user found',
    data: result,
  });
});

const userControllers = {
  createUser,
  getMe,
};

export default userControllers;
