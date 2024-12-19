import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import db from '../configs/db.js';

// import { createUserInDb } from '../services/auth.service.js';
import {
    createReservationIfAvailable,
    CancelReservation
} from '../services/reservation.service.js';

export const submitReservation = async (req, res) => {
    const { cus_name, phone_number, guests_number, arrival_time, arrival_date, notes } = req.body;
    const branch_id = parseInt(req.params.branchId, 10);

    // Check branch exists
    const branchCheckSql = 'SELECT branch_id FROM branches WHERE branch_id = ? LIMIT 1';
    const [branchRows] = await db.query(branchCheckSql, [branch_id]);
    if (branchRows.length === 0) {
        throw new CustomError("BAD_REQUEST", "Branch does not exist", STATUS_CODE.BAD_REQUEST);
    }

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
    const reservation_id = req.params.reservationId;

    // Check reservation exists
    const reservationCheckSql = 'SELECT reservation_slip_id FROM reservation_slips WHERE reservation_id = ? LIMIT 1';
    const [reservationRows] = await db.query(reservationCheckSql, [reservation_id]);
    if (reservationRows.length === 0) {
        throw new CustomError("BAD_REQUEST", "Reservation does not exist", STATUS_CODE.BAD_REQUEST);
    }

    await CancelReservation(reservation_id);

    return formatResponse(res, "Success", "Reservation deleted successfully", STATUS_CODE.OK, {});
}
