import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';
import { addBranch as addBranchService, updateBranch as updateBranchService } from '../services/branch.service.js';
import { parse } from 'dotenv';

// ...existing code...

export const createBranch = async (req, res, next) => {
    const { branch_name, address, open_time, close_time, phone_number, email, has_car_park, has_motorbike_park, table_amount } = req.body;

    // Validate required fields
    if (
        !branch_name ||
        !address ||
        !open_time ||
        !close_time ||
        !phone_number ||
        !email ||
        has_car_park === undefined ||
        has_motorbike_park === undefined ||
        table_amount === undefined
    ) {
        throw new CustomError("BAD_REQUEST", "Please provide all required fields", STATUS_CODE.BAD_REQUEST);
    }

    // Add branch
    const branch = await addBranchService({
        branch_name,
        address,
        open_time,
        close_time,
        phone_number,
        email,
        has_car_park,
        has_motorbike_park,
        table_amount
    });

    // Format response
    const data = {
        branch_id: branch.branch_id,
        branch_name: branch.branch_name,
        address: branch.address,
        open_time: branch.open_time,
        close_time: branch.close_time,
        phone_number: branch.phone_number,
        email: branch.email,
        has_car_park: branch.has_car_park,
        has_motorbike_park: branch.has_motorbike_park,
        table_amount: branch.table_amount
    };

    return formatResponse(res, "Create Branch", "Branch created successfully", STATUS_CODE.CREATED, data);
};

export const updateBranch = async (req, res, next) => {
    const branch_id = parseInt(req.params.branchId, 10);
    const {
        branch_name,
        address,
        open_time,
        close_time,
        phone_number,
        email,
        has_car_park,
        has_motorbike_park,
        table_amount
    } = req.body;

    // Validate at least one field to update
    if (
        branch_name === undefined &&
        address === undefined &&
        open_time === undefined &&
        close_time === undefined &&
        phone_number === undefined &&
        email === undefined &&
        has_car_park === undefined &&
        has_motorbike_park === undefined &&
        table_amount === undefined
    ) {
        throw new CustomError(
            "BAD_REQUEST",
            "Please provide at least one field to update",
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Prepare update data
    const updateData = {
        branch_id,
        branch_name,
        address,
        open_time,
        close_time,
        phone_number,
        email,
        has_car_park,
        has_motorbike_park,
        table_amount
    };

    // Perform update
    const updatedBranch = await updateBranchService(updateData);

    // Format response
    const data = {
        branch_id: updatedBranch.branch_id,
        branch_name: updatedBranch.branch_name,
        address: updatedBranch.address,
        open_time: updatedBranch.open_time,
        close_time: updatedBranch.close_time,
        phone_number: updatedBranch.phone_number,
        email: updatedBranch.email,
        has_car_park: updatedBranch.has_car_park,
        has_motorbike_park: updatedBranch.has_motorbike_park,
        table_amount: updatedBranch.table_amount
    };

    return formatResponse(
        res,
        "Update Branch",
        "Branch updated successfully",
        STATUS_CODE.SUCCESS,
        data
    );
};

// ...existing code...