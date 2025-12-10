import {pool} from "../../config/db";
import {Request, Response} from "express";


const createUser = async (req: Request, res: Response) => {
    const {name, email, password, phone, role} = req.body;
    try {
        const result = await pool.query(`INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]);
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