import express from 'express';
import authControllers from './auth.controller';
const router = express.Router();

router.post('/reactivate', authControllers.reActivationRequest);

export const authRoutes = router;
