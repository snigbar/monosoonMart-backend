import express from 'express';
import authControllers from './auth.controller';
import zodValidationHandler from '../../middlewares/zodValidationHandler';
import {
  activationValidationSchema,
  forgotPasswordValidationSchema,
  loginValidationSchema,
  resetPasswordValidationSchema,
} from './auth.validation';
const router = express.Router();

// login
router.post(
  '/login',
  zodValidationHandler(loginValidationSchema),
  authControllers.login,
);

// reactivate request
router.post(
  '/reactivate',
  zodValidationHandler(activationValidationSchema),
  authControllers.reActivationRequest,
);
// activate acoount and verify
router.post(
  '/verify-account',
  zodValidationHandler(activationValidationSchema),
  authControllers.verifyAccount,
);

// forgot password request
router.post(
  '/forgot-password',
  zodValidationHandler(forgotPasswordValidationSchema),
  authControllers.forgotPasswordRequest,
);

// reset password
router.post(
  '/reset-password',
  zodValidationHandler(resetPasswordValidationSchema),
  authControllers.resetPassword,
);

// logout route
router.post('/logout', authControllers.logOut);

export const authRoutes = router;
