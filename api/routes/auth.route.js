import express from 'express';
import { google, Signin, signout, Signup } from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/signup',Signup);
router.post('/signin',Signin);
router.post('/google',google)
router.get('/signout',signout)

export default router;