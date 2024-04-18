import { Types } from 'mongoose';

export interface TSellerForm {
  userId: Types.ObjectId;
  shopName: string;
  phoneNumber: string;
  description?: string;
  productCategories: string[];
  returnPolicy: 'maximum 30 days return policy' | 'no return policy';
  country: string;
  division: string;
  city: string;
  upazilla: string;
  postCode: string;
  address: string;
  accountTitle: string;
  accountNumber: string;
  bankName: string;
  bankDistrict: string;
  branchName: string;
  accountType: 'checking account' | 'saving account';
  approved?: boolean;
  termsAndConditionsAgreement: boolean;
}
