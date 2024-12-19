import { Router } from "express";
const router = Router();

import { 
    submitReview
} from '../controllers/dish.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/:dishId/review', verifyToken, asyncErrorHandler(submitReview));

export default router;