import { Model } from 'mongoose';

export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface TUserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TUser | null>;
}
