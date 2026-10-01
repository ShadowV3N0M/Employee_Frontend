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
- **Interactive Employee Profile Modal (`EmployeeDetailModal.jsx`):** Clickable table rows and dedicated "View" action button. Displays role-tailored modal views: superuser full access for `admin`, management view for `manager`, and sanitized directory view with confidentiality notice for standard `user`.
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
    ├── theme.jsx              # Theme context, state persistence & media listener
    ├── api.js                 # Centralized API service for all FastAPI endpoints
    ├── format.js              # Currency (INR) and date formatting utilities
    ├── styles.css             # Global responsive styling and CSS custom properties (Light/Dark)
    ├── components/
    │   ├── Layout.jsx         # Responsive top navigation bar with user profile & theme toggle
    │   ├── ThemeToggle.jsx    # Sleek Light / Dark mode toggle button
    │   ├── Modal.jsx          # Reusable accessible modal dialog
    │   ├── EmployeeDetailModal.jsx # Role-based employee profile popup (admin/manager/user)
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

### 6. Interactive Role-Based Employee Detail Popup (`EmployeeDetailModal.jsx`)
- **Interactive Row Click & Hover State:** All table rows now have pointer cursors and subtle `#f0f4ff` hover states. Clicking any employee row triggers an individual profile modal.
- **Dedicated "View" Button:** Added a `View` action button in the table actions column for all users (including standard `user` accounts).
- **Role-Based Data Separation:**
  - **`admin`:** Comprehensive view containing profile header, initials avatar, department, status, formatted salary, home address, created/updated timestamps, and full action controls (`Deactivate/Restore`, `Salary Revision`, `Edit Profile`, `Salary History`).
  - **`manager`:** Complete view with compensation, address, timestamps, plus `Edit Profile` and `Salary History` actions.
  - **`user`:** Sanitized directory view (Name, Email, Department, Status) with an informative confidentiality notice informing that compensation and residential address are restricted to managers and administrators.
- **Event Isolation:** Handled `e.stopPropagation()` on row action buttons to allow direct triggering of Edit/History/Salary modals without opening the detail modal.

### 7. Full Admin User Management CRUD (`Users.jsx`)
- **Direct User Creation (`+ Add User` Modal):** Admins can provision new users directly with initial role assignment (`user`, `manager`, `admin`), password, and optional email address.
- **Permanent User Deletion (`DELETE /auth/users/{username}`):** Added a dedicated **Delete** button with a confirmation safety guard (`window.confirm`). Permanently deletes the user account while preventing self-deletion.
- **Account Status Toggling:** Admins can quickly activate or deactivate accounts with immediate server synchronization.
- **Real-Time Search & Filtering:** Instant filter bar to search users by username, email, or assigned role.

### 8. Dark / Light Theme System & Animated Celestial Switch (`theme.jsx`, `ThemeToggle.jsx`, `styles.css`)
- **Interactive Celestial Toggle Switch:** Custom-designed pill track with animated sliding thumb, elastic bouncy spring physics (`cubic-bezier(0.34, 1.56, 0.64, 1)`), spinning golden sun with ray burst animation in light mode, and glowing crescent moon with twinkling sky stars in dark mode.
- **Dynamic Text Slide Transition:** The "Light" / "Dark" label text glides smoothly with a micro-entrance animation upon theme change.
- **Hardware-Accelerated Page Layout Transitions (View Transitions API):**
  - Uses native `document.startViewTransition` with a dynamic circular clip-path expansion (`circle(0px) ➔ circle(endRadius)`) originating precisely from the button's click coordinates `(clientX, clientY)`.
  - The new theme radiates smoothly across the entire page layout like an expanding ripple of light/darkness.
- **Coordinated Universal Fallback:**
  - For browsers without View Transitions, adds a `.theme-transitioning` class for 550ms that coordinates all CSS custom properties simultaneously and casts an ambient radial light sweep (`::after`) across the viewport.
- **Accessibility & System Preferences:** Full support for OS-level `prefers-color-scheme: dark` and immediate fallback disabling for `prefers-reduced-motion: reduce`. User choices are saved in `localStorage`.

### 9. 3D Card Flip Transition Animation (`Login.jsx`, `styles.css`)
- **Perspective 3D Architecture:** Built a dynamic two-sided card wrapper (`.auth-flip-container` and `.auth-flip-card`) utilizing CSS 3D transforms (`perspective: 1200px`, `transform-style: preserve-3d`, `rotateY(180deg)`).
- **Seamless Mode Switching:** Smooth 0.65s cubic-bezier flip animation when transitioning between **Sign In** (Front Face), **Account Registration** (Back Face), and **Password Reset** modes without abrupt page reloads or layout jumps.
- **Accessibility & Focus Guarding:** Form inputs on the unfocused side are automatically disabled and removed from the keyboard tab sequence (`tabIndex={-1}`) to prevent accidental input while the card is rotated.
- **Reduced Motion Fallback:** Respects user accessibility preferences via `@media (prefers-reduced-motion: reduce)`, smoothly disabling 3D rotation and providing instant display switching.

---

## Roadmap & Features Status

*(Fully synchronized with backend roadmap)*

- [x] **Role-Based UI & Access Guarding** - Strict view controls across `user`, `manager`, and `admin`
- [x] **Dark / Light Theme Toggle** - Theme selector using CSS custom properties, persistent state & system media query
- [x] **3D Card Flip Transition Animation** - Smooth 3D card flip between Login, Register, and Forgot Password with accessibility safeguards
- [x] **Full Admin User CRUD** - Create user modal, role promotion, status toggling, and permanent deletion with self-delete protection
- [x] **Interactive Role-Based Employee Profile Popup** - Row-click modal with role-based field masking and dynamic action controls
- [x] **Excel & CSV Hub** - Drag-and-drop batch importing and spreadsheet bulk creation/deletion of records
- [x] **Self-Service Password Reset UI** - Token verification and reset password flow
- [x] **Salary Management & Audit Log Modal** - Live salary revisions with change history
- [x] **CSV Directory Export** - Dynamic export with role-based privacy masking
- [ ] **PDF Export of Reports** - UI buttons to export formatted employee rosters, department expense breakdowns, and salary audit logs to downloadable PDF files *(Backend PDF module in progress)*
- [ ] **Attendance & Leave Management UI** - Clock-in/out widget, leave balance cards, and manager approval table *(Backend attendance module in progress)*
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
git remote add origin https://github.com/<your_Username>/Employee_Frontend.git ##ShadowV3N0M
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
