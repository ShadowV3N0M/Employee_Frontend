import { useState } from "react";
import { api } from "../api";
import Modal from "./Modal";
import PhoneInput from "./PhoneInput";
import { formatMoney } from "../format";
import { formatFullPhone, parsePhoneNumber } from "../phoneUtils";

// Used for both "Add employee" (employee = null) and "Edit employee".
export default function EmployeeForm({ employee, departments, role, onClose, onSaved }) {
  const editing = Boolean(employee);
  const isAdmin = role === "admin";
  const canEditSalary = !editing || isAdmin;

  const initialJoiningDate = () => {
    if (employee?.joining_date) {
      return String(employee.joining_date).slice(0, 10);
    }
    if (employee?.created_at) {
      return String(employee.created_at).slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  };

  const initialPhone = parsePhoneNumber(employee?.personal_phone);
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialPhone.code);
  const [customCountryCode, setCustomCountryCode] = useState(initialPhone.customCode);
  const [phoneDigits, setPhoneDigits] = useState(initialPhone.digits);

  const [form, setForm] = useState({
    Emp_ID: employee?.Emp_ID ?? "",
    F_Name: employee?.F_Name ?? "",
    L_Name: employee?.L_Name ?? "",
    Email: employee?.Email ?? "",
    Salary: employee?.Salary ?? "",
    Dept_ID: employee?.Dept_ID ?? departments[0]?.Dept_ID ?? "",
    Address: employee?.Address ?? "",
    joining_date: initialJoiningDate(),
    is_active: employee?.is_active ?? true,
    blood_group: employee?.blood_group ?? "",
    dob: employee?.dob ? String(employee.dob).slice(0, 10) : "",
    marital_status: employee?.marital_status ?? "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleDelete() {
    if (!isAdmin || !editing) return;
    setError("");
    setBusy(true);
    try {
      const res = await api.deleteEmployee(employee.Emp_ID);
      onSaved(
        res.message ||
          `Employee #${employee.Emp_ID} deleted and subsequent IDs updated successfully.`
      );
    } catch (err) {
      setError(err.message || "Failed to delete employee.");
      setBusy(false);
      setShowDeleteConfirm(false);
    }
  }

  const handleAutoGenerateEmail = () => {
    const f = form.F_Name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const l = form.L_Name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!f || !l) {
      setError("Please provide first and last name before generating email.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      Email: `${f}.${l[0]}@laesfera.co`,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const deptId = Number(form.Dept_ID);
    if (!deptId) return setError("Please choose a department.");

    if (!form.F_Name.trim()) return setError("First name is required.");
    if (!form.L_Name.trim()) return setError("Last name is required.");
    if (!form.Address.trim()) return setError("Address is required.");

    if (!editing) {
      const id = Number(form.Emp_ID);
      if (!Number.isInteger(id) || id <= 0) {
        return setError("Employee ID must be a positive whole number.");
      }
    }

    if (canEditSalary) {
      const salary = Number(form.Salary);
      if (form.Salary === "" || !Number.isFinite(salary) || salary < 0) {
        return setError("Salary must be a number that is 0 or more.");
      }
    }

    if (isAdmin && editing && form.Email.trim()) {
      if (!form.Email.includes("@") || form.Email.trim().length < 5) {
        return setError("Please enter a valid email address.");
      }
    }

    // Validate phone number if digits are entered
    if (phoneDigits) {
      if (phoneDigits.length !== 10) {
        return setError(`Mobile number must be exactly 10 digits (currently ${phoneDigits.length} digits).`);
      }
      if (phoneCountryCode === "custom" && (!customCountryCode || !customCountryCode.startsWith("+") || customCountryCode.length < 2)) {
        return setError("Please enter a valid custom country code starting with '+' (e.g. +353).");
      }
    }

    const formattedPhone = formatFullPhone(phoneCountryCode, customCountryCode, phoneDigits);

    setBusy(true);
    try {
      if (!editing) {
        const payload = {
          Emp_ID: Number(form.Emp_ID),
          F_Name: form.F_Name.trim(),
          L_Name: form.L_Name.trim(),
          Salary: Number(form.Salary),
          Dept_ID: deptId,
          Address: form.Address.trim(),
          joining_date: form.joining_date || undefined,
        };
        if (form.Email.trim()) {
          payload.Email = form.Email.trim().toLowerCase();
        }
        if (formattedPhone) payload.personal_phone = formattedPhone;
        if (form.blood_group.trim()) payload.blood_group = form.blood_group.trim().toUpperCase();
        if (form.dob) payload.dob = form.dob;
        if (form.marital_status.trim()) payload.marital_status = form.marital_status.trim();

        const res = await api.createEmployee(payload);
        onSaved(`Created ${res.employee.F_Name} ${res.employee.L_Name} — email ${res.employee.Email}`);
      } else {
        // Send only what actually changed
        const changes = {};
        if (form.F_Name.trim() !== (employee.F_Name || "")) {
          changes.F_Name = form.F_Name.trim();
        }
        if (form.L_Name.trim() !== (employee.L_Name || "")) {
          changes.L_Name = form.L_Name.trim();
        }
        if (deptId !== employee.Dept_ID) {
          changes.Dept_ID = deptId;
        }
        if (form.Address.trim() !== (employee.Address || "")) {
          changes.Address = form.Address.trim();
        }

        // Personal details updates
        const origPhone = employee?.personal_phone ? employee.personal_phone.trim() : "";
        if ((formattedPhone || "") !== origPhone) {
          changes.personal_phone = formattedPhone;
        }
        if (form.blood_group.trim() !== (employee.blood_group || "")) {
          changes.blood_group = form.blood_group.trim().toUpperCase() || null;
        }
        const origDob = employee.dob ? String(employee.dob).slice(0, 10) : "";
        if (form.dob !== origDob) {
          changes.dob = form.dob || null;
        }
        if (form.marital_status !== (employee.marital_status || "")) {
          changes.marital_status = form.marital_status || null;
        }

        // Admin-only updates
        if (isAdmin) {
          if (canEditSalary && Number(form.Salary) !== Number(employee.Salary)) {
            changes.Salary = Number(form.Salary);
          }
          if (form.Email.trim().toLowerCase() !== (employee.Email || "").toLowerCase()) {
            changes.Email = form.Email.trim().toLowerCase();
          }
          const origDate = employee.joining_date
            ? String(employee.joining_date).slice(0, 10)
            : (employee.created_at ? String(employee.created_at).slice(0, 10) : "");
          if (form.joining_date && form.joining_date !== origDate) {
            changes.joining_date = form.joining_date;
          }
          if (Boolean(form.is_active) !== Boolean(employee.is_active)) {
            changes.is_active = Boolean(form.is_active);
          }
        }

        if (Object.keys(changes).length === 0) {
          return onClose();
        }

        await api.updateEmployee(employee.Emp_ID, changes);
        onSaved(`Updated #${employee.Emp_ID} ${form.F_Name.trim()} ${form.L_Name.trim()}`);
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  const modalTitle = editing
    ? (isAdmin
        ? `Edit Employee #${employee.Emp_ID} (Admin Full Access)`
        : `Edit Employee #${employee.Emp_ID}`)
    : "Add Employee";

  return (
    <Modal title={modalTitle} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-grid">
        {error && <div className="alert error span-2">{error}</div>}

        {isAdmin && editing && (
          <div
            className="span-2"
            style={{
              padding: "8px 12px",
              background: "var(--surface-alt)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="badge role-admin">Admin</span>
            <span>You have full administrative privileges to edit all details: Name, Address, Salary, Email, Joining Date, and Status.</span>
          </div>
        )}

        {!editing && (
          <label>
            Employee ID
            <input type="number" min="1" value={form.Emp_ID} onChange={set("Emp_ID")} required />
          </label>
        )}

        <label>
          First name
          <input value={form.F_Name} onChange={set("F_Name")} required maxLength={50} />
        </label>

        <label>
          Last name
          <input value={form.L_Name} onChange={set("L_Name")} required maxLength={50} />
        </label>

        <label>
          Department
          <select value={form.Dept_ID} onChange={set("Dept_ID")} required>
            {departments.length === 0 && <option value="">No departments yet</option>}
            {departments.map((d) => (
              <option key={d.Dept_ID} value={d.Dept_ID}>
                {d.Dept_Name}
              </option>
            ))}
          </select>
        </label>

        {canEditSalary ? (
          <label>
            {editing ? "Salary" : "Starting salary"}
            <input type="number" min="0" step="0.01" value={form.Salary} onChange={set("Salary")} required />
          </label>
        ) : (
          <div className="readonly-field">
            <span>Salary</span>
            <strong>{formatMoney(employee.Salary)}</strong>
            <small className="muted">Only an admin can change an existing salary.</small>
          </div>
        )}

        <label className="span-2">
          Address
          <input value={form.Address} onChange={set("Address")} required maxLength={500} />
        </label>

        {/* Joining Date Field */}
        {isAdmin || !editing ? (
          <label>
            Joining Date
            <input
              type="date"
              value={form.joining_date}
              onChange={set("joining_date")}
              required
            />
          </label>
        ) : (
          <div className="readonly-field">
            <span>Joining Date</span>
            <strong>{form.joining_date || "—"}</strong>
            <small className="muted">Only an admin can edit joining date.</small>
          </div>
        )}

        {/* Status Field */}
        {editing ? (
          isAdmin ? (
            <label>
              Account Status
              <select
                value={form.is_active ? "active" : "inactive"}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive / Deactivated</option>
              </select>
            </label>
          ) : (
            <div className="readonly-field">
              <span>Status</span>
              <strong>{form.is_active ? "Active" : "Inactive"}</strong>
              <small className="muted">Only an admin can toggle account status.</small>
            </div>
          )
        ) : (
          <div className="readonly-field">
            <span>Initial Status</span>
            <strong>Active</strong>
            <small className="muted">New employee will be created active.</small>
          </div>
        )}

        {/* Email Field */}
        {editing ? (
          isAdmin ? (
            <div className="span-2">
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Official Email</span>
                  <button
                    type="button"
                    className="link small"
                    onClick={handleAutoGenerateEmail}
                    style={{ fontSize: "0.8rem", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Auto-generate from Name
                  </button>
                </div>
                <input
                  type="email"
                  value={form.Email}
                  onChange={set("Email")}
                  placeholder="employee@company.com"
                  required
                />
              </label>
            </div>
          ) : (
            <div className="readonly-field span-2">
              <span>Official Email</span>
              <strong>{employee.Email || "—"}</strong>
              <small className="muted">Only an admin can edit official company email.</small>
            </div>
          )
        ) : (
          <div className="span-2">
            {isAdmin ? (
              <label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Official Email (Optional)</span>
                  <button
                    type="button"
                    className="link small"
                    onClick={handleAutoGenerateEmail}
                    style={{ fontSize: "0.8rem", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Auto-generate from Name
                  </button>
                </div>
                <input
                  type="email"
                  value={form.Email}
                  onChange={set("Email")}
                  placeholder="Leave empty to auto-generate (e.g. john.d@laesfera.co)"
                />
              </label>
            ) : (
              <p className="muted small">
                The email (like <code>firstname.l@laesfera.co</code>) is generated automatically.
              </p>
            )}
          </div>
        )}

        {/* Personal Details Section */}
        <div className="span-2" style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em" }}>
            Personal Information (Self-Service Profile)
          </h4>
        </div>

        <PhoneInput
          countryCode={phoneCountryCode}
          setCountryCode={setPhoneCountryCode}
          customCode={customCountryCode}
          setCustomCode={setCustomCountryCode}
          digits={phoneDigits}
          setDigits={setPhoneDigits}
          label="Personal Mobile Phone"
        />

        <label>
          Blood Group
          <select value={form.blood_group} onChange={set("blood_group")}>
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={form.dob}
            onChange={set("dob")}
          />
        </label>

        <label>
          Marital Status
          <select value={form.marital_status} onChange={set("marital_status")}>
            <option value="">Select marital status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </label>

        {showDeleteConfirm && (
          <div
            className="alert error span-2"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              border: "1px solid var(--danger-border)",
              marginTop: "8px",
            }}
          >
            <div>
              <strong style={{ fontSize: "0.95rem" }}>
                Permanently Delete Employee #{employee.Emp_ID}?
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.85rem", lineHeight: 1.5 }}>
                Are you sure you want to permanently delete <strong>{employee.F_Name} {employee.L_Name}</strong> and their salary history records?
                <br />
                <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>
                  ⚡ Auto-Resequencing: All subsequent employee IDs (&gt; #{employee.Emp_ID}) will automatically decrement by 1 so IDs remain consecutive without gaps.
                </span>
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn danger small"
                onClick={handleDelete}
                disabled={busy}
              >
                {busy ? "Deleting & Resequencing…" : "Confirm Permanent Delete"}
              </button>
            </div>
          </div>
        )}

        <div
          className="span-2"
          style={{
            display: "flex",
            justifyContent: isAdmin && editing ? "space-between" : "flex-end",
            alignItems: "center",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border)",
          }}
        >
          {isAdmin && editing ? (
            <button
              type="button"
              className="btn danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={busy || showDeleteConfirm}
              style={{ fontSize: "0.85rem", padding: "8px 14px" }}
              title="Permanently remove this employee and auto-update all subsequent IDs"
            >
              🗑️ Delete Employee
            </button>
          ) : <span />}

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" className="btn ghost" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="btn primary" disabled={busy || showDeleteConfirm}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create employee"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
