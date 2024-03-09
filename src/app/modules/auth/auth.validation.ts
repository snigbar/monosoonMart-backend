import z from 'zod';

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, 'password should be at least 8 characters maximum 20 characters')
      .max(
        20,
        'password should be at least 8 characters maximum 20 characters',
      ),
  }),
});

export const activationValidationSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

export const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'invalid email' }),
  }),
});

export const resetPasswordValidationSchema = z.object({
  body: z.object({
    payload: z.object({
      id: z.string(),
      password: z.string(),
    }),
    token: z.string(),
  }),
});
