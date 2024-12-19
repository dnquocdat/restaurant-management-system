import db from '../configs/db.js';

export const createDishReview = async ({user_id, dish_id, rating, comment}) => {
    const callProcedure = 'CALL CreateDishReview(?, ?, ?, ?, @success);';
    const selectSuccess = 'SELECT @success as success;';
    
    await db.query(callProcedure, [user_id, dish_id, rating, comment]);
    const [rows] = await db.query(selectSuccess);
    
    return rows[0].success;
};

export const createDish = async ({dish_name, price, description, category_name, image_link}) => {
    const callProcedure = 'CALL CreateDish(?, ?, ?, ?, ?);';
    
    const [rows] = await db.query(callProcedure, [dish_name, price, description, category_name, image_link]);
    
    return rows[0][0];
};

export const addDishToMenu = async ({dish_id, branch_id, is_ship}) => {
    const callProcedure = 'CALL AddDishToMenu(?, ?, ?);';
    
    await db.query(callProcedure, [dish_id, branch_id, is_ship]);
};

export const removeDishFromMenu = async (dish_id, branch_id) => {
    const callProcedure = 'CALL RemoveDishFromMenu(?, ?);';
    await db.query(callProcedure, [dish_id, branch_id]);
};

// export const removeDish = async (dish_id) => {
//     const callProcedure = 'CALL DeleteDish(?);';
//     await db.query(callProcedure, [dish_id]);
// };