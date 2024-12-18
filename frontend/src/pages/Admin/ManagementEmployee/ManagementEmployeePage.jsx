import React, { useState, useEffect } from "react";
import {
  FiTrash2,
  FiPlus,
  FiX,
  FiEdit,
  FiFilter,
  // FiSort,
} from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import "./ManagementEmployeePage.css"; // Import the external CSS file

const ManagementEmployeePage = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailedEmployee, setDetailedEmployee] = useState(null);

  const [formData, setFormData] = useState({
    branchId: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    hire_date: "",
    quit_date: "",
    date_of_birth: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const [filterOptions, setFilterOptions] = useState({
    branchId: "",
    position: "",
    sortBy: "",
    sortOrder: "asc",
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // Thêm trạng thái tìm kiếm

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5; // Adjust as needed

  const branches = [
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
      phone: "0123456789",
      address: "123 Main St, City A",
      gender: "Male",
      hire_date: "2022-01-15",
      quit_date: null,
      date_of_birth: "1990-06-20",
    },
    {
      id: 2,
      branchId: 1,
      name: "Jane Smith",
      position: "Chef",
      email: "jane@example.com",
      phone: "0234567890",
      address: "456 Elm St, City B",
      gender: "Female",
      hire_date: "2020-09-10",
      quit_date: null,
      date_of_birth: "1988-12-12",
    },
  ]);

  // Filtered and Sorted Employees
  const [displayEmployees, setDisplayEmployees] = useState([]);

  useEffect(() => {
    let filtered = [...employees];

    // Apply Search Filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply Other Filters
    if (isFilterApplied) {
      if (filterOptions.branchId) {
        filtered = filtered.filter(
          (emp) => emp.branchId === parseInt(filterOptions.branchId)
        );
      }
      if (filterOptions.position) {
        filtered = filtered.filter(
          (emp) => emp.position === filterOptions.position
        );
      }
    }

    // Apply Sorting
    if (filterOptions.sortBy) {
      filtered.sort((a, b) => {
        if (a[filterOptions.sortBy] < b[filterOptions.sortBy])
          return filterOptions.sortOrder === "asc" ? -1 : 1;
        if (a[filterOptions.sortBy] > b[filterOptions.sortBy])
          return filterOptions.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setDisplayEmployees(filtered);
    setCurrentPage(1); // Reset to first page when filter/sort/search changes
  }, [employees, isFilterApplied, filterOptions, searchTerm]);

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
    if (!formData.branchId) {
      errors.branchId = "Branch is required";
    }

    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.hire_date) errors.hire_date = "Hire date is required";
    if (!formData.date_of_birth)
      errors.date_of_birth = "Date of birth is required";

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      if (selectedEmployee) {
        // Editing existing employee
        const updatedEmployees = employees.map((emp) =>
          emp.id === selectedEmployee.id
            ? { ...emp, ...formData, branchId: parseInt(formData.branchId) }
            : emp
        );
        setEmployees(updatedEmployees);
      } else {
        // Adding new employee
        const newEmployee = {
          id:
            employees.length > 0
              ? Math.max(...employees.map((emp) => emp.id)) + 1
              : 1,
          branchId: parseInt(formData.branchId),
          name: formData.name,
          position: formData.position,
          email: formData.email,
          phone: formData.phone,
        };
        setEmployees([...employees, newEmployee]);
      }

      // Reset form and close modal
      setShowAddForm(false);
      setFormData({
        branchId: "",
        name: "",
        position: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        hire_date: "",
        quit_date: "",
        date_of_birth: "",
      });
      setSelectedEmployee(null); // Clear selected employee
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const handleDelete = () => {
    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  // Pagination Logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = displayEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(displayEmployees.length / employeesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="employee-management-container">
      <div className="employee-management-content">
        <h1 className="heading">Restaurant Employee Management</h1>

        {/* Filter and Sort Section */}
        <div className="filter-sort-section">
          {/* Search Bar */}
          <div className="search-bar-emp">
            <FaSearch className="search-icon-emp" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-emp"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear Search"
              >
                <FiX />
              </button>
            )}
          </div>
          <div className="filter-sort-controls">
            <div className="filter-field">
              <label htmlFor="filter-branch" className="label">
                Branch
              </label>
              <select
                id="filter-branch"
                className="select"
                value={filterOptions.branchId}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    branchId: e.target.value,
                  })
                }
              >
                <option value="">--All Branches--</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="filter-position" className="label">
                Department
              </label>
              <select
                id="filter-position"
                className="select"
                value={filterOptions.position}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    position: e.target.value,
                  })
                }
              >
                <option value="">--All Departments--</option>
                {positions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="filter-field">
              <label htmlFor="sort-by" className="label">
                Sort By
              </label>
              <select
                id="sort-by"
                className="select"
                value={filterOptions.sortBy}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, sortBy: e.target.value })
                }
              >
                <option value="">--No Sorting--</option>
                <option value="name">Name</option>
                <option value="position">Position</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div> */}

            {/* <div className="filter-field">
              <label htmlFor="sort-order" className="label">
                Sort Order
              </label>
              <select
                id="sort-order"
                className="select"
                value={filterOptions.sortOrder}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    sortOrder: e.target.value,
                  })
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div> */}
          </div>
          <button
            onClick={() => setIsFilterApplied(true)}
            className="filter-button"
          >
            <FiFilter className="icon" /> Apply Filter
          </button>
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
                  <th>Department</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>
                        {branches.find((b) => b.id === employee.branchId)?.name}
                      </td>
                      <td>{employee.position}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td className="actions">
                        <button
                          onClick={() => {
                            setDetailedEmployee(employee); // Set the employee for details modal
                            setShowDetailsModal(true); // Show details modal
                          }}
                          className="details-button-employee"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setFormData({
                              branchId: employee.branchId.toString(),
                              name: employee.name,
                              position: employee.position,
                              email: employee.email,
                              phone: employee.phone,
                              address: employee.address || "",
                              gender: employee.gender || "",
                              hire_date: employee.hire_date || "",
                              quit_date: employee.quit_date || "",
                              date_of_birth: employee.date_of_birth || "",
                            });

                            setShowAddForm(true); // Open the modal for editing
                          }}
                          className="edit-button"
                          style={{ margin: 0 }}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                className="pagination-button"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`pagination-button ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                className="pagination-button"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
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
                <label className="label">Branch</label>
                <select
                  className={`select ${
                    formErrors.branchId ? "input-error" : ""
                  }`}
                  value={formData.branchId}
                  onChange={(e) =>
                    setFormData({ ...formData, branchId: e.target.value })
                  }
                >
                  <option value="">--Select Branch--</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {formErrors.branchId && (
                  <p className="error">{formErrors.branchId}</p>
                )}
              </div>
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

              <div className="form-field">
                <label className="label">Address</label>
                <input
                  type="text"
                  className={`input ${formErrors.address ? "input-error" : ""}`}
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                {formErrors.address && (
                  <p className="error">{formErrors.address}</p>
                )}
              </div>

              <div className="form-field">
                <label className="label">Gender</label>
                <select
                  className={`select ${formErrors.gender ? "input-error" : ""}`}
                  value={formData.gender || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">--Select Gender--</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && (
                  <p className="error">{formErrors.gender}</p>
                )}
              </div>

              <div className="form-field">
                <label className="label">Hire Date</label>
                <input
                  type="date"
                  className={`input ${
                    formErrors.hire_date ? "input-error" : ""
                  }`}
                  value={formData.hire_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, hire_date: e.target.value })
                  }
                />
                {formErrors.hire_date && (
                  <p className="error">{formErrors.hire_date}</p>
                )}
              </div>

              <div className="form-field">
                <label className="label">Quit Date</label>
                <input
                  type="date"
                  className={`input ${
                    formErrors.quit_date ? "input-error" : ""
                  }`}
                  value={formData.quit_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, quit_date: e.target.value })
                  }
                />
                {formErrors.quit_date && (
                  <p className="error">{formErrors.quit_date}</p>
                )}
              </div>

              <div className="form-field">
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  className={`input ${
                    formErrors.date_of_birth ? "input-error" : ""
                  }`}
                  value={formData.date_of_birth || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                />
                {formErrors.date_of_birth && (
                  <p className="error">{formErrors.date_of_birth}</p>
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

      {/* Details Modal */}
      {showDetailsModal && detailedEmployee && (
        <div className="modal-detail-employee-overlay">
          <div className="modal-detail-employee-content">
            <div className="modal-detail-employee-header">
              <h3>Employee Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)} // Close modal
                className="modal-detail-employee-close-button"
              >
                <FiX className="icon" />
              </button>
            </div>
            <div className="modal-detail-employee-body">
              <p>
                <strong>Name:</strong> {detailedEmployee.name}
              </p>
              <p>
                <strong>Branch:</strong>{" "}
                {branches.find((b) => b.id === detailedEmployee.branchId)?.name}
              </p>
              <p>
                <strong>Position:</strong> {detailedEmployee.position}
              </p>
              <p>
                <strong>Email:</strong> {detailedEmployee.email}
              </p>
              <p>
                <strong>Phone:</strong> {detailedEmployee.phone}
              </p>
              <p>
                <strong>Address:</strong> {detailedEmployee.address}
              </p>
              <p>
                <strong>Gender:</strong> {detailedEmployee.gender}
              </p>
              <p>
                <strong>Hire Date:</strong> {detailedEmployee.hire_date}
              </p>
              <p>
                <strong>Quit Date:</strong>{" "}
                {detailedEmployee.quit_date
                  ? detailedEmployee.quit_date
                  : "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {detailedEmployee.date_of_birth}
              </p>
            </div>
            <div className="modal-detail-employee-footer">
              <button
                onClick={() => setShowDetailsModal(false)} // Close modal
                className="modal-detail-employee-close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementEmployeePage;
