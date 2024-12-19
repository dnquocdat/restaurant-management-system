import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import db from '../configs/db.js';

// import { createUserInDb } from '../services/auth.service.js';
import {
    createOrderInDb,
    getRandomEmployeeIdByDepartment,
} from '../services/order.service.js';


import {
    checkBranchExists,
    checkReservationExists
} from '../services/check.service.js';


export const submitOnline = async (req, res) => {
    const branch_id = parseInt(req.params.branchId, 10);
    const { cus_name, phone_number, address, notes, listDish } = req.body;
    
    // Validate required fields
    if (!cus_name || !phone_number || !address || !listDish) {
        throw new CustomError("BAD_REQUEST", "Please fill in all fields", STATUS_CODE.BAD_REQUEST);
    }

    // Check if branch exists
    await checkBranchExists(branch_id);

    const employee_id = await getRandomEmployeeIdByDepartment('Shipping', branch_id);

    const order = await createOrderInDb({
        branch_id: branch_id,
        user_id: req.user.user_id, 
        cus_name: cus_name,
        reservation_slip_id: null, 
        order_type: 'delivery', 
        status: 'in_delivery',
        dishes: listDish,
        delivery_address: address,
        delivery_phone: phone_number,
        shipper: employee_id,
        delivery_notes: notes,
        member_card_id: null
    });

    const data = {
        order_id: order.order_id,
        user_id: req.user.user_id,
        branch_id: branch_id,
        created_at: order.order_created_at,
        status: 'in_delivery',
        delivery_id: order.delivery_id,
        shipper: employee_id,
        address: address,
        notes: notes,
    };
    

    return formatResponse(res, "Success", "Order submitted successfully", STATUS_CODE.CREATED, data);
};


export const submitDineIn = async (req, res) => {
    const reservation_slip_id = parseInt(req.params.reservationSlipId, 10);
    const { cus_name, member_card_id, branch_id, waiter, listDish} = req.body;

    // Validate required fields
    if (!cus_name || !branch_id || !listDish || !waiter) {
        throw new CustomError("BAD_REQUEST", "Please fill in all fields", STATUS_CODE.BAD_REQUEST);
    }

    // Check if reservation exists
    await checkReservationExists(reservation_slip_id); 

    // Check if user is the waiter of this reservation
    if (waiter != req.user.user_id) {
        throw new CustomError("UNAUTHORIZED", "You are not the waiter of this reservation", STATUS_CODE.UNAUTHORIZED);
    }

    const order = await createOrderInDb({
        branch_id: branch_id,
        user_id: null,
        cus_name: cus_name,
        reservation_slip_id: reservation_slip_id,
        order_type: 'dine-in',
        status: 'billed',
        dishes: listDish,
        delivery_address: null,
        delivery_phone: null,
        shipper: null,
        delivery_notes: null,
        member_card_id: member_card_id
    });

    const data = {
        order_id: order.order_id,
        branch_id: branch_id,
        member_card_id: member_card_id,
        reservation_slip_id: reservation_slip_id,
        created_at: order.order_created_at
    };

    return formatResponse(res, "Success", "Dine-in order submitted successfully", STATUS_CODE.CREATED, data);
};