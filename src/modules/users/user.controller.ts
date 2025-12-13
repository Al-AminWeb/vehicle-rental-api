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

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();

        res.status(200).json({
            success: true,
            data: result.rows,
            message: "Users fetched successfully"
        })
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })
    }
}

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getSingleUser(req.params.id!);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                data: result.rows[0],
                message: "User fetched successfully"
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,

        })

    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const oldUser = await userServices.updateUser(req.params.id!, name, email, password, phone, role);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: oldUser.rows[0],
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.id!);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: null,
            });
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

export const userControllers ={
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
}