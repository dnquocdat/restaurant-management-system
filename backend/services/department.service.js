// ...existing code...
import db from '../configs/db.js';
import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';

export async function addDepartment(departmentData) {
    const { department_name, salary } = departmentData;
    const sql = `CALL CreateDepartment(?, ?)`;
    const params = [department_name, salary];
    const [result] = await db.query(sql, params);
    const department = result[0][0];
    return department;
}

export async function updateDepartment(departmentId, updateData) {
    const { department_name, salary } = updateData;
    const sql = `CALL UpdateDepartmentInfo(?, ?, ?)`;
    const params = [departmentId, department_name || null, salary !== undefined ? salary : null];
    const [result] = await db.query(sql, params);
    
    // Check if any rows were affected
    if (result.affectedRows === 0) {
        throw new CustomError("NOT_FOUND", "Department not found", STATUS_CODE.NOT_FOUND);
    }

    return;
}

// ...existing code...
