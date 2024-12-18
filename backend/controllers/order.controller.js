import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/errors.js';
import * as dotenv from 'dotenv';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import db from '../configs/db.js';

// import { createUserInDb } from '../services/auth.service.js';
import {
    createOrderInDb,
    getRandomEmployeeIdByDepartment,
} from '../services/order.service.js';



export const submitOnline = async (req, res) => {
    const branch_id = parseInt(req.params.branchId, 10);
    const { cus_name, phone_number, address, notes, listDish } = req.body;
    
    // Validate required fields
    if (!cus_name || !phone_number || !address || !listDish) {
        throw new CustomError("BAD_REQUEST", "Please fill in all fields", STATUS_CODE.BAD_REQUEST);
    }

    // Check if branch exists
    const branchCheckSql = 'SELECT branch_id FROM branches WHERE branch_id = ? LIMIT 1';
    const [branchRows] = await db.query(branchCheckSql, [branch_id]);
    if (branchRows.length === 0) {
        throw new CustomError("BAD_REQUEST", "Branch does not exist", STATUS_CODE.BAD_REQUEST);
    }

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
