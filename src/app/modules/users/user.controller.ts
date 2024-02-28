import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsyncRequest';
import handleResponse from '../../utils/handleResponse';

const createUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.file);
  handleResponse(res, {
    statusCode: 201,
    success: true,
    message: 'user creationg successful',
    data: {},
  });
});

const userControllers = {
  createUser,
};

export default userControllers;
