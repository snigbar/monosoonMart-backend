import express from 'express';
import zodValidationHandler from '../../middlewares/zodValidationHandler';
import userValidationSchema from './user.validation';
import { upload } from '../../middlewares/handleImageUploads';
import userControllers from './user.controller';
import { auth } from '../../middlewares/auth';
import { User_Role } from './user.constants';

const router = express.Router();

router.post(
  '/create-user',
  upload.single('profileImage'),
  zodValidationHandler(userValidationSchema),
  userControllers.createUser,
);

// get me
router.get(
  '/me',
  auth(User_Role.admin, User_Role.seller, User_Role.user),
  userControllers.getMe,
);

export const userRoutes = router;
