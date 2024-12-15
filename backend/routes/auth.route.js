import { Router } from "express";
const router = Router();

import { test, registerUser } from '../controllers/auth.controller.js';

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.get('/test', asyncErrorHandler(test));
router.post('/register', asyncErrorHandler(registerUser));

export default router;