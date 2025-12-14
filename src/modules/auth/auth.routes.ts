import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

// signup
router.post("/signup", authControllers.signUpUser);

// signin
router.post("/signin", authControllers.signInUser);

export const authRoutes = router;
