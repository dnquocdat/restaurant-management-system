import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import { addDepartment as addDepartmentService } from '../services/department.service.js';

export const addDepartment = async (req, res, next) => {
    const { department_name, salary } = req.body;

    // Validate required fields
    if (!department_name || salary === undefined) {
        throw new CustomError("BAD_REQUEST", "Please provide all required fields", STATUS_CODE.BAD_REQUEST);
    }

    // Add department
    const department = await addDepartmentService({ department_name, salary });

    // Format response
    const data = {
        department_id: department.department_id,
        department_name: department.department_name,
        salary: department.salary,
    };

    return formatResponse(res, "Create Department", "Department created successfully", STATUS_CODE.CREATED, data);
};

export const updateDepartment = async (req, res, next) => {
    let { departmentId } = req.params;
    departmentId = parseInt(departmentId, 10);

    if (isNaN(departmentId)) {
        throw new CustomError("BAD_REQUEST", "Invalid department ID", STATUS_CODE.BAD_REQUEST);
    }

    await updateDepartmentInfo(departmentId, req.body);

    return formatResponse(
        res,
        "Update Department",
        "Department updated successfully",
        STATUS_CODE.OK,
        null
    );
};
