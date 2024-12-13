import React, { useState } from "react";
import { FiTrash2, FiPlus, FiX, FiEdit } from "react-icons/fi";
import "./ManagementEmployeePage.css"; // Import the external CSS file

const ManagementEmployeePage = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const branchs = [
    { id: 1, name: "Restaurant A" },
    { id: 2, name: "Restaurant B" },
    { id: 3, name: "Restaurant C" },
  ];

  const positions = [
    "Developer",
    "Sales",
    "Marketing",
    "Chef",
    "Manager",
    "Waiter",
  ];

  const [employees, setEmployees] = useState([
    {
      id: 1,
      branchId: 1,
      name: "John Doe",
      position: "Manager",
      email: "john@example.com",
      phone: "123-456-7890",
    },
    {
      id: 2,
      branchId: 1,
      name: "Jane Smith",
      position: "Chef",
      email: "jane@example.com",
      phone: "234-567-8901",
    },
    {
      id: 3,
      branchId: 2,
      name: "Mike Johnson",
      position: "Waiter",
      email: "mike@example.com",
      phone: "345-678-9012",
    },
  ]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.position.trim()) errors.position = "Position is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^(0\d{9})$/.test(formData.phone)) {
      errors.phone =
        "Invalid phone format (should be 10 digits starting with 0)";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      if (selectedEmployee) {
        // Editing existing employee
        const updatedEmployees = employees.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, ...formData } : emp
        );
        setEmployees(updatedEmployees);
      } else {
        // Adding new employee
        const newEmployee = {
          id: employees.length + 1,
          branchId: parseInt(selectedBranch),
          name: formData.name,
          position: formData.position,
          email: formData.email,
          phone: formData.phone,
        };
        setEmployees([...employees, newEmployee]);
      }

      // Reset form and close modal
      setShowAddForm(false);
      setFormData({ name: "", position: "", email: "", phone: "" });
      setSelectedEmployee(null); // Clear selected employee
    } else {
      setFormErrors(errors);
    }
  };

  const handleDelete = () => {
    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="employee-management-container">
      <div className="employee-management-content">
        <h1 className="heading">Restaurant Employee Management</h1>

        {/* Branch Selection */}
        <div className="branch-selection">
          <label htmlFor="branch" className="label">
            Select Branch
          </label>
          <select
            id="branch"
            className="select"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">--Select a branch--</option>
            {branchs.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Employee List */}
        <div className="employee-list">
          <div className="header">
            <h2>Employees</h2>
            <button onClick={() => setShowAddForm(true)} className="add-button">
              <FiPlus className="icon" /> Add Employee
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .filter(
                    (emp) =>
                      !selectedBranch ||
                      emp.branchId === parseInt(selectedBranch)
                  )
                  .map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>
                        {branchs.find((b) => b.id === employee.branchId)?.name}
                      </td>
                      <td>{employee.position}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td className="actions">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setFormData({
                              name: employee.name,
                              position: employee.position,
                              email: employee.email,
                              phone: employee.phone,
                            });
                            setShowAddForm(true); // Open the modal for editing
                          }}
                          className="edit-button"
                        >
                          <FiEdit className="icon" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowDeleteModal(true);
                          }}
                          className="delete-button"
                        >
                          <FiTrash2 className="icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedEmployee ? "Edit Employee" : "Add New Employee"}</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormErrors({});
                }}
                className="close-button"
              >
                <FiX className="icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="label">Name</label>
                <input
                  type="text"
                  className={`input ${formErrors.name ? "input-error" : ""}`}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {formErrors.name && <p className="error">{formErrors.name}</p>}
              </div>
              <div className="form-field">
                <label className="label">Position</label>
                <select
                  className={`select ${
                    formErrors.position ? "input-error" : ""
                  }`}
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                >
                  <option value="">--Select Position--</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
                {formErrors.position && (
                  <p className="error">{formErrors.position}</p>
                )}
              </div>
              <div className="form-field">
                <label className="label">Email</label>
                <input
                  type="email"
                  className={`input ${formErrors.email ? "input-error" : ""}`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {formErrors.email && (
                  <p className="error">{formErrors.email}</p>
                )}
              </div>
              <div className="form-field">
                <label className="label">Phone</label>
                <input
                  type="text"
                  className={`input ${formErrors.phone ? "input-error" : ""}`}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {formErrors.phone && (
                  <p className="error">{formErrors.phone}</p>
                )}
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {selectedEmployee ? "Update" : "Add"} Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Employee</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="close-button"
              >
                <FiX className="icon" />
              </button>
            </div>
            <p>
              Are you sure you want to delete {selectedEmployee.name} from the
              list?
            </p>
            <div className="modal-buttons">
              <button onClick={handleDelete} className="confirm-button">
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementEmployeePage;
