import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsyncRequest';
import handleResponse from '../../utils/handleResponse';
import authServices from './auth.services';
import config from '../../configs/config';
import httpStatus from 'http-status';

// login
const login = catchAsync(async (req: Request, res: Response) => {
  const { loggedUser, authToken } = await authServices.loginUser(req.body);

  if (loggedUser && !loggedUser.isVerified) {
    handleResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: {
        _id: loggedUser._id,
        isVerified: loggedUser.isVerified,
        verificationToken: loggedUser.verificationToken,
      },
      message: 'your account is not verified',
    });

    return;
  }

  // send auth cookie
  res.cookie('auth_token', authToken, {
    httpOnly: true,
    secure: config.app_enviroment === 'production',
    maxAge: 2 * 86400000,
  });

  handleResponse(res, {
    statusCode: 200,
    success: true,
    data: loggedUser,
    message: 'login successful',
  });
});

const reActivationRequest = catchAsync(async (req: Request, res: Response) => {
  const id: string = req.body?.id;

  const result = await authServices.getReactivaionToken(id);

  handleResponse(res, {
    statusCode: 200,
    success: result,
    message: 'Check your email to activate your account',
  });
});

const verifyAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;
  const token = req.headers?.authorization;

  const { newUser, authToken } = await authServices.verifyUser(token, id);

  res.cookie('auth_token', authToken, {
    httpOnly: true,
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
// get forgot password request
const forgotPasswordRequest = catchAsync(
  async (req: Request, res: Response) => {
    const email: string = req.body?.email;

    const result = await authServices.forgotPasswordLink(email);

    handleResponse(res, {
      statusCode: 200,
      success: result,
      message: 'Check your email to activate your account',
    });
  },
);

// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { payload, token } = req.body;

  const result = await authServices.resetPassword(payload, token);

  res.cookie('auth_token', '', { expires: new Date(0) });

  handleResponse(res, {
    statusCode: 200,
    success: result,
    message: 'password has been changed',
  });
});

// logout
const logOut = catchAsync(async (req: Request, res: Response) => {
  // set null cookie
  res.cookie('auth_token', '', { expires: new Date(0) });

  handleResponse(res, {
    statusCode: 200,
    success: true,
    message: 'user logged out',
  });
});

const authControllers = {
  reActivationRequest,
  verifyAccount,
  login,
  logOut,
  forgotPasswordRequest,
  resetPassword,
};

export default authControllers;
