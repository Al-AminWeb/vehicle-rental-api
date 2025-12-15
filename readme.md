

---

# 🚗 Vehicle Rental API

A backend REST API for a vehicle rental system built with **Node.js, Express, TypeScript, and PostgreSQL**.
The API supports **user authentication**, **vehicle management**, and **booking management** with **role-based access control**.

---

## 🔗 Live API URL

**Base URL:**

```
https://vehicle-rental-api-eta.vercel.app
```

---

## 📌 Features

### 🔐 Authentication

* User signup
* User signin with JWT
* Role-based access (admin / customer)

### 👤 Users

* Get all users (admin only)
* Update user
* Delete user

### 🚘 Vehicles

* Create vehicle
* Get all vehicles
* Get single vehicle
* Update vehicle
* Delete vehicle
* Vehicle availability management

### 📅 Bookings

* Create booking
* Get bookings

    * Admin: all bookings
    * Customer: own bookings only
* Cancel booking (customer)
* Return booking (admin)
* Automatic vehicle availability update

---

## 🧰 Tech Stack

* **Node.js**
* **Express.js**
* **TypeScript**
* **PostgreSQL**
* **JWT Authentication**
* **bcryptjs**
* **Vercel** (deployment)

---

## 📁 Project Structure

```
src/
 ├── config/
 │   ├── db.ts
 │   └── index.ts
 ├── middleware/
 │   └── auth.ts
 ├── modules/
 │   ├── auth/
 │   ├── users/
 │   ├── vehicles/
 │   └── bookings/
 ├── index.ts
```

---

## 🔑 Authentication

After signin, a JWT token is returned.

### Protected routes require token:

Add the token in request headers:

```
authorization: <JWT_TOKEN>
```

---

## 📌 API Endpoints

### Auth

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | `/api/v1/auth/signup` | User signup |
| POST   | `/api/v1/auth/signin` | User signin |

### Users

| Method | Endpoint            | Access |
| ------ | ------------------- | ------ |
| GET    | `/api/v1/users`     | Admin  |
| PUT    | `/api/v1/users/:id` | Admin  |
| DELETE | `/api/v1/users/:id` | Admin  |

### Vehicles

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/api/v1/vehicles`     |
| GET    | `/api/v1/vehicles`     |
| GET    | `/api/v1/vehicles/:id` |
| PUT    | `/api/v1/vehicles/:id` |
| DELETE | `/api/v1/vehicles/:id` |

### Bookings

| Method | Endpoint                      | Access         |
| ------ | ----------------------------- | -------------- |
| POST   | `/api/v1/bookings`            | Customer/Admin |
| GET    | `/api/v1/bookings`            | Customer/Admin |
| PUT    | `/api/v1/bookings/:bookingId` | Customer/Admin |

---

## 🛠️ Environment Variables

Create a `.env` file:

```env
PORT=5000
CONNECTION_STR=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

Server will run at:

```
http://localhost:5000
```

---

## ✅ Booking Rules (Business Logic)

* Vehicle must be available to book
* Total price = daily rent × number of days
* Vehicle becomes booked after booking
* Vehicle becomes available after cancel/return
* Customer can cancel only before start date
* Admin can mark booking as returned

---

## 👨‍🎓 Author

**Md Alamin**
Backend Project – Vehicle Rental API

---

