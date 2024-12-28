import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CustomError from "../utils/errors.js";
import * as dotenv from "dotenv";
import STATUS_CODE from "../utils/constants.js";
import formatResponse from "../utils/formatresponse.js";

import db from "../configs/db.js";

import { createUserInDb } from "../services/auth.service.js";

dotenv.config();

export function test(req, res) {
  throw new CustomError("TEST_ERROR", "This is a test error", 400, {
    user: req.user,
  });
}

const generateToken = (user, secret_key, expire) => {
  return jwt.sign(
    {
      staff_id: user.staff_id,
      user_id: user.user_id,
      user_email: user.user_email,
      user_phone_number: user.user_phone_number,
      is_staff: user.is_staff,
      is_admin: user.is_admin,
    },
    secret_key,
    { expiresIn: expire }
  );
};

export const registerUser = async (req, res) => {
  const {
    user_name,
    user_password,
    user_email,
    user_phone_number,
    user_address,
  } = req.body;

  // Validate required fields
  if (
    !user_email ||
    !user_name ||
    !user_password ||
    !user_phone_number ||
    !user_address
  ) {
    throw new CustomError(
      "BAD_REQUEST",
      "Please fill in all fields",
      STATUS_CODE.BAD_REQUEST
    );
  }

  const userCheckSql =
    "SELECT user_email FROM online_account WHERE user_email = ? LIMIT 1";
  const [existingRows] = await db.query(userCheckSql, [user_email]);
  if (existingRows.length > 0) {
    throw new CustomError(
      "BAD_REQUEST",
      "User already exists",
      STATUS_CODE.BAD_REQUEST
    );
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user_password, salt);

  await createUserInDb({
    user_name,
    user_password: hashedPassword,
    user_email,
    user_phone_number,
    user_address,
  });

  return formatResponse(
    res,
    "Success",
    "User created successfully",
    STATUS_CODE.CREATED,
    {}
  );
};

export const loginUser = async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    throw new CustomError(
      "BAD_REQUEST",
      "Please fill in all fields",
      STATUS_CODE.BAD_REQUEST
    );
  }

  const userCheckSql =
    "SELECT * FROM online_account WHERE user_email = ? LIMIT 1";
  const [existingRows] = await db.query(userCheckSql, [user_email]);

  if (existingRows.length === 0) {
    throw new CustomError(
      "BAD_REQUEST",
      "User doesn't exist",
      STATUS_CODE.BAD_REQUEST
    );
  }

  const user = existingRows[0];
  const match = await bcrypt.compare(user_password, user.user_password);

  if (!match)
    throw new CustomError(
      "BAD_REQUEST",
      "Invalid credentials",
      STATUS_CODE.BAD_REQUEST
    );

  const accessToken = generateToken(
    user,
    process.env.JWT_ACCESS_KEY,
    process.env.ACCESS_TIME
  );
  const refreshToken = generateToken(
    user,
    process.env.JWT_REFRESH_KEY,
    process.env.REFRESH_TIME
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/auth/refresh",
    sameSite: "strict",
  });

  res.cookie("tokenLogout", refreshToken, {
    httpOnly: true,
    path: "/api/auth/logout",
    sameSite: "strict",
  });

  const {
    user_password: password,
    refresh_token,
    verify_code,
    ...others
  } = user;

  const updateRefreshTokenSql =
    "UPDATE online_account SET refresh_token = ? WHERE user_id = ?";
  await db.query(updateRefreshTokenSql, [refreshToken, user.user_id]);

  return formatResponse(
    res,
    "Success",
    "User logged in successfully",
    STATUS_CODE.SUCCESS,
    {
      user: others,
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  );
};

export const requestRefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    throw new CustomError(
      "UNAUTHORIZED",
      "Unauthorized!",
      STATUS_CODE.UNAUTHORIZED
    );
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
    if (err) {
      res.clearCookie("refreshToken");
      res.clearCookie("tokenLogout");
      throw new CustomError(
        "UNAUTHORIZED",
        "Unauthorized!",
        STATUS_CODE.UNAUTHORIZED,
        err.message
      );
    }

    const userCheckSql =
      "SELECT * FROM online_account WHERE user_id = ? LIMIT 1";
    const [existingRows] = await db.query(userCheckSql, [user.user_id]);

    if (
      existingRows.length === 0 ||
      refreshToken !== existingRows[0].refresh_token
    ) {
      res.clearCookie("refreshToken");
      res.clearCookie("tokenLogout");
      throw new CustomError(
        "UNAUTHORIZED",
        "Unauthorized!",
        STATUS_CODE.UNAUTHORIZED
      );
    }

    const newAccessToken = generateToken(
      user,
      process.env.JWT_ACCESS_KEY,
      process.env.ACCESS_TIME
    );
    const newRefreshToken = generateToken(
      user,
      process.env.JWT_REFRESH_KEY,
      process.env.REFRESH_TIME
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh",
      sameSite: "strict",
    });

    res.cookie("tokenLogout", newRefreshToken, {
      httpOnly: true,
      path: "/api/auth/logout",
      sameSite: "strict",
    });

    const updateRefreshTokenSql =
      "UPDATE online_account SET refresh_token = ? WHERE user_id = ?";
    await db.query(updateRefreshTokenSql, [newRefreshToken, user.user_id]);

    return formatResponse(
      res,
      "Success",
      "Refresh token successfully!",
      STATUS_CODE.SUCCESS,
      {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      }
    );
  });
};

export const logoutUser = async (req, res) => {
  const userCheckSql =
    "SELECT * FROM online_account WHERE refresh_token = ? LIMIT 1";
  const [existingRows] = await db.query(userCheckSql, [
    req.cookies.tokenLogout,
  ]);
  if (existingRows.length > 0) {
    const updateRefreshTokenSql =
      "UPDATE online_account SET refresh_token = NULL WHERE user_id = ?";
    await db.query(updateRefreshTokenSql, [existingRows[0].user_id]);
  }
  res.clearCookie("refreshToken");
  res.clearCookie("tokenLogout");
  return formatResponse(
    res,
    "Success",
    "User logged out successfully",
    STATUS_CODE.SUCCESS,
    {}
  );
};
