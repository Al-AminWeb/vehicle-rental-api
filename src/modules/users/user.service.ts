import {pool} from "../../config/db";


const createUser = async (name:string, email:string, password:string, phone:string, role:"admin"|"customer")=> {
    const result = await pool.query(`INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]);

    return result;
}

const getUser = async ()=> {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}


const getSingleUser = async (id: string)=> {
const result = await pool.query(`SELECT *
                                         FROM users
                                         WHERE id = $1`, [id]);
return result;
}

const updateUser = async (id: string, name: string, email: string, password: string, phone: string, role: "admin" | "customer") => {
    const userId = Number(id);


    if (Number.isNaN(userId)) {
        throw new Error("Invalid user id");
    }


    const oldUser = await pool.query(
        `SELECT *
         FROM users
         WHERE id = $1`,
        [userId]
    );


    if (oldUser.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = oldUser.rows[0];

    const updatedName = name || user.name;
    const updatedEmail = email || user.email;
    const updatedPassword = password || user.password;
    const updatedPhone = phone || user.phone;
    const updatedRole = role || user.role;

    const result = await pool.query(
        `UPDATE users
         SET name     = $1,
             email    = $2,
             password = $3,
             phone    = $4,
             role     = $5
         WHERE id = $6 RETURNING *`,
        [updatedName, updatedEmail, updatedPassword, updatedPhone, updatedRole, userId]
    );

    return result;
};

const deleteUser = async (id: string) => {
    const deletedUser = await pool.query(`DELETE FROM users WHERE id = $1`,[id]);
    return deletedUser;
}


export const userServices = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
}