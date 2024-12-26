import db from '../configs/db.js';
import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';

export async function searchMenu({branchId, query, category, page = 1, limit = 10, sort }) {
    // Default values
    const p_query = query || '';
    const p_category = category || '';
    const p_page = parseInt(page, 10) || 1;
    const p_limit = parseInt(limit, 10) || 10;
    const p_branch_id = parseInt(branchId, 10) || '';
    
    // Parse sort parameter
    let p_orderByField = '';
    let p_orderByDirection = '';
    if (sort) {
        const [field, direction] = sort.split(',');
        if (field && direction && ['asc', 'desc'].includes(direction.toLowerCase())) {
            p_orderByField = field;
            p_orderByDirection = direction.toUpperCase();
        }
    }
    
    const p_tableName = 'dishes';
    const p_query_name = 'dish_name';
    const p_category_name = 'category_name';
    const p_id_name = 'dish_id';
    
    let p_totalRecords = 0;
    
    try {
        // Call the stored procedure
        const sql = `CALL GetDynamicItems(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @totalRecords);`;
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
            p_branch_id,
            p_id_name
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
