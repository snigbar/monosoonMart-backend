import AppError from '../../Errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
// later uncomment it
import config from '../../configs/config';
import { createToken } from '../../utils/generateToken';
import sendEmail from '../../utils/sendEmail';
import { TUser } from './user.interface';
import UserModel from './user.model';
import { TUserType } from './user.constants';

// create user
const createUserInDB = async function name(user: TUser, path: string) {
  // validate if user exists
  const findUser = await UserModel.isUserExistsByEmail(user.email);
  if (findUser && findUser.email) {
    // delete the iamge
    deleteFile(path);
    throw new AppError('user already exists', 403);
  }

  //   add profile picurl
  user.profileImage = path;
  // result
  const result = await UserModel.create(user);

  if (result && result._id && result.email) {
    const activationToken = createToken(
      { _id: result._id, email: result.email },
      config.jwt_activate_token,
      '10min',
    );
    try {
      const activationLink = `${config.client_URL}/activate/${activationToken}/${result._id}`;
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
      await sendEmail(
        'Monsoon Mart: Activate Your Account',
        'Click in the link to activate your account',
        result.email,
        html,
      );
    } catch (error) {
      throw new AppError('failed to send activation email', 500);
    }
  } else {
    deleteFile(path);
    throw new AppError('failed to create user', 500);
  }

  return result;
};

// getUserFromDB
const getUserFromDB = async (_id: string, role: TUserType) => {
  return await UserModel.findOne({ _id, role });
};

export default {
  createUserInDB,
  getUserFromDB,
};
