# Employee Management System - Frontend

A modern React + Vite single-page application for the Employee Management system, providing role-based user interfaces for employees, managers, and system administrators.

---

## Tech Stack

- **React 19** (`react`, `react-dom`)
- **Vite 8** (Ultra-fast build tool & dev server)
- **React Router 6** (`react-router-dom` for declarative routing and auth guards)
- **Native CSS** (Custom responsive design with modern CSS design tokens)

---

## Key Features & UI Capabilities

- **Role-Based Access Control (RBAC):**
  - **`user`:** Directory view (Name, Email, Dept). Salaries and home addresses are automatically withheld by the API and hidden from the UI.
  - **`manager`:** Complete employee cards, address viewing, salary viewing, employee add/edit modal, and salary change history audit log.
  - **`admin`:** Full superuser capabilities — Excel Hub, salary raises/cuts, user account role promotion (`user` ➔ `manager` ➔ `admin`), account status toggling, and deactivation/restoration.
- **Employee Directory:** Pagination (10 per page), column sorting (ID, Name, Dept, Salary), active/inactive filtering toggle, and CSV roster export.
- **Excel & CSV Hub:** Modal for uploading `.xlsx` and `.csv` files for batch employee creation, sample CSV template download, and spreadsheet-driven bulk deletion.
- **Salary Management:** Modal for setting exact salaries or applying raises/cuts with real-time validation and change tracking.
- **Salary History Audit Log:** Modal displaying full timestamped salary revision records with previous salary, new salary, and who approved the change.
- **Self-Service Password Reset:** Forgot-password request with token verification, real-time validation, and offline development fallback links.

---

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

**Option A (1-Click Launcher):**
Double-click `start.bat` in the project root.

**Option B (Terminal):**
```bash
npm run dev
```
The application will be accessible at: **[http://localhost:5173](http://localhost:5173)**

### 4. Build for Production
```bash
npm run build
```
Static production files will be output to `dist/`.

---

## Connected Backend

This frontend connects to the FastAPI backend located in `employee_api/`.
Ensure the backend is running on port 8000:
```bash
cd ../employee_api
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- Interactive API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

## Project Structure

```
employee_frontend/
├── package.json               # React 19, Vite 8, React Router dependencies
├── vite.config.js             # Vite config (port 5173, host 0.0.0.0)
├── index.html                 # Single page application entry HTML
├── .env.example               # Backend API URL environment template
├── .gitignore                 # Excludes node_modules/, dist/, and .env
├── start.bat                  # 1-click Windows installer and dev launcher
├── README.md                  # This documentation
└── src/
    ├── main.jsx               # Entry point with BrowserRouter and AuthProvider
    ├── App.jsx                # Route definitions & RequireAuth route guards
    ├── auth.jsx               # Authentication context, session, and role helpers
    ├── api.js                 # Centralized API service for all FastAPI endpoints
    ├── format.js              # Currency (INR) and date formatting utilities
    ├── styles.css             # Global responsive styling and modal layout
    ├── components/
    │   ├── Layout.jsx         # Responsive top navigation bar with user profile
    │   ├── Modal.jsx          # Reusable accessible modal dialog
    │   ├── EmployeeForm.jsx   # Add/Edit employee modal with auto-email preview
    │   ├── SalaryModal.jsx    # Admin salary revision modal (set / increment)
    │   ├── HistoryModal.jsx   # Audit history table for salary adjustments
    │   └── ExcelImportModal.jsx # Excel/CSV batch import & bulk delete hub
    └── pages/
        ├── Login.jsx          # Login, Registration, and Forgot-Password request
        ├── ResetPassword.jsx  # Token verification and password reset screen
        ├── Employees.jsx      # Paginated directory table, filters, and actions
        ├── Departments.jsx    # Department listing, budget, and department creation
        └── Users.jsx          # Admin user management and role promotion
```

---

## Recent Project Updates & Frontend Changelog

*(In sync with `employee_api` Backend Updates)*

### 1. Standalone Project Migration
- Extracted the frontend into the standalone `employee_frontend/` workspace to permanently eliminate Windows file-locking issues (`EPERM` / `Access is denied`) caused by accidental local Node distribution copies.
- Upgraded to **React 19** and **Vite 8** with **React Router 6**.

### 2. Excel Hub Integration (`ExcelImportModal.jsx`)
- Built an interactive batch processing modal supporting both `.xlsx` and `.csv` files.
- Added direct download link for the pre-formatted `employee_template.csv` sample file.
- Added spreadsheet-driven bulk deletion with option for soft deactivation or permanent removal.

### 3. Password Reset Workflow (`ResetPassword.jsx`)
- Built full reset token verification UI parsing URL parameters (`?token=...`).
- Integrated development console fallback: when SMTP is not configured, local reset links can be clicked directly to test password changes offline.

### 4. Role-Based Dynamic UI & Privacy Masking
- Strict client-side route guarding matching the backend RBAC matrix:
  - Unauthorized users are automatically redirected to `/login`.
  - Plain `user` accounts cannot view compensation, home addresses, or administrative buttons.
  - Managers can view full details, add employees, and inspect salary revision history.
  - Admins have full access to salary revision, Excel Hub, user role promotion, and deactivation/restoration.

### 5. Automated Windows Launcher (`start.bat`)
- Created a 1-click batch launcher that automatically checks dependencies, runs `npm install`, and starts the development server on `0.0.0.0:5173`.

---

## Roadmap & Features Status

*(Fully synchronized with backend roadmap)*

- [x] **Role-Based UI & Access Guarding** - Strict view controls across `user`, `manager`, and `admin`
- [x] **Excel & CSV Hub** - Drag-and-drop batch importing and spreadsheet bulk deletion
- [x] **Self-Service Password Reset UI** - Token verification and reset password flow
- [x] **Salary Management & Audit Log Modal** - Live salary revisions with change history
- [x] **CSV Directory Export** - Dynamic export with role-based privacy masking
- [ ] **PDF Export of Reports** - UI buttons to export formatted employee rosters, department expense breakdowns, and salary audit logs to downloadable PDF files *(Backend PDF module in progress)*
- [ ] **Attendance & Leave Management UI** - Clock-in/out widget, leave balance cards, and manager approval table *(Backend attendance module in progress)*
- [ ] **Dark / Light Theme Toggle** - Theme selector using CSS custom properties
- [ ] **Analytics Dashboard** - Visual charts for company payroll distribution, department headcounts, and budget utilization

---

## Git Version Control & GitHub

Push this frontend repository to GitHub with:

```powershell
cd D:\Sagar\Python\employee_frontend
git init
git add .
git commit -m "feat: initial commit for React 19 + Vite frontend"
git branch -M main
git remote add origin https://github.com/ShadowV3N0M/Employee_Frontend.git
git push -u origin main
```

Daily update cycle:
```powershell
git status                    # Check changed files
git add .                     # Stage changes
git commit -m "Your message"  # Commit milestone
git push                      # Push to GitHub
```

---
*Last updated: 2026-10-01 (In sync with backend v2.0)*
