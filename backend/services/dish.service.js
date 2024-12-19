import db from '../configs/db.js';

export const createDishReview = async ({user_id, dish_id, rating, comment}) => {
    const callProcedure = 'CALL CreateDishReview(?, ?, ?, ?, @success);';
    const selectSuccess = 'SELECT @success as success;';
    
    await db.query(callProcedure, [user_id, dish_id, rating, comment]);
    const [rows] = await db.query(selectSuccess);
    
    return rows[0].success;
};