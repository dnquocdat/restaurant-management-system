import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import db from '../configs/db.js';


import {
    checkBranchExists,
    checkReservationExists,
    checkDishExists
} from '../services/check.service.js';

import {
    createDishReview
} from '../services/dish.service.js';

export const submitReview = async (req, res) => {
    const { rating, comment } = req.body;
    const dish_id = parseInt(req.params.dishId, 10);

    // Check reservation exists
    await checkDishExists(dish_id);

    const success = await createDishReview({
        user_id : req.user.user_id,
        dish_id,
        rating,
        comment
    });

    if(success == -1){
        throw new CustomError("BAD_REQUEST", "User have already rated the dish before", STATUS_CODE.BAD_REQUEST);
    }

    return formatResponse(res, "Success", "Review dish submitted successfully", STATUS_CODE.CREATED, {});
}
