import { Model } from 'mongoose';

export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  role: 'user' | 'seller' | 'admin';
  isDeleted: boolean;
  isVerified: boolean;
};

export interface TUserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExistsById(id: string): Promise<TUser | null>;
  // eslint-disable-next-line no-unused-vars
  isUserExistsByEmail(email: string): Promise<TUser | null>;
}
