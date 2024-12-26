import db from '../configs/db.js';

async function createOrderInDb({ 
    branch_id, 
    user_id, 
    cus_name, 
    reservation_slip_id, 
    order_type, 
    status, 
    dishes, 
    delivery_address, 
    delivery_phone, 
    shipper, 
    delivery_notes,
    member_card_id
}) {
    const sql = 'CALL CreateOrder(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_order_id, @p_delivery_id, @p_order_created_at)';
    const params = [
        branch_id,
        user_id,
        cus_name,
        reservation_slip_id,
        order_type,
        status,
        JSON.stringify(dishes),
        delivery_address,
        delivery_phone,
        shipper,
        delivery_notes,
        member_card_id
    ];
    const [rows] = await db.execute(sql, params);
    // Handle OUT parameters as needed
    const [outParams] = await db.execute(
        'SELECT @p_order_id AS order_id, @p_delivery_id AS delivery_id, @p_order_created_at AS order_created_at'
    );
    return outParams[0];
}


const getRandomEmployeeIdByDepartment = async (departmentName, branchId) => {
    const callProc = 'CALL GetRandomEmployeeByDepartment(?, ?, @p_employee_id)';
    await db.query(callProc, [departmentName, branchId]);

    const getOutput = 'SELECT @p_employee_id AS employee_id';
    const [rows] = await db.query(getOutput);

    return rows[0].employee_id;
};

export async function updateOrderStatus(order_id, newStatus) {
    const sql = `CALL UpdateOrderStatus(?, ?)`;
    const params = [order_id, newStatus];
    const [result] = await db.query(sql, params);
    
    // Check if any rows were affected
    if (result.affectedRows === 0) {
        throw new CustomError("NOT_FOUND", "Order not found", STATUS_CODE.NOT_FOUND);
    }

    return;
}

export async function getDishesInOnlineOrderById(order_id){
    const sql = `CALL GetDishesInOrder(?)`;
    const [result] = await db.query(sql, [order_id]);
    return result[0];
}
export async function GetOnlineOrderDetails(order_id) {
    const sql = `CALL GetOrderOnlineById(?)`;
    const [result] = await db.query(sql, [order_id]);
    return result[0][0];
}

export { createOrderInDb, getRandomEmployeeIdByDepartment };
