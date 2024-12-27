import { Router } from "express";
const router = Router();

import { 
    submitOnline,
    submitDineIn,
    updateOrderStatus,
    searchOrdersByUserController 
} from '../controllers/order.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/submit-online/:branchId', verifyToken, asyncErrorHandler(submitOnline));
router.post('/submit-dine-in/:reservationSlipId', verifyToken, asyncErrorHandler(submitDineIn));

// Update Order Status endpoint with middleware
router.patch('/:orderId', verifyToken, asyncErrorHandler(updateOrderStatus));

// Search Orders by User endpoint with middleware
router.get('/search', verifyToken, asyncErrorHandler(searchOrdersByUserController));

export default router;