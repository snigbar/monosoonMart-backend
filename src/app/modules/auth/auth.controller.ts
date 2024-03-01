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

const authControllers = {
  reActivationRequest,
};

export default authControllers;
