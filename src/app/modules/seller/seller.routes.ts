import express from 'express';
import zodValidationHandler from '../../middlewares/zodValidationHandler';
import sellerFormValidationSchema from './seller.validations';
import becomeSellerControllers from './seller.controllers';
import { auth } from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/become-seller',
  zodValidationHandler(sellerFormValidationSchema),
  auth('user'),
  becomeSellerControllers.becomeSeller,
);

router.get(
  '/get-seller',
  auth('user', 'admin', 'seller'),
  becomeSellerControllers.getSellerWithUserId,
);

export const becomeSellerRoutes = router;
