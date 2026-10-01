# Employee Management System - Frontend

A modern React + Vite single-page application for the Employee Management system, providing role-based user interfaces for employees, managers, and system administrators.

## Features

- **Role-Based Access Control (RBAC):** Dynamic navigation, page guards, and data filtering based on authenticated role (`user`, `manager`, `admin`).
- **Employee Directory:** Pagination, column sorting, active/inactive filters, and CSV roster export.
- **Compensation & Audit History:** Salary increment modal (flat amount / raise %) and detailed salary change history log.
- **Excel Hub:** Drag-and-drop batch employee importing from `.xlsx` / `.csv` and spreadsheet-driven bulk deletion.
- **Department & User Management:** Department directory, budget tracking, and admin user role promotion.
- **Authentication & Self-Service Password Reset:** Form-based login, token auth persistence, and forgot-password reset flow with token verification.

## Tech Stack

- **React 19**
- **Vite 8**
- **React Router 6** (`react-router-dom`)
- **Native CSS** (Custom responsive design with modern design tokens)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL (Optional)
By default, the client points to `http://127.0.0.1:8000`. You can override it by creating a `.env` file:
```env
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Start Development Server
```bash
npm run dev
```
Or run `start.bat` on Windows. The web application will be accessible at:
[http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```
Static production files will be output to `dist/`.

## Connected Backend
This frontend connects to the FastAPI backend located in `employee_api/`.
Ensure the backend is running on port 8000:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
