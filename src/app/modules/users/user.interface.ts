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
  isUserExists(id: string): Promise<TUser | null>;
}
