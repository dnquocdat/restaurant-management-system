import { Router } from "express";
const router = Router();

import { 
    submitOnline
} from '../controllers/order.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/submit-online/:branchId', verifyToken, asyncErrorHandler(submitOnline));

export default router;