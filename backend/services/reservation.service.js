import db from '../configs/db.js';

async function createReservationIfAvailable({branch_id, cus_name, phone_number, guests_number, arrival_time, arrival_date, notes}) {
    const query = `
        CALL CreateReservationIfAvailable(?, ?, ?, ?, ?, ?, ?, @p_reservation_slip_id, @p_table_number);
    `;
    await db.query(query, [branch_id, cus_name, phone_number, guests_number, arrival_time, arrival_date, notes]);

    const [outParams] = await db.query(
        'SELECT @p_reservation_slip_id AS reservation_slip_id, @p_table_number AS table_number;'
    );
    return outParams[0];
}

async function CancelReservation(reservation_id) {
    const query = `
        CALL UpdateStatusReservation(?, 'canceled');
    `;
    await db.query(query, [reservation_id]);
}

async function createReviewForReservation({reservation_slip_id, service_rating, location_rating, food_rating, price_rating, ambiance_rating}) {
    const query = `
        CALL CreateReviewForReservation(?, ?, ?, ?, ?, ?);
    `;
    await db.query(query, [reservation_slip_id, service_rating, location_rating, food_rating, price_rating, ambiance_rating]);
}

export { createReservationIfAvailable, CancelReservation, createReviewForReservation };