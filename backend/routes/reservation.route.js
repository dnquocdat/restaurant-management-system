import { Router } from "express";
const router = Router();

import { 
    submitReservation,
    deleteReservation,
    submitReview,
    updateReservation
} from '../controllers/reservation.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

router.post('/:branchId', verifyToken, asyncErrorHandler(submitReservation));
router.delete('/:reservationSlipId', verifyToken, asyncErrorHandler(deleteReservation));
router.post('/:reservationSlipId/review', verifyToken, asyncErrorHandler(submitReview));
router.patch('/:reservationSlipId', verifyToken, asyncErrorHandler(updateReservation));

export default router;