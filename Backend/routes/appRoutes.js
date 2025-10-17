import express from 'express';
import userRouter from './userRoutes.js';

const routes = express.Router();


//Authentication routes
routes.use('/users', userRouter);


export default routes;