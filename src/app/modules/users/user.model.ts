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
      select: false,
      required: [true, 'password is required'],
    },
    profileImage: {
      type: String,
      required: [true, 'profileImage is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'seller'], // Define the allowed values as numbers
      default: 'user',
      required: true,
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
    passwordChangedAt: Date,
    verificationToken: String,
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
// userSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

userSchema.statics.isUserExistsById = async function (id: string) {
  return await UserModel.findOne({ _id: id });
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await UserModel.findOne({ email }).select('+password');
};
// match password
userSchema.statics.isPasswordMatched = async function (
  password,
  hashedPassword,
) {
  return await bcrypt.compare(password, hashedPassword);
};

// check password change time
userSchema.statics.isJwtIssuedBeforePasswordChange = function (
  passwordChangedAt,
  jwtIssueTimeStamp,
) {
  const passwordChangeTime = new Date(passwordChangedAt).getTime() / 1000;
  return passwordChangeTime > jwtIssueTimeStamp;
};

const UserModel = mongoose.model<TUser, TUserModel>('Users', userSchema);
export default UserModel;
