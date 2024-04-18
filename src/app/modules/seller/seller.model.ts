import mongoose, { Schema } from 'mongoose';
import { TSellerForm } from './seller.interface';

const sellerFormSchema = new mongoose.Schema<TSellerForm>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    unique: true,
  },
  shopName: { type: String, required: true, minlength: 5, maxlength: 20 },
  phoneNumber: { type: String, required: true, minlength: 11, maxlength: 11 },
  description: { type: String, minlength: 150, maxlength: 500 },
  productCategories: {
    type: [String],
    required: true,
    validate: {
      validator: (arr: string[]) => arr.length > 0,
      message: 'Please select categories related to your products',
    },
  },
  returnPolicy: {
    type: String,
    enum: ['maximum 30 days return policy', 'no return policy'],
    required: true,
  },
  country: { type: String, required: true },
  division: {
    type: String,
    required: true,
  },
  city: { type: String, required: true },
  upazilla: { type: String, required: true },
  postCode: { type: String, required: true, minlength: 4, maxlength: 4 },
  address: { type: String, required: true, minlength: 20, maxlength: 250 },
  accountTitle: { type: String, required: true, minlength: 5, maxlength: 30 },
  accountNumber: {
    type: String,
    required: true,
    validate: {
      validator: (val: string) => /^\d{9,18}$/.test(val),
      message: 'Enter a valid account number',
    },
  },
  bankName: { type: String, required: true },
  bankDistrict: { type: String, required: true },
  branchName: { type: String, required: true },
  accountType: {
    type: String,
    enum: ['checking account', 'saving account'],
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  termsAndConditionsAgreement: { type: Boolean, required: true },
});

const SellerFormModel = mongoose.model<TSellerForm>(
  'SellerForm',
  sellerFormSchema,
);

export default SellerFormModel;
