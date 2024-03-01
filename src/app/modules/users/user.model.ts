import { TUser, TUserModel } from './user.interface';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../configs/config';

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
    profileImage: {
      type: String,
      required: [true, 'profileImage is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

// pre save middleware/
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(user.password, Number(config.salt_rounds));
  next();
});

// post save middleware / hook
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsById = async function (id: string) {
  return await UserModel.findOne({ _id: id }).select('-password');
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await UserModel.findOne({ email }).select('-password');
};

const UserModel = mongoose.model<TUser, TUserModel>('Users', userSchema);
export default UserModel;
