import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signIn = async (email: string, password: string) => {

    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        return null; // user not found
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return false;
    }




    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        config.jwtSecret as string,
        { expiresIn: "120d" }
    );

    return { token, user };
};

export const authServices = {
    signIn,
};
