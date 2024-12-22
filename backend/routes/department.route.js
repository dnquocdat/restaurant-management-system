import { Router } from 'express';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

import { addDepartment } from '../controllers/department.controller.js';

const router = Router();

// Create Department endpoint with middleware
router.post('/', verifyToken, asyncErrorHandler(addDepartment));

// ...existing code...

export default router;