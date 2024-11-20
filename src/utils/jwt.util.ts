import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as Secret, {
    expiresIn: "200h",
  });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
