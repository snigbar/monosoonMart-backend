import express from 'express';
import zodValidationHandler from '../../middlewares/zodValidationHandler';
import userValidationSchema from './user.validation';
import { upload } from '../../middlewares/handleImageUploads';
import userControllers from './user.controller';
const router = express.Router();

router.post(
  '/create-user',
  upload.single('profileImage'),
  zodValidationHandler(userValidationSchema),
  userControllers.createUser,
);

export const userRoutes = router;
