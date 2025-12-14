import { authServices } from "./auth.service";
import { Request, Response } from "express";

/* ===================== SIGN UP ===================== */
const signUpUser = async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const result = await authServices.signUp(
            name,
            email,
            password,
            phone,
            role
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).send(err.message);
    }
};

/* ===================== SIGN IN ===================== */
const signInUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authServices.signIn(email, password);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (err: any) {
        res.status(400).send(err.message);
    }
};

export const authControllers = {
    signUpUser,
    signInUser,
};
