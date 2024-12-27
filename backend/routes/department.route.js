import { Router } from 'express';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

import {
    addDepartment,
    updateDepartment,
    searchDepartmentsController
} from '../controllers/department.controller.js';

const router = Router();

// Create Department endpoint with middleware
router.post('/', verifyToken, asyncErrorHandler(addDepartment));

// Update Department endpoint with middleware
router.patch('/:departmentId', verifyToken, asyncErrorHandler(updateDepartment));

// Add Search Departments endpoint with middleware
router.get('/search', verifyToken, asyncErrorHandler(searchDepartmentsController));

// ...existing code...

export default router;