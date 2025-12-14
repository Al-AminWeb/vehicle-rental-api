import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

/* ===================== CREATE BOOKING ===================== */
const createBooking = async (req: Request, res: Response) => {
    try {
        const { vehicle_id, rent_start_date, rent_end_date } = req.body;

        // customer_id comes from token (req.user)
        const user = req.user as any;

        const result = await bookingServices.createBooking(
            user.id,
            vehicle_id,
            rent_start_date,
            rent_end_date
        );

        if ((result as any).error) {
            return res.status(400).json({
                success: false,
                message: (result as any).error,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ===================== GET BOOKINGS ===================== */
const getBookings = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;

        const result = await bookingServices.getBookings(user.role, user.id);

        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ===================== UPDATE BOOKING ===================== */
const updateBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const user = req.user as any;

        const result = await bookingServices.updateBookingStatus(
            Number(bookingId),
            status,
            user.role,
            user.id
        );

        if ((result as any).error) {
            return res.status(400).json({
                success: false,
                message: (result as any).error,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const bookingControllers = {
    createBooking,
    getBookings,
    updateBooking,
};
