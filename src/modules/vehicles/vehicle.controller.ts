import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

// Vehicle CRUD controller (request/response here)

const createVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

        // Simple beginner validation
        if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // NOTE: Admin only (JWT middleware later)
        const result = await vehicleServices.createVehicle(
            vehicle_name,
            type,
            registration_number,
            Number(daily_rent_price),
            availability_status
        );

        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicles();

        // API_REFERENCE: if empty list => "No vehicles found"
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getSingleVehicle(req.params.vehicleId!);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        // If id is invalid
        if (err.message === "Invalid vehicle id") {
            return res.status(400).json({ success: false, message: err.message });
        }

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

        // NOTE: Admin only (JWT middleware later)
        const result = await vehicleServices.updateVehicle(
            req.params.vehicleId!,
            vehicle_name,
            type,
            registration_number,
            Number(daily_rent_price),
            availability_status
        );

        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        if (err.message === "Invalid vehicle id") {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (err.message === "Vehicle not found") {
            return res.status(404).json({ success: false, message: err.message });
        }

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        // NOTE: Admin only (JWT middleware later)
        const result = await vehicleServices.deleteVehicle(req.params.vehicleId!);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (err: any) {
        if (err.message === "Invalid vehicle id") {
            return res.status(400).json({ success: false, message: err.message });
        }

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const vehicleControllers = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
