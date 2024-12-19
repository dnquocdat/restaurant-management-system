import db from '../configs/db.js';

async function checkReservationExists(reservation_id) {
    const reservationCheckSql = 'CALL check_reservation_exists(?)';
    const [reservationRows] = await db.query(reservationCheckSql, [reservation_id]);
    if (reservationRows[0].length === 0) {
        throw new CustomError("BAD_REQUEST", "Reservation does not exist", STATUS_CODE.BAD_REQUEST);
    }
}

async function checkBranchExists(branch_id) {
    const branchCheckSql = 'CALL check_branch_exists(?)';
    const [branchRows] = await db.query(branchCheckSql, [branch_id]);
    if (branchRows[0].length === 0) {
        throw new CustomError("BAD_REQUEST", "Branch does not exist", STATUS_CODE.BAD_REQUEST);
    }
}

export { checkReservationExists, checkBranchExists };