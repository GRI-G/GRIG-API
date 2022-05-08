import * as jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET_KEY ?? "";

export const generateToken: Function = (
  payload: Object,
  expiresIn: string | number | undefined,
): String =>
  jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn,
  });

export const verifyToken: Function = (token: string): Object =>
  jwt.verify(token, jwtSecret);
