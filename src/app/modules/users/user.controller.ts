import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsyncRequest';
import handleResponse from '../../utils/handleResponse';
import userServices from './user.services';

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

const userControllers = {
  createUser,
};

export default userControllers;
