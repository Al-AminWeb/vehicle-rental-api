import express, {Request, Response} from "express";
import {Pool} from "pg";
import dotenv from "dotenv";
import path from "path";


dotenv.config({path: path.join(process.cwd(), '.env')});
const app = express();
const port = 5000;
app.use(express.json());

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
});


const initDB = async () => {
    // USERS TABLE
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password TEXT NOT NULL,
            phone VARCHAR(20) NOT NULL,
            role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
        );
    `);

    // VEHICLES TABLE
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(150) NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(50) NOT NULL UNIQUE,
            daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        );
    `);

    // BOOKINGS TABLE
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price NUMERIC NOT NULL CHECK (total_price > 0),
            status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
        );
    `);
};

initDB();

app.get("/", (req:Request, res: Response) => {
    res.send("Hello World who are u!");
});

//user crud
app.post("/users", async (req: Request, res: Response) => {
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

})


app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);

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
})


//language:text
app.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT *
                                         FROM users
                                         WHERE id = $1`, [req.params.id]);
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
})



//update api
app.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // First get the existing user
        const oldUser = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [req.params.id]
        );

        if (oldUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const user = oldUser.rows[0];


        const updatedName = name || user.name;
        const updatedEmail = email || user.email;
        const updatedPassword = password || user.password;
        const updatedPhone = phone || user.phone;
        const updatedRole = role || user.role;

        const result = await pool.query(
            `UPDATE users 
             SET name = $1, email = $2, password = $3, phone = $4, role = $5
             WHERE id = $6 
             RETURNING *`,
            [
                updatedName,
                updatedEmail,
                updatedPassword,
                updatedPhone,
                updatedRole,
                req.params.id
            ]
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});




//delete api
app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
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
})

app.listen(port, async () => {

    console.log(`Example app listening on port ${port}`);
});
