import { Router } from "express";
const router = Router();

import { 
    submitOnline,
    submitDineIn
} from '../controllers/order.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/submit-online/:branchId', verifyToken, asyncErrorHandler(submitOnline));
router.post('/submit-dine-in/:reservationSlipId', verifyToken, asyncErrorHandler(submitDineIn));

export default router;