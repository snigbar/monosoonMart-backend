import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(3, 'name should be at least 3 characters maximum 10 characters')
      .max(10, 'name should be at least 3 characters maximum 10 characters'),
    lastName: z
      .string()
      .min(3, 'name should be at least 3 characters maximum 10 characters')
      .max(10, 'name should be at least 3 characters maximum 10 characters'),
    email: z.string().email({ message: 'should be a valid email' }),
    password: z
      .string()
      .min(8, 'password should be at least 8 characters maximum 20 characters')
      .max(
        20,
        'password should be at least 8 characters maximum 20 characters',
      ),
  }),
});

export default userValidationSchema;
