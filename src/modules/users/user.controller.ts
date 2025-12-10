import {pool} from "../../config/db";
import {Request, Response} from "express";
import {userServices} from "./user.service";


const createUser = async (req: Request, res: Response) => {
    const {name, email, password, phone, role} = req.body;
    try {
        const result = await userServices.createUser(name, email, password, phone, role);
        res.status(201).json({
            success:false,
            message:"User created successfully",
            data:result.rows[0],
        });
    } catch (err: any) {
        res.status(400).send(err.message);
    }

}

export const userControllers ={
    createUser,
}