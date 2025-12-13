import express from "express";
import { vehicleControllers } from "./vehicle.controller";

const router = express.Router();

// Base: /api/v1/vehicles

// Admin only later (JWT middleware)
router.post("/", vehicleControllers.createVehicle);

// Public
router.get("/", vehicleControllers.getVehicles);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

// Admin only later (JWT middleware)
router.put("/:vehicleId", vehicleControllers.updateVehicle);
router.delete("/:vehicleId", vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
