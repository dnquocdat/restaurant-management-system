import { Router } from 'express';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

import { updateUser, updateUserPassword } from '../controllers/user.controller.js';

const router = Router();

// Update User Information endpoint with middleware
router.patch('/', verifyToken, asyncErrorHandler(updateUser));

// Update User Password endpoint with middleware
router.patch('/update_password', verifyToken, asyncErrorHandler(updateUserPassword));

export default router;