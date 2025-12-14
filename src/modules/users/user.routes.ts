
import express from "express";
import {userControllers} from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/",userControllers.createUser);

router.get("/",auth("admin"),userControllers.getUser);

router.get("/:userId",userControllers.getSingleUser);

router.put("/:userId",userControllers.updateUser);

router.delete("/:userId",userControllers.deleteUser);

export const userRoutes = router;