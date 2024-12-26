import db from '../configs/db.js';
import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';

export async function searchMenu({ branch_id, query, category, page = 1, limit = 10, field, direction }) {
    // Default values
    const p_query = query;
    const p_category = category || '';
    const p_page = parseInt(page, 10) || 1;
    const p_limit = parseInt(limit, 10) || 10;
    const p_branch_id = branch_id;
    const p_orderByField = field || '';
    const p_orderByDirection = direction || '';

    const p_tableName = 'dishes';
    const p_query_name = 'dishes.dish_name';
    const p_category_name = 'dishes.category_name';
    const p_branch_name = 'menu.branch_id';
    const p_id_name = 'dishes.dish_id';
    const p_selectFields = 'dishes.dish_id, dishes.dish_name, dishes.price, dishes.image_link';
    const p_joinClause = 'JOIN menu ON dishes.dish_id = menu.dish_id';

    let p_totalRecords = 0;

    try {
        // Call the stored procedure
        const sql = `CALL GetDynamicItems(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @totalRecords);`;
        const params = [
            p_query_name,
            p_query,
            p_page,
            p_limit,
            p_tableName,
            p_orderByField,
            p_orderByDirection,
            p_category_name,
            p_category,
            p_branch_name,
            p_branch_id,
            p_id_name,
            p_selectFields,
            p_joinClause
        ];

        const [results] = await db.query(sql, params);

        // Retrieve the total records from the OUT parameter
        const [[{ totalRecords }]] = await db.query('SELECT @totalRecords as totalRecords;');
        p_totalRecords = totalRecords;

        return {
            listDish: results[0],
            totalRecords: p_totalRecords
        };

    } catch (error) {
        throw new CustomError("DATABASE_ERROR", "Error retrieving menu", STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}
