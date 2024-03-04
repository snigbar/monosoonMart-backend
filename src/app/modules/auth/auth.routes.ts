import express from 'express';
import authControllers from './auth.controller';
import zodValidationHandler from '../../middlewares/zodValidationHandler';
import {
  activationValidationSchema,
  loginValidationSchema,
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

// logout route
router.post('/logout');

export const authRoutes = router;
