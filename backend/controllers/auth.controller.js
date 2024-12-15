import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/errors.js';
import * as dotenv from 'dotenv';

dotenv.config();

export function test(req, res) {
    throw new CustomError('TEST_ERROR', 'This is a test error', 400, {"mother fucker": "test"});
}
