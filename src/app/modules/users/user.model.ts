import { TUser, TUserModel } from './user.interface';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<TUser, TUserModel>(
  {
    firstName: {
      type: String,
      min: 3,
      max: 10,
      required: [true, 'first name is required'],
    },
    lastName: {
      type: String,
      min: 3,
      max: 10,
      required: [true, 'lastName is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required'],
    },
    password: {
      type: String,
      min: 8,
      max: 20,
      required: [true, 'password is required'],
    },
  },
  { timestamps: true },
);

userSchema.statics.isUserExists = async function (id: string) {
  return await UserModel.findOne({ _id: id }).select('+password');
};
const UserModel = mongoose.model<TUser, TUserModel>('Users', userSchema);
export default UserModel;
