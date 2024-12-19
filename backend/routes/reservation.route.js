import { Router } from "express";
const router = Router();

import { 
    submitReservation
} from '../controllers/reservation.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/:branchId', verifyToken, asyncErrorHandler(submitReservation));

export default router;