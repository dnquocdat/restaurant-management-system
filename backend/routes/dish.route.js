import { Router } from "express";
const router = Router();

import { 
    submitReview,
    addDishtoMenu,
    submitDish,
    // deleteDish
    removeDishFromMenuController,
    updateDish
} from '../controllers/dish.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/:dishId/review', verifyToken, asyncErrorHandler(submitReview));
router.post('/', verifyToken, asyncErrorHandler(submitDish));
router.post('/:dishId/branch/:branchId', verifyToken, asyncErrorHandler(addDishtoMenu));
// router.delete('/:dishId', verifyToken, asyncErrorHandler(deleteDish));
router.delete('/:dishId/branch/:branchId', verifyToken, asyncErrorHandler(removeDishFromMenuController));

// Update Dish endpoint with middleware
router.patch('/:dishId', verifyToken, asyncErrorHandler(updateDish));

export default router;