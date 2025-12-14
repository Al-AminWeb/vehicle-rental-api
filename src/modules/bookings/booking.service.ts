import { pool } from "../../config/db";

const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // minimum 1 day
    return days <= 0 ? 1 : days;
};

const autoReturnExpiredBookings = async () => {
    const expired = await pool.query(
        `SELECT id, vehicle_id
         FROM bookings
         WHERE status = 'active' AND rent_end_date < CURRENT_DATE`
    );

    if (expired.rows.length === 0) return;

    for (const booking of expired.rows) {
        await pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [
            booking.id,
        ]);

        // ✅ FIX: vehicles column is availability_status
        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );
    }
};

/* ===================== CREATE BOOKING ===================== */
const createBooking = async (
    customer_id: number,
    vehicle_id: number,
    rent_start_date: string,
    rent_end_date: string
) => {
    // check vehicle exists and available
    const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
        vehicle_id,
    ]);

    if (vehicleResult.rows.length === 0) {
        return { error: "Vehicle not found" };
    }

    const vehicle = vehicleResult.rows[0];

    // ✅ FIX: check availability_status
    if (vehicle.availability_status !== "available") {
        return { error: "Vehicle is not available" };
    }

    // calculate total price
    const days = calculateDays(rent_start_date, rent_end_date);
    const total_price = Number(vehicle.daily_rent_price) * days;

    // create booking
    const bookingResult = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, "active"]
    );

    // update vehicle availability_status to booked
    await pool.query(
        `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
        [vehicle_id]
    );

    return bookingResult.rows[0];
};

/* ===================== GET BOOKINGS ===================== */
const getBookings = async (role: string, userId: number) => {
    // auto return expired first
    await autoReturnExpiredBookings();

    // admin sees all bookings
    if (role === "admin") {
        const result = await pool.query(`SELECT * FROM bookings ORDER BY id DESC`);
        return result.rows;
    }

    // customer sees only own bookings
    const result = await pool.query(
        `SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC`,
        [userId]
    );

    return result.rows;
};

/* ===================== UPDATE BOOKING ===================== */
const updateBookingStatus = async (
    bookingId: number,
    status: "cancelled" | "returned",
    role: string,
    userId: number
) => {
    // auto return expired first
    await autoReturnExpiredBookings();

    // get booking
    const bookingResult = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
    );

    if (bookingResult.rows.length === 0) {
        return { error: "Booking not found" };
    }

    const booking = bookingResult.rows[0];

    // customer can only cancel own booking
    if (role === "customer") {
        if (booking.customer_id !== userId) {
            return { error: "Access denied" };
        }

        if (status !== "cancelled") {
            return { error: "Customer can only cancel booking" };
        }

        // can cancel only before start date
        const today = new Date();
        const start = new Date(booking.rent_start_date);

        if (today >= start) {
            return { error: "You cannot cancel after booking start date" };
        }
    }

    // admin can return/cancel
    if (role === "admin") {
        if (status !== "returned" && status !== "cancelled") {
            return { error: "Invalid status" };
        }
    }

    // update booking status
    const updated = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [status, bookingId]
    );

    // if cancelled or returned, vehicle becomes available
    if (status === "cancelled" || status === "returned") {
        // ✅ FIX: vehicles column is availability_status
        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );
    }

    return updated.rows[0];
};

export const bookingServices = {
    createBooking,
    getBookings,
    updateBookingStatus,
};
