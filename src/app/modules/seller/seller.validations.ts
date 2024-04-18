import * as z from 'zod';
import { divisions } from './seller.constants';

const sellerFromDataSchema = z.object({
  shopName: z
    .string()
    .min(5, 'At least 5 characters')
    .max(20, 'Maximum 20 characters')
    .regex(/^[^0-9]*$/, 'Should not contain any number'),
  phoneNumber: z
    .string()
    .length(11, 'enter 11 digit phone number')
    .regex(/^01\d{9}$/),
  description: z
    .string()
    .min(150, 'Minimum 150 characters')
    .max(500, 'maximum 500 characters'),
  productCategories: z
    .array(z.string({ description: 'select categories for your products' }), {
      required_error: 'Please select categories related to your products',
      invalid_type_error: 'Select at least one category',
    })
    .min(1, 'Please select categories related to your products'),
  returnPolicy: z.enum(['maximum 30 days return policy', 'no return policy'], {
    required_error: 'Please select a return policy',
    invalid_type_error: 'Select a return policy',
  }),
  country: z
    .string({ required_error: 'country is required' })
    .regex(/^[^0-9]*$/, 'Should not contain any number'),
  division: z
    .string({ required_error: 'division is required' })
    .regex(/^[^0-9]*$/, 'Should not contain any number')
    .refine((val) => divisions.includes(val), {
      message: 'Please select a division',
    }),
  city: z
    .string({ required_error: 'city is required' })
    .min(1, 'Please Select a city')
    .regex(/^[^0-9]*$/, 'Should not contain any number'),
  upazilla: z
    .string({ required_error: 'updazilla is required' })
    .min(1, 'Please Select a city')
    .regex(/^[^0-9]*$/, 'Should not contain any number'),
  postCode: z
    .string({ required_error: 'postcode is required' })
    .min(1, 'Please Enter a 4 digit postcode')
    .regex(/^\d{4}$/, 'Enter a valid 4 digit postcode'),
  address: z
    .string({ required_error: 'Address is required' })
    .min(1, 'Address is required')
    .max(250, 'Address is too long')
    .refine((val) => val.length >= 20, 'Address is too short'),
  accountTitle: z
    .string({ required_error: 'Account Title is required' })
    .min(5, 'Minimum 5 characters')
    .max(30, 'maximum 30 characters'),
  accountNumber: z
    .string({ required_error: 'account number is required' })
    .regex(/^[0-9]{9,18}$/, 'Enter a valid account number'),
  bankName: z
    .string({ required_error: 'bank name is required' })
    .refine((val) => val.length > 0, 'Please select a bank name'),
  bankDistrict: z
    .string({ required_error: 'bank name is required' })
    .refine((val) => val.length > 0, 'Please select a district name'),
  branchName: z
    .string({ required_error: 'bank name is required' })
    .refine((val) => val.length > 0, 'Please select a Branch'),
  accountType: z
    .enum(['checking account', 'saving account'], {
      required_error: 'Please select an account type',
    })
    .refine((val) => val.length > 0, 'please select an account type'),
  termsAndConditionsAgreement: z.literal(true),
});

const sellerFormValidationSchema = z.object({
  body: sellerFromDataSchema,
});
export type TSellerFormData = z.infer<typeof sellerFromDataSchema>;
export default sellerFormValidationSchema;
