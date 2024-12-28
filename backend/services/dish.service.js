import db from "../configs/db.js";

export const createDishReview = async ({
  user_id,
  dish_id,
  rating,
  comment,
}) => {
  const callProcedure = "CALL CreateDishReview(?, ?, ?, ?, @success);";
  const selectSuccess = "SELECT @success as success;";

  await db.query(callProcedure, [user_id, dish_id, rating, comment]);
  const [rows] = await db.query(selectSuccess);

  return rows[0].success;
};

export const createDish = async ({
  dish_name,
  price,
  description,
  category_name,
  image_link,
}) => {
  const callProcedure = "CALL CreateDish(?, ?, ?, ?, ?);";

  const [rows] = await db.query(callProcedure, [
    dish_name,
    price,
    description,
    category_name,
    image_link,
  ]);

  return rows[0][0];
};

export const addDishToMenu = async ({ dish_id, branch_id, is_ship }) => {
  const callProcedure = "CALL AddDishToMenu(?, ?, ?);";

  await db.query(callProcedure, [dish_id, branch_id, is_ship]);
};

export const removeDishFromMenu = async (dish_id, branch_id) => {
  const callProcedure = "CALL RemoveDishFromMenu(?, ?);";
  await db.query(callProcedure, [dish_id, branch_id]);
};

export async function updateDish(dishId, updateData) {
  const { dish_name, price, description, category_name, image_link } =
    updateData;
  const sql = `CALL UpdateDishInfo(?, ?, ?, ?, ?, ?)`;
  const params = [
    dishId,
    dish_name || null,
    price !== undefined ? price : null,
    description || null,
    category_name || null,
    image_link || null,
  ];
  const [result] = await db.query(sql, params);

  // Check if any rows were affected
  if (result.affectedRows === 0) {
    throw new CustomError("NOT_FOUND", "Dish not found", STATUS_CODE.NOT_FOUND);
  }

  return;
}

// export const removeDish = async (dish_id) => {
//     const callProcedure = 'CALL DeleteDish(?);';
//     await db.query(callProcedure, [dish_id]);
// };

export async function getCategories() {
  const sql = `CALL GetCategory();`;
  const [result] = await db.query(sql);
  return result[0]; // Trả về danh sách các danh mục
}

// -- Get DishesNotInBranchMenu
// DELIMITER $$

// -- Get DishesNotInBranchMenu
// CREATE PROCEDURE GetDishesNotInBranchMenu(IN input_branch_id INT)
// BEGIN
//     SELECT d.*
//     FROM dishes d
//     WHERE d.dish_id NOT IN (
//         SELECT m.dish_id
//         FROM menu m
//         WHERE m.branch_id = input_branch_id
//     );
// END $$

// DELIMITER ;

export async function getDishesNotInBranchMenu(branch_id) {
  const sql = `CALL GetDishesNotInBranchMenu(?)`;
  const [result] = await db.query(sql, [branch_id]);
  return result[0];
}
