import express from 'express';
const routes = express.Router();
import { register, login, logout } from '../Controllers/authController.js';
import { registerSchema, loginSchema } from '../Validators/authValidators.js';
import { validateRequest } from '../Middleware/validateRequest.js';


//Authentication routes
routes.post('/register', validateRequest(registerSchema), register);
routes.post('/login', validateRequest(loginSchema), login);
routes.post('/logout', logout);


export default routes;