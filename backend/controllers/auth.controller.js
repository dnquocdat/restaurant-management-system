import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/errors.js';
import * as dotenv from 'dotenv';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import db from '../configs/db.js';

import { createUserInDb } from '../services/auth.service.js';


dotenv.config();

export function test(req, res) {
    throw new CustomError('TEST_ERROR', 'This is a test error', 400, {"mother fucker": "test"});
}


export const registerUser = async (req, res) => {
    const { user_name, user_password, user_email, user_phone_number, user_address  } = req.body;

    // Validate required fields
    if (!user_email || !user_name || !user_password || !user_phone_number || !user_address) {
        throw new CustomError("BAD_REQUEST", "Please fill in all fields", STATUS_CODE.BAD_REQUEST);
    }

    // Example of a verification query:
    const userCheckSql = 'SELECT user_email FROM Users WHERE user_email = ? LIMIT 1';
    const [existingRows] = await db.query(userCheckSql, [user_email]);
    if (existingRows.length > 0) {
        throw new CustomError("BAD_REQUEST", "User already exists", STATUS_CODE.BAD_REQUEST);
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user_password, salt);

    // Generate verify code
//   const verifyCode = generateVerifyCode();

    // Call the stored procedure to create the user
    await createUserInDb({
        user_name,
        user_password: hashedPassword,
        user_email,
        user_phone_number,
        user_address
    });

//   // Send verification email
//   sendEmail(email, verifyCode);

    // Respond with success
    return formatResponse(res, "Success", "User created successfully", STATUS_CODE.CREATED, {}); 
};

