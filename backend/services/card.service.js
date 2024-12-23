import db from '../configs/db.js';
import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';

export async function addMemberCard(cardData) {
    const { member_id, member_name, member_phone_number, member_gender, card_issuer, branch_created } = cardData;
    const sql = `CALL CreateMemberCard(?, ?, ?, ?, ?, ?)`;
    const params = [member_id, member_name, member_phone_number, member_gender, card_issuer, branch_created];
    const [result] = await db.query(sql, params);
    const memberCard = result[0][0];
    return memberCard;
}

export async function updateMemberCard(cardData) {
    const { member_card_id, member_id, member_name, member_phone_number, member_gender, user_id, is_active } = cardData;
    const sql = `CALL UpdateMemberCardInfo(?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        member_card_id,
        member_id || null,
        member_name || null,
        member_phone_number || null,
        member_gender || null,
        user_id || null,
        is_active !== undefined ? is_active : null
    ];
    const [result] = await db.query(sql, params);
    const updatedCard = result[0][0];
    return updatedCard;
}