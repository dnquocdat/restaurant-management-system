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
    createDishReview,
    createDish,
    addDishToMenu
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

export const addDishtoMenu = async (req, res) => {
    const dish_id = parseInt(req.params.dishId, 10);
    const branch_id = parseInt(req.params.branchId, 10);
    const { is_ship } = req.body;

    await addDishToMenu({
        dish_id,
        branch_id,
        is_ship 
    });

    const data = {
        dish_id,
        branch_id,
        is_ship 
    };

    return formatResponse(
        res,
        "Create Dish",
        "Dish added to menu successfully",
        STATUS_CODE.CREATED,
        data
    );
}

export const submitDish = async (req, res) => {
    const { dish_name, price, description, category_name, image_link } = req.body;

    // Validate required fields
    if (!dish_name || !price || !description || !category_name || !image_link) {
        throw new CustomError("BAD_REQUEST", "Please fill in all fields", STATUS_CODE.BAD_REQUEST);
    }

    const newDish = await createDish({
        dish_name,
        price: parseFloat(price),
        description,
        category_name,
        image_link 
    });

    const data = {
        dish_id: newDish.dish_id,
        dish_name: newDish.dish_name,
        price: newDish.price,
        description: newDish.description,
        category_name: newDish.category_name,
        image_link: newDish.image_link
    };

    return formatResponse(
        res,
        "Create Dish",
        "Dish created successfully",
        STATUS_CODE.CREATED,
        data
    );
}