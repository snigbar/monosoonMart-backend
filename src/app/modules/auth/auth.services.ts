import { createToken } from './../../utils/generateToken';
import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import UserModel from '../users/user.model';
import config from '../../configs/config';
import sendEmail from '../../utils/sendEmail';
import { verifyToken } from '../../utils/verifyToken';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

type loginCredential = {
  email: string;
  password: string;
};

// login
const loginUser = async (payload: loginCredential) => {
  const user = await UserModel.isUserExistsByEmail(payload.email);
  // user exists
  if (!user) {
    throw new AppError("User doesn't exist", httpStatus.NOT_FOUND);
  }
  // if user deleted
  if (user.isDeleted) {
    throw new AppError("User doesn't exist", httpStatus.NOT_FOUND);
  }
  //  if password matched
  const matchPassword = await UserModel.isPasswordMatched(
    payload.password,
    user.password as string,
  );

  if (!matchPassword) {
    throw new AppError('invalid credentials', httpStatus.UNAUTHORIZED);
  }

  user.password = '';

  // send auth token
  if (!user?.isVerified) {
    return {
      user,
    };
  }

  const tokenData = {
    _id: user._id,
    role: user.role,
    isVerified: user.isVerified,
  };

  const authToken = createToken(tokenData, config.jwt_auth_token, '2d');
  const loggedUser = await UserModel.findByIdAndUpdate(user._id, {
    $unset: { verificationToken: '' },
  });

  return { loggedUser, authToken };
};

// get reactivation token
const getReactivaionToken = async (_id: string) => {
  const toActivateUser = await UserModel.findOne({ _id });
  if (!toActivateUser) {
    throw new AppError('Unauthorized: No user Found', httpStatus.UNAUTHORIZED);
  }

  // cheking if the use already verified
  if (toActivateUser.isVerified) {
    throw new AppError('user is already verified', httpStatus.BAD_REQUEST);
  }
  //   send email with activation token
  if (toActivateUser._id && toActivateUser.email) {
    const activationToken = createToken(
      { _id: toActivateUser._id, email: toActivateUser.email },
      config.jwt_activate_token,
      '10min',
    );

    try {
      // link
      const activationLink = `${config.client_URL}/activate/${activationToken}/${toActivateUser._id}`;
      //   html code
      const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">Welcome to MonSoonMart!</h2>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">Thank you for signing up! To activate your account, please click the button below:</p>
        <div style="text-align: center;">
          <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Activate Account</a>
        </div>
        <p style="font-size: 14px; color: redOrange; text-align: center; margin-top: 20px;">This activation link will be valid for 10 minutes.</p>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 10px;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="font-size: 14px; color: #777; text-align: center;"><a href="${activationLink}" style="color: #007bff; text-decoration: none;">${activationLink}</a></p>
      </div>
    </div>
        `;
      // send email
      await sendEmail(
        'Monsoon Mart: Activate Your Account',
        'Click on the link to activate your account',
        toActivateUser.email,
        html,
      );

      return true;
    } catch (error) {
      throw new AppError('failed to send activation email', 500);
    }
  } else {
    throw new AppError('failed to create user', 500);
  }
};

// verify account
const verifyUser = async (token: string, id: string) => {
  // decode
  const data = verifyToken(token, config.jwt_activate_token);

  if (!data) {
    throw new AppError(
      'Failed to decode token or token expired',
      httpStatus.UNAUTHORIZED,
    );
  }

  const { _id } = data;

  if (_id !== id) {
    throw new AppError(
      'You are not authorized to verify this user',
      httpStatus.UNAUTHORIZED,
    );
  }

  const newUser = await UserModel.findByIdAndUpdate(
    _id,
    { isVerified: true, $unset: { verificationToken: '' } },
    { new: true },
  );

  if (!newUser) {
    throw new AppError('Failed to verify user', httpStatus.NOT_FOUND);
  }

  const tokenData = {
    _id: newUser._id,
    role: newUser.role,
    isVerified: newUser.isVerified,
  };
  const authToken = createToken(tokenData, config.jwt_auth_token, '2d');
  return { newUser, authToken };
};

const forgotPasswordLink = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user || user?.isDeleted) {
    throw new AppError('No user Found', httpStatus.BAD_REQUEST);
  }
  // create token and send email
  try {
    const tokenData = {
      _id: user._id,
      role: user.role,
      isVerified: user.isVerified,
    };

    const forgotPasswordToken = createToken(
      tokenData,
      config.jwt_forgotpass_token,
      '10m',
    );

    const passwordResetLink = `${config.client_URL}/reset-pass/${forgotPasswordToken}/${user._id}`;

    const htmlMsg = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">Welcome to MonSoonMart!</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">Thank you for using MoonsoonMart! To reset your password, please click the button below:</p>
          <div style="text-align: center;">
              <a href="${passwordResetLink}" style="display: inline-block; padding: 10px 20px; background-color: #ff5555; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #ff5555; text-align: center; margin-top: 20px;">This password reset link will be valid for 10 minutes.</p>
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 10px;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="font-size: 14px; color: #777; text-align: center;"><a href="${passwordResetLink}" style="color: #ff5555; text-decoration: none;">${passwordResetLink}</a></p>
      </div>
  </div>`;

    await sendEmail(
      'Reset Your Password',
      'Click on the link to reset Your password',
      user.email,
      htmlMsg,
    );

    return true;
  } catch (error) {
    throw new AppError(
      'failed to create reset password link',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  return true;
};

const resetPassword = async (
  payload: { id: string; password: string },
  token: string,
) => {
  const decoded: JwtPayload = verifyToken(token, config.jwt_forgotpass_token);
  if (!decoded) {
    throw new AppError("you're not authorized", httpStatus.BAD_REQUEST);
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    +config.salt_rounds,
  );

  const user = await UserModel.findByIdAndUpdate(
    payload.id,
    { password: hashedPassword, passwordChangedAt: new Date().toISOString() },
    { new: true },
  );

  if (!user) {
    throw new AppError('unauthorised: not user found', httpStatus.NOT_FOUND);
  }

  return true;
};

const authServices = {
  getReactivaionToken,
  verifyUser,
  loginUser,
  forgotPasswordLink,
  resetPassword,
};

export default authServices;
