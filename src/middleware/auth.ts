import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

type AuthPayload = JwtPayload & {
    role: string;
    id: number;
    name: string;
    email: string;
};

const auth = (...role: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization; // ✅ token only (no Bearer)

            if (!token) {
                return res.status(401).json({
                    message: "Access denied. No token provided",
                });
            }

            const decodedToken = jwt.verify(
                token,
                config.jwtSecret as string
            ) as AuthPayload;

            req.user = decodedToken;

            if (role.length && !role.includes(decodedToken.role)) {
                return res.status(403).json({
                    error: "Access denied. Invalid credentials",
                });
            }

            next();
        } catch (err: any) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    };
};

export default auth;
