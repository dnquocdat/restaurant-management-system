import { Router } from 'express';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

import { createMemberCard, updateMemberCard } from '../controllers/card.controller.js';

const router = Router();

// Create Member Card endpoint with middleware
router.post('/:branchId', verifyToken, asyncErrorHandler(createMemberCard));

// Update Member Card endpoint with middleware
router.patch('/:cardId', verifyToken, asyncErrorHandler(updateMemberCard));

export default router;