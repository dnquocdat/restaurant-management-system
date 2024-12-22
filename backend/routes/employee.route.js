import { Router } from 'express';
import { addEmployee, deleteEmployee, updateEmployee } from '../controllers/employee.controller.js';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const router = Router();

// Add Employee endpoint with middleware
router.post('/', verifyToken, asyncErrorHandler(addEmployee));

// Delete Employee endpoint with middleware
router.delete('/:employeeId', verifyToken, asyncErrorHandler(deleteEmployee));

// Update Employee endpoint with middleware
router.patch('/:employeeId', verifyToken, asyncErrorHandler(updateEmployee));

export default router;
