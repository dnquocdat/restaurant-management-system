// ...existing code...
import db from '../configs/db.js';

export async function addDepartment(departmentData) {
    const { department_name, salary } = departmentData;
    const sql = `CALL CreateDepartment(?, ?)`;
    const params = [department_name, salary];
    const [result] = await db.query(sql, params);
    const department = result[0][0];
    return department;
}

// ...existing code...
