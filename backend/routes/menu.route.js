import { Router } from 'express';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { searchMenu } from '../controllers/menu.controller.js';

const router = Router();

// Search Menu endpoint with middleware
router.get('/:branchId', verifyToken, asyncErrorHandler(searchMenu));

export default router;