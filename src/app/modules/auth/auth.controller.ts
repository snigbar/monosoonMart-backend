import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsyncRequest';
import handleResponse from '../../utils/handleResponse';
import authServices from './auth.services';

const reActivationRequest = catchAsync(async (req: Request, res: Response) => {
  const id: string = req.body?.id;

  await authServices.getReactivaionToken(id);

  handleResponse(res, {
    statusCode: 200,
    success: true,
    data: {},
    message: 'Check your email to activate your account',
  });
});

const verifyAccount = catchAsync(async (req: Request, res: Response) => {
  const { id, token } = req.body;
  const result = await authServices.verifyUser(token, id);

  handleResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
    message: 'Your account has been verified',
  });
});

const authControllers = {
  reActivationRequest,
  verifyAccount,
};

export default authControllers;
