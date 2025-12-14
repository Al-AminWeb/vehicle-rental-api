import express, {NextFunction, Request, Response} from "express";
import config from "./config";
import initDB, {pool} from "./config/db";
import {userRoutes} from "./modules/users/user.routes";
import {vehicleRoutes} from "./modules/vehicles/vehicle.routes";
import {authRoutes} from "./modules/auth/auth.routes";
//228 gb


const app = express();
const port = config.port;
app.use(express.json());



initDB();



app.get("/", (req:Request, res: Response) => {
    res.send("Hello World who are u!");
});


app.use("/api/v1/users",userRoutes);

app.use("/api/v1/vehicles", vehicleRoutes);

app.use("/api/v1/auth", authRoutes);



app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path:req.path,
    });
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
});
