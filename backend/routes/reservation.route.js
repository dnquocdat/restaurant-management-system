import { Router } from "express";
const router = Router();

import { 
    submitReservation,
    deleteReservation
} from '../controllers/reservation.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/:branchId', verifyToken, asyncErrorHandler(submitReservation));
router.delete('/:reservationId', verifyToken, asyncErrorHandler(deleteReservation));

export default router;