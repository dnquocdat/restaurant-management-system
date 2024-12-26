import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
import formatResponse from '../utils/formatresponse.js';
import { searchMenu as searchMenuService } from '../services/menu.service.js';

// ...existing code...

export const searchMenu = async (req, res, next) => {
    const { branchId } = req.params;
    const { query, category, page = 1, limit = 10, sort } = req.query;
    
    const branch_id = parseInt(branchId, 10);
    
    // Validate branchId
    if (isNaN(branch_id)) {
        throw new CustomError("BAD_REQUEST", "Invalid branch ID", STATUS_CODE.BAD_REQUEST);
    }
    
    // Validate sort parameter if provided
    if (sort) {
        const [field, direction] = sort.split(',');
        if (!field || !direction || !['price', 'prices'].includes(field.toLowerCase()) || !['asc', 'desc'].includes(direction.toLowerCase())) {
            throw new CustomError("BAD_REQUEST", "Invalid sort parameter format. Use sort=field,asc|desc", STATUS_CODE.BAD_REQUEST);
        }
    }
    
    const { listDish, totalRecords } = await searchMenuService({branch_id,  query, category, page, limit, sort });
    
    // Calculate pagination details
    const totalPages = Math.ceil(totalRecords / limit);
    const hasMore = page < totalPages;
    
    const data = {
        listDish: listDish.map(dish => ({
            dish_id: dish.dish_id,
            dish_name: dish.dish_name,
            price: dish.price,
            image_link: dish.image_link
        })),
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalPages: totalPages,
            hasMore: hasMore
        }
    };
    
    return formatResponse(res, "Search Menu", "Menu retrieved successfully", STATUS_CODE.SUCCESS, data);
        
};

// ...existing code...