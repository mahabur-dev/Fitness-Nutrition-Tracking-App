import express from 'express';
import { registerUser, loginUser, verifyOtp, resendOtp, getAllUsers } from '../Controllers/authController.js';
import { registerSchema, loginSchema } from '../Validators/authValidators.js';
import { validateRequest }  from '../Middleware/validateRequest.js';
import auth from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/verify-email', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', validateRequest(loginSchema), loginUser);
router.get('/all', auth, getAllUsers);

export default router;