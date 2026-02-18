# 🏗️ BuildFlow: Enterprise Construction ERP

**BuildFlow** is a high-performance, full-stack Enterprise Resource Planning (ERP) solution designed for the construction industry. Developed to bridge the gap between corporate offices and ground-level sites, it provides a unified ecosystem for project oversight, procurement, and daily progress tracking.

## 🌟 Key Features

* **Role-Based Access Control (RBAC):** Six specialized dashboards (Admin, Owner, PM, Contractor, Site Engineer, Supplier) ensure data security and operational focus.
* **Dynamic Industrial UI:** A high-end dark-themed interface featuring glassmorphism effects and fluid animations powered by Framer Motion.
* **Real-time Site Reporting:** Site Engineers can submit Daily Progress Reports (DPR), track attendance, and log material usage.
* **Procurement Lifecycle:** End-to-end management of Purchase Orders (PO) and material tracking from request to delivery.
* **Financial Oversight:** High-level analytics for Owners and PMs to monitor project health and budget adherence.

---

## 🛠️ Tech Stack

### **Frontend**

* **React 18** (Functional Components & Hooks)
* **Tailwind CSS** (Utility-first styling)
* **Framer Motion** (Production-grade animations)
* **Lucide React** (Consistent iconography)
* **React-Toastify** (Global notification system)

### **Backend**

* **Node.js & Express.js** (Modular REST API)
* **MySQL** (Relational data management)
* **JWT (JSON Web Tokens)** (Secure, stateless authentication)
* **Bcrypt.js** (Password hashing for security)

---

## 📂 Project Structure

```text
BuildFlow/
├── frontend/                # React.js Client
│   ├── src/
│   │   ├── pages/           # Landing, Login, and Dashboards
│   │   ├── components/      # PrivateRoutes & UI Elements
│   │   └── assets/          # Project images (Banner, Footer)
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── routes/          # Auth, Projects, Reports, Procurement
│   │   ├── controllers/     # Business logic
│   │   └── models/          # Database queries
└── .env                     # Environment variables (Internal use)

```

---

## 🚀 Getting Started

### 1. Prerequisites

* Node.js (v16+)
* MySQL Server
* NPM or Yarn

### 2. Database Setup

Create a database named `construction_db` in your MySQL environment. You can use the following schema logic for your core tables:

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=construction_db
JWT_SECRET=YOUR_SUPER_SECRET_KEY

```

### 4. Installation

**Step 1: Install Backend Dependencies**

```bash
cd backend
npm install
npm run dev

```

**Step 2: Install Frontend Dependencies**

```bash
cd frontend
npm install
npm start

```

---

## 📊 API Reference

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register-company` | POST | Onboards a new company and admin. |
| `/api/auth/login` | POST | Authenticates user and returns JWT. |
| `/api/projects` | GET/POST | Manages project lifecycles. |
| `/api/reports/dpr` | POST | Submits Daily Progress Reports. |
| `/api/procurement/po` | POST | Generates Purchase Orders. |

---

## 🔐 Security Features

* **Protected Routes:** Frontend routes are guarded by a `PrivateRoute` component that verifies JWT roles before granting access.
* **Password Salting:** Sensitive user data is encrypted using 10-round salt Bcrypt hashing.
* **Input Sanitization:** Express middleware ensures incoming JSON payloads are parsed and validated.

---

## 🎓 Academic Context

This project serves as a capstone for **B.Tech IT (Semester 6)** at **Mumbai University**. It addresses real-world challenges in urban construction management through digital transparency and automated resource tracking.

---

### 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

**Created by Abizer Saify & Murtaza Dhanerwala**
