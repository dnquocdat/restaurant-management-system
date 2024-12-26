import db from '../configs/db.js';
import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';

export async function addBranch(branchData) {
    const { branch_name, address, open_time, close_time, phone_number, email, has_car_park, has_motorbike_park, table_amount } = branchData;
    const sql = `CALL CreateBranch(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [branch_name, address, open_time, close_time, phone_number, email, has_car_park, has_motorbike_park, table_amount];
    const [result] = await db.query(sql, params);
    const branch = result[0][0];
    return branch;
}

export async function updateBranch(branchData) {
    const { branch_id, branch_name, address, open_time, close_time, phone_number, email, has_car_park, has_motorbike_park, table_amount } = branchData;
    const sql = `CALL UpdateBranchInfo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [branch_id, branch_name || null, address || null, open_time || null, close_time || null, phone_number || null, email || null, has_car_park !== undefined ? has_car_park : null, has_motorbike_park !== undefined ? has_motorbike_park : null, table_amount !== undefined ? table_amount : null];
    const [result] = await db.query(sql, params);
    
    // Check if any rows were affected
    if (result.affectedRows === 0) {
        throw new CustomError("NOT_FOUND", "Branch not found", STATUS_CODE.NOT_FOUND);
    }

    const updatedBranch = result[0][0];
    return updatedBranch;
}

export async function GetContract(branch_id){
    const sql = `CALL GetContract(?)`;
    const [result] = await db.query(sql, [branch_id]);
    return result[0][0];
}