import { Router } from "express";
const router = Router();

import { 
    submitReview,
    addDishtoMenu,
    submitDish
} from '../controllers/dish.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/:dishId/review', verifyToken, asyncErrorHandler(submitReview));
router.post('/', verifyToken, asyncErrorHandler(submitDish));
router.post('/:dishId/branch/:branchId', verifyToken, asyncErrorHandler(addDishtoMenu));

export default router;