import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// create booking (customer/admin)
router.post("/", auth("customer", "admin"), bookingControllers.createBooking);

// get bookings (customer sees own, admin sees all)
router.get("/", auth("customer", "admin"), bookingControllers.getBookings);

// update booking
router.put("/:bookingId", auth("customer", "admin"), bookingControllers.updateBooking);

export const bookingRoutes = router;
