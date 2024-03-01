import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsyncRequest';
import handleResponse from '../../utils/handleResponse';
import authServices from './auth.services';
import config from '../../configs/config';

// login
const login = catchAsync(async (req: Request, res: Response) => {
  const { user, authToken } = await authServices.loginUser(req.body);

  if (!user.isVerified) {
    handleResponse(res, {
      statusCode: 200,
      success: true,
      data: {
        _id: user._id,
        isVerified: user.isVerified,
      },
      message: 'your account is not verified',
    });

    return;
  }

  // send auth cookie
  res.cookie('auth_token', authToken, {
    httpOnly: config.app_enviroment === 'production',
    secure: config.app_enviroment === 'production',
    maxAge: 2 * 86400000,
  });

  handleResponse(res, {
    statusCode: 200,
    success: true,
    data: user,
    message: 'login successful',
  });
});

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
  const { id } = req.body;
  const token = req.headers?.authorization;
  const { newUser, authToken } = await authServices.verifyUser(token, id);

  // send auth cookie
  res.cookie('auth_token', authToken, {
    httpOnly: config.app_enviroment === 'production',
    secure: config.app_enviroment === 'production',
    maxAge: 2 * 86400000,
  });

  handleResponse(res, {
    statusCode: 200,
    success: true,
    data: newUser,
    message: 'Your account has been verified',
  });
});

const authControllers = {
  reActivationRequest,
  verifyAccount,
  login,
};

export default authControllers;
