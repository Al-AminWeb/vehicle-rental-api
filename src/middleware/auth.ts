import {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../config";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    message: "Access denied. No token provided",
                })
            }
            const decodedToken = jwt.verify(token, config.jwtSecret as string);
            console.log(decodedToken)
            req.user = decodedToken as JwtPayload;
            next();
        }
        catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message,
            })
        }
    };
};

export default auth;