import { Schema } from 'mongoose';
import { Model } from 'mongoose';

export type TUser = {
  _id?: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  role: 'user' | 'seller' | 'admin';
  isDeleted: boolean;
  isVerified: boolean;
  passwordChangedAt?: Date;
};

export interface TUserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExistsById(id: string): Promise<TUser | null>;
  // eslint-disable-next-line no-unused-vars
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  // eslint-disable-next-line no-unused-vars
  isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;

  isJwtIssuedBeforePasswordChange(
    // eslint-disable-next-line no-unused-vars
    passwordChangeAt: Date,
    // eslint-disable-next-line no-unused-vars
    jwtTimeStamp: number,
  ): Promise<boolean>;
}
