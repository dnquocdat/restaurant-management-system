import pkg from 'jsonwebtoken';
import CustomError from '../utils/errors.js';
import STATUS_CODE from '../utils/constants.js';
const { verify } = pkg;

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const accessToken = authorization.split(" ")[1];
    verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError")
          throw new CustomError("UNAUTHORIZED", "Token has expired!", STATUS_CODE.UNAUTHORIZED); 
        else
          throw new CustomError("FORBIDDEN", "Token is not valid!", STATUS_CODE.FORBIDDEN);
      }
      req.user = user;
      next();
    });
  } else {
    throw new CustomError("UNAUTHORIZED", "You are not authenticated!", STATUS_CODE.UNAUTHORIZED);
  }
};

export default verifyToken;
