import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';
import { getBill } from '../services/bill.service.js';


export const getBillDetail = async (req, res,next) => {
    let {billId} = req.params;
    billId = parseInt(billId,10);
    if(isNaN(billId)){
        throw new CustomError("BAD_REQUEST", "Bill ID is required", STATUS_CODE.BAD_REQUEST);
    }
    const rows = await getBill(billId);
    console.log(rows);
    return formatResponse(res, "Success", "Bill retrieved successfully", STATUS_CODE.SUCCESS, rows);
};