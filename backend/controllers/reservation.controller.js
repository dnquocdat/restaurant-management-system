import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import db from '../configs/db.js';

// import { createUserInDb } from '../services/auth.service.js';
import {
    createReservationIfAvailable,
    CancelReservation,
    createReviewForReservation
} from '../services/reservation.service.js';

import {
    checkReservationExists,
    checkBranchExists
} from '../services/check.service.js';

export const submitReservation = async (req, res) => {
    const { cus_name, phone_number, guests_number, arrival_time, arrival_date, notes } = req.body;
    const branch_id = parseInt(req.params.branchId, 10);

    // Check branch exists
    await checkBranchExists(branch_id);

    const reservation = await createReservationIfAvailable({
        branch_id,
        cus_name,
        phone_number,
        guests_number,
        arrival_time,
        arrival_date,
        notes
    });

    if(reservation.table_number == -1) {
        throw new CustomError("BAD_REQUEST", "No available table in this time frame", STATUS_CODE.BAD_REQUEST);
    }

    const data = {
        reservation_id: reservation.reservation_slip_id,
        table_number: reservation.table_number,
        cus_name,
        phone_number,
        guests_number,
        arrival_time,
        arrival_date,
        notes
    };

    return formatResponse(res, "Success", "Reservation submitted successfully", STATUS_CODE.CREATED, data);
};

export const deleteReservation = async (req, res) => {
    const reservation_slip_id = req.params.reservationSlipId;

    // Check reservation exists
    await checkReservationExists(reservation_slip_id);

    await CancelReservation(reservation_slip_id);

    return formatResponse(res, "Success", "Reservation deleted successfully", STATUS_CODE.SUCCESS, {});
}

export const submitReview = async (req, res) => {
    const reservation_slip_id = req.params.reservationSlipId;
    const { service_rating, location_rating, food_rating, price_rating, ambiance_rating } = req.body;

    await checkReservationExists(reservation_slip_id);

    await createReviewForReservation({
        reservation_slip_id,
        service_rating,
        location_rating,
        food_rating,
        price_rating,
        ambiance_rating
    });

    const data = {
        reservation_slip_id,
        service_rating,
        location_rating,
        food_rating,
        price_rating,
        ambiance_rating
    };

    return formatResponse(res, "Success", "Review submitted successfully", STATUS_CODE.CREATED, data);
}
