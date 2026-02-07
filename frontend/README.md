# Construction Management System - Backend API

A complete Node.js & Express backend for managing construction projects, covering the entire lifecycle from company registration to invoice management.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install express mysql2 dotenv cors body-parser bcryptjs jsonwebtoken

```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=construction_db
JWT_SECRET=your_super_secret_key

```

### 3. Database Setup

1. Create a MySQL database named `construction_db`.
2. Run the **Schema SQL Script** (to create tables).
3. Run the **Foreign Key Script** (to link tables).

### 4. Run the Server

```bash
node server.js
# OR if using nodemon
npm run dev

```

Server runs on: `http://localhost:5000`

---

## 📚 API Documentation (By User Flow)

### 🟢 Flow 1: Company Registration (Public)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register-company` | Submit "Get Started" form (Status: Pending) |
| `POST` | `/api/auth/admin/approve-company` | Admin approves company & auto-generates Owner credentials |

### 🔐 Flow 2: Authentication (All Users)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login with Email & Password. Returns `token` & `role`. |

### 👤 Flow 2 & 4: User Management

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/users/create` | Owner / Contractor | Create sub-users. <br>

<br>Owner creates: `Project Manager`, `Contractor` <br>

<br>Contractor creates: `Site Engineer`, `Supplier` |

### 🏗️ Flow 3: Project Management (Project Manager)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/projects/create` | Create a new project with budget |
| `GET` | `/api/projects/contractors` | List available contractors for assignment |
| `POST` | `/api/projects/assign` | Assign a Contractor to a Project |
| `GET` | `/api/projects/list` | View my projects |

### 👷 Flow 4 & 5: Site Operations (Contractor & Engineer)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/reports` | Site Engineer | Submit Daily Progress Report |
| `GET` | `/api/reports` | Contractor | View Reports (Filter by `project_id`, `period=day/month/year`, `date`) |
| `POST` | `/api/materials/request` | Site Engineer | Request materials from Contractor |
| `GET` | `/api/materials/my-requests` | Site Engineer | Check status of material requests |

### 📦 Flow 6: Procurement (Contractor & Supplier)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/procurement/suppliers` | Contractor | List my created suppliers |
| `POST` | `/api/procurement/purchase-orders` | Contractor | Create PO & send to Supplier |
| `GET` | `/api/procurement/my-orders` | Supplier | View received Purchase Orders |
| `POST` | `/api/procurement/invoices` | Supplier | Upload & submit Invoice for a PO |

---

## 🔑 User Roles & Permissions Matrix

| Role | Can Create | Can View |
| --- | --- | --- |
| **Owner** | Project Managers, Contractors | All Company Data |
| **Project Manager** | Projects, Assignments | My Projects |
| **Contractor** | Site Engineers, Suppliers, POs | Reports, Invoices |
| **Site Engineer** | Daily Reports, Material Requests | My Requests |
| **Supplier** | Invoices | Received POs |

---

## 🧪 Testing with Postman

1. **Login first:** Send a POST to `/api/auth/login`.
2. **Copy the Token:** Copy the `token` string from the response.
3. **Authorize Requests:** In Postman, go to the **Headers** tab for any protected route and add:
* Key: `Authorization`
* Value: `Bearer <your_token_here>`



```