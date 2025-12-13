import { pool } from "../../config/db";

// Vehicle CRUD service (only DB work here)

const createVehicle = async (
    vehicle_name: string,
    type: string,
    registration_number: string,
    daily_rent_price: number,
    availability_status: string
) => {
    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result;
};

const getVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
    return result;
};

const getSingleVehicle = async (vehicleId: string) => {
    const id = Number(vehicleId);

    if (Number.isNaN(id)) {
        throw new Error("Invalid vehicle id");
    }

    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    return result;
};

const updateVehicle = async (
    vehicleId: string,
    vehicle_name: string,
    type: string,
    registration_number: string,
    daily_rent_price: number,
    availability_status: string
) => {
    const id = Number(vehicleId);

    if (Number.isNaN(id)) {
        throw new Error("Invalid vehicle id");
    }

    // 1) find old vehicle
    const oldVehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

    if (oldVehicle.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const vehicle = oldVehicle.rows[0];

    // 2) keep old values if new value not provided
    const updatedVehicleName = vehicle_name || vehicle.vehicle_name;
    const updatedType = type || vehicle.type;
    const updatedRegistrationNumber = registration_number || vehicle.registration_number;
    const updatedDailyRentPrice = daily_rent_price || vehicle.daily_rent_price;
    const updatedAvailabilityStatus = availability_status || vehicle.availability_status;

    // 3) update
    const result = await pool.query(
        `UPDATE vehicles
     SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5
     WHERE id = $6
     RETURNING *`,
        [
            updatedVehicleName,
            updatedType,
            updatedRegistrationNumber,
            updatedDailyRentPrice,
            updatedAvailabilityStatus,
            id,
        ]
    );

    return result;
};

const deleteVehicle = async (vehicleId: string) => {
    const id = Number(vehicleId);

    if (Number.isNaN(id)) {
        throw new Error("Invalid vehicle id");
    }

    // NOTE (teacher requirement): later you should block delete if there are active bookings.
    // You can add that check here when bookings table/module is done.

    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`, [id]);
    return result;
};

export const vehicleServices = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
