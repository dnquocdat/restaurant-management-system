import db from '../configs/db.js';

export async function addEmployee(employeeData) {
    const { employee_name, employee_email, date_of_birth, gender, employee_phone_number, employee_address } = employeeData;
    const sql = `CALL CreateEmployee(?, ?, ?, ?, ?, ?)`;
    const params = [employee_name, employee_email, date_of_birth, gender, employee_phone_number, employee_address];
    const [result] = await db.query(sql, params);
    const employee = result[0][0];
    return employee;
}

export async function deleteEmployee(employeeId) {
    const sql = `CALL UpdateEmployeeQuitDate(?)`;
    const params = [employeeId];
    const [result] = await db.query(sql, params);
    
    // Check if any rows were affected
    if (result.affectedRows === 0) {
        throw new CustomError("NOT_FOUND", "Employee not found", STATUS_CODE.NOT_FOUND);
    }

    return;
}
