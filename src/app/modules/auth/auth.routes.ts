import express from 'express';
import authControllers from './auth.controller';
const router = express.Router();

// reactivate request
router.post('/reactivate', authControllers.reActivationRequest);
// activate acoount and verify
router.post('/verify-account', authControllers.verifyAccount);

export const authRoutes = router;
