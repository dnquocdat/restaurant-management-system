import db from '../configs/db.js';
import CustomError from '../utils/errors.js';

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

export async function updateEmployee(employeeId, updateData) {
    /*
      updateData may include keys:
      {
        employee_name,
        employee_email,
        date_of_birth,
        gender,
        employee_phone_number,
        employee_address,
        branch_name,
        department_name
      }
    */

    // 1. Update basic employee information first
    const sqlUpdateEmployee = `CALL UpdateEmployeeInfo(?, ?, ?, ?, ?, ?)`;
    const paramsEmployee = [
        employeeId,
        updateData.employee_name || null,
        updateData.employee_email || null,
        updateData.date_of_birth || null,
        updateData.gender || null,
        updateData.employee_phone_number || null
    ];
    await db.query(sqlUpdateEmployee, paramsEmployee);

    // 2. If no branch or department data provided, just update private info
    const hasBranch = updateData.branch_name !== undefined;
    const hasDepartment = updateData.department_name !== undefined;
    
    if (!hasBranch && !hasDepartment) {
        // No further steps needed
        return;
    }

    // 3. If we reach here, either branch or department or both are provided
    //    Step 1: Set end_date for the current employee_branches record
    const closeBranchSql = `CALL UpdateEndDateEmployeeBranch(?)`;
    await db.query(closeBranchSql, [employeeId]);

    // 4. If branch_id is null => set current_work_id to null and exit
    if (updateData.branch_name === null) {
        const removeCurrentWorkSql = `CALL SetCurrentWorkNull(?)`;
        await db.query(removeCurrentWorkSql, [employeeId]);
        return;
    }
    
    // 4.5. Get the branch_id and department_id from the provided branch_name and department_name
    if (updateData.branch_name) {
        const getBranchIdSql = `CALL GetBranchId(?)`;
        const [branchRows] = await db.query(getBranchIdSql, [updateData.branch_name]);
        updateData.branch_id = branchRows[0][0].branch_id;
    }

    if (updateData.department_name) {
        const getDepartmentIdSql = `CALL GetDepartmentId(?)`;
        const [departmentRows] = await db.query(getDepartmentIdSql, [updateData.department_name]);
        updateData.department_id = departmentRows[0][0].department_id;
    }

    // 5. Special case: If the new department_name is 'Manager'
    //    a) Find current manager of the new branch and let them do the "step 4"
    //    b) Then proceed to re-assign the employee
    if (updateData.department_name === 'Manager') {
        const dethroneManagerSql = `CALL DethroneCurrentManager(?)`;
        await db.query(dethroneManagerSql, [updateData.branch_id]);
    }

    // 6. Insert a new record in employee_branches with start_date = NOW()
    const sqlNewBranch = `CALL InsertEmployeeBranchRecord(?, ?, ?)`;
    const paramsNewBranch = [
        employeeId,
        updateData.branch_id,
        updateData.department_id
    ];
    const [rows] = await db.query(sqlNewBranch, paramsNewBranch);
    // newEmployeeBranchesId is the primary key from the newly inserted record
    const newEmployeeBranchesId = rows[0][0].new_employee_branches_id;

    // 7. Update current_work_id on employees to this new ID
    const setCurrentWorkSql = `CALL SetCurrentWorkId(?, ?)`;
    await db.query(setCurrentWorkSql, [employeeId, newEmployeeBranchesId]);
}
