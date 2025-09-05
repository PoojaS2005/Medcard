# pooja-medcard

Med Card is a simple MERN stack application designed for **doctors** and **patients** to manage appointments and prescriptions. It provides a unified login system, role-based dashboards, and CRUD operations for appointments and prescriptions.

Built with **Vite + React** for the frontend, **Node.js + Express** for the backend, and **MongoDB** for the database. Styling is done with **Tailwind CSS**.

---

## Features

### User Roles

* **Doctor**:

  * View all patients assigned via appointments.
  * Add, edit, and delete prescriptions for patients.
  * See upcoming appointments.

* **Patient**:

  * Book appointments with doctors.
  * View their own prescriptions and diagnostic reports.

### Appointments

* Patients can book appointments with doctors.
* Doctors can view their patients and manage appointment schedules.
* Buttons dynamically show **Add** or **Edit** depending on prescription existence.

### Prescriptions

* Doctors can create new prescriptions for a patient.
* Edit or delete existing prescriptions.
* Patients can only view their prescriptions.

### Authentication

* Unified login/register system.
* JWT-based authentication with role-based access control.

---

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router
* **Backend:** Node.js, Express, JWT Authentication
* **Database:** MongoDB (via Mongoose)
* **Other:** Axios for API calls, CORS

---

## Installation

1. **Clone the repository:**

```bash
git clone <repo-url>
cd med-card
```

2. **Backend Setup:**

```bash
cd backend
npm install
```

* Create a `.env` file:

```env
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
```

* Start the backend server:

```bash
npm run dev
```

3. **Frontend Setup:**

```bash
cd ../frontend
npm install
npm run dev
```

* The frontend will usually run on `http://localhost:5173` (Vite default).

---

## Folder Structure

```
backend/
 ├─ models/          # MongoDB models (User, Appointment, Prescription)
 ├─ routes/          # API routes (auth, users, appointments, prescriptions)
 ├─ middleware/      # JWT auth middleware
 ├─ config/          # Database connection
 └─ server.js        # Entry point

frontend/
 ├─ src/
 │   ├─ components/  # Reusable components (Navbar, SelectDropdown)
 │   ├─ pages/       # Pages (Login, Register, Dashboard, Appointments, Prescriptions)
 │   └─ api.js       # Axios instance
 └─ vite.config.js   # Vite config
```

---

## Usage

1. **Register/Login** as a doctor or patient.

2. **Patients**:

   * Book an appointment with a doctor from the dashboard.
   * Check upcoming appointments from the navbar.
   * View prescriptions from the navbar.

3. **Doctors**:

   * See patients with appointments in the dashboard.
   * Add/Edit/Delete prescriptions for each patient.
   * Navigate appointments and prescriptions from the navbar.

---

## API Endpoints

* **Auth**

  * `POST /api/auth/register` – Register a user
  * `POST /api/auth/login` – Login and receive JWT

* **Users**

  * `GET /api/doctors` – Get list of doctors
  * `GET /api/patients` – Get list of patients

* **Appointments**

  * `POST /api/appointments` – Create appointment
  * `GET /api/appointments` – List appointments for logged-in user

* **Prescriptions**

  * `POST /api/prescriptions` – Add prescription
  * `PUT /api/prescriptions/:id` – Update prescription
  * `DELETE /api/prescriptions/:id` – Delete prescription
  * `GET /api/prescriptions` – List prescriptions (filtered by role/patient)

---
