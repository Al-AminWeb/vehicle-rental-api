import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

/* ===================== SIGN UP ===================== */
const signUp = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: "admin" | "customer"
) => {
    // check user already exists
    const isUserExist = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (isUserExist.rows.length > 0) {
        return null;
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
        [name, email, hashedPassword, phone, role]
    );

    return result.rows[0];
};

/* ===================== SIGN IN ===================== */
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
        return false; // wrong password
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        config.jwtSecret as string,
        { expiresIn: "120d" }
    );

    return { token, user };
};

export const authServices = {
    signUp,
    signIn,
};
