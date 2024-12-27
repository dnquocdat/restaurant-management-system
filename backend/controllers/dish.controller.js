import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';

import db from '../configs/db.js';


import {
    checkBranchExists,
    checkReservationExists,
    checkDishExists,
    checkMenu
    
} from '../services/check.service.js';

import {
    createDishReview,
    createDish,
    addDishToMenu,
    removeDishFromMenu,
    updateDish as updateDishService,
    GetDishById
} from '../services/dish.service.js';

export const submitReview = async (req, res) => {
    const { rating, comment } = req.body;
    const dish_id = parseInt(req.params.dishId, 10);

    // Check reservation exists
    // await checkDishExists(dish_id);

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

    await checkDishExists(dish_id);
    await checkBranchExists(branch_id);

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

export const removeDishFromMenuController = async (req, res) => {
    const dish_id = parseInt(req.params.dishId, 10);
    const branch_id = parseInt(req.params.branchId, 10);

    await checkDishExists(dish_id);

    await checkBranchExists(branch_id);

    // Check if the dish exists in the branch's menu
    await checkMenu(dish_id, branch_id);

    // Remove the dish from the menu
    await removeDishFromMenu(dish_id, branch_id);

    return formatResponse(
        res,
        "Remove Dish from Menu",
        "Dish removed from menu successfully",
        STATUS_CODE.SUCCESS,
        null
    );
}

export const updateDish = async (req, res, next) => {
    let { dishId } = req.params;
    dishId = parseInt(dishId, 10); 
    


    if (isNaN(dishId)) {
        throw new CustomError("BAD_REQUEST", "Invalid dish ID", STATUS_CODE.BAD_REQUEST);
    }

    const { dish_name, price, description, category_name, image_link } = req.body;

    // Validate at least one field to update
    if (
        dish_name === undefined &&
        price === undefined &&
        description === undefined &&
        category_name === undefined &&
        image_link === undefined
    ) {
        throw new CustomError(
            "BAD_REQUEST",
            "Please provide at least one field to update",
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Prepare update data
    const updateData = {};
    if (dish_name !== undefined) updateData.dish_name = dish_name;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (category_name !== undefined) updateData.category_name = category_name;
    if (image_link !== undefined) updateData.image_link = image_link;

    // Perform update
    await updateDishService(dishId, updateData);

    return formatResponse(
        res,
        "Update Dish",
        "Dish updated successfully",
        STATUS_CODE.SUCCESS,
        null
    );
}

export const getDishDetail = async (req, res) => {
    let {dishId} = req.params;
    dishId = parseInt(dishId,10);

    if(isNaN(dishId)){
        throw new CustomError("BAD_REQUEST", "Invalid dish ID", STATUS_CODE.BAD_REQUEST);
    }

    // await checkDishExists(dishId);
    
    const rows = await GetDishById(dishId);


    return formatResponse(
        res,
        "Get Dish Detail",
        "Dish detail retrieved successfully",
        STATUS_CODE.SUCCESS,
        rows[0]
    );
}