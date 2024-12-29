import CustomError from "../utils/errors.js";
import STATUS_CODE from "../utils/constants.js";
import formatResponse from "../utils/formatresponse.js";
import { searchMenu as searchMenuService } from "../services/menu.service.js";
import { checkBranchExists } from "../services/check.service.js";

// ...existing code...

export const searchMenu = async (req, res, next) => {
  const { branchId } = req.params;
  const { query = "", category = "", page = 1, limit = 10, sort } = req.query;

  const branch_id = parseInt(branchId, 10);

  await checkBranchExists(branch_id);

  let field = "";
  let direction = "";

  // Validate sort parameter if provided
  if (sort) {
    [field, direction] = sort.split(",");
    if (
      !field ||
      !direction ||
      !["dish_name", "price"].includes(field.toLowerCase()) ||
      !["asc", "desc"].includes(direction.toLowerCase())
    ) {
      throw new CustomError(
        "BAD_REQUEST",
        "Invalid sort parameter format. Use sort=field,asc|desc",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const { listDish, totalRecords } = await searchMenuService({
      branch_id,
      query,
      category,
      page,
      limit,
      field,
      direction,
    });

    // Calculate pagination details
    const totalPages = Math.ceil(totalRecords / limit);
    const hasMore = page < totalPages;
    if (page > totalPages) {
      throw new CustomError(
        "BAD_REQUEST",
        "Invalid page number",
        STATUS_CODE.BAD_REQUEST,
        []
      );
    }

    const data = {
      listDish: listDish.map((dish) => ({
        dish_id: dish.dish_id,
        dish_name: dish.dish_name,
        price: dish.price,
        image_link: dish.image_link,
        description: dish.description,
      })),
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalPages: totalPages,
        hasMore: hasMore,
      },
    };

    return formatResponse(
      res,
      "Search Menu",
      "Menu retrieved successfully",
      STATUS_CODE.SUCCESS,
      data
    );
  }
};
