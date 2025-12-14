import {authServices} from "./auth.service";
import {Request, Response} from "express";


const signInUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;


    try {
        const result = await authServices.signIn(email, password);
        res.status(200).json({
            success: false,
            message: "login successful",
            data: result,
        });
    } catch (err: any) {
        res.status(400).send(err.message);
    }


}

export const authControllers = {
    signInUser,
}