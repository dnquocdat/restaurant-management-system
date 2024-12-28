import { Router } from "express";
const router = Router();

import { 
    submitReview,
    addDishtoMenu,
    submitDish,
    GetCategories,
    removeDishFromMenuController,
    updateDish,
    searchDishesController,
    getDishDetail
} from '../controllers/dish.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/:dishId/review',verifyToken , asyncErrorHandler(submitReview));
router.post('/', verifyToken, asyncErrorHandler(submitDish));
router.post('/:dishId/branch/:branchId', verifyToken, asyncErrorHandler(addDishtoMenu));
// router.delete('/:dishId', verifyToken, asyncErrorHandler(deleteDish));
router.delete(
  "/:dishId/branch/:branchId",
  verifyToken,
  asyncErrorHandler(removeDishFromMenuController)
);

// Update Dish endpoint with middleware
router.patch("/:dishId", verifyToken, asyncErrorHandler(updateDish));

// Add Search Dishes endpoint with middleware
router.get('/search', verifyToken, asyncErrorHandler(searchDishesController));

router.get("/", verifyToken, asyncErrorHandler(GetCategories));

router.get('/:dishId', asyncErrorHandler(getDishDetail));
// Định nghĩa route GET /categories
export default router;
