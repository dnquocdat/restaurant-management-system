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
import { toast } from "react-toastify";
import "./ManagementEmployeePage.css"; // Import the external CSS file
import { http } from "../../../helpers/http.js";
const ManagementEmployeePage = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailedEmployee, setDetailedEmployee] = useState(null);
  // 123
  const [formData, setFormData] = useState({
    branchName: "",
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
    branchName: "",
    position: "",
    sortBy: "",
    sortOrder: "asc",
  });

  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // Thêm trạng thái tìm kiếm

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5; // Adjust as needed

  const branches = [
    { id: 1, name: "Branch North 1" },
    { id: 2, name: "Branch South 1" },
    { id: 3, name: "Branch East 1" },
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
      branchName: "",
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
      branchName: "VietNam",
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
      if (filterOptions.branchName) {
        filtered = filtered.filter(
          (emp) => emp.branchName === filterOptions.branchName
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

    // Common validations for both Add and Edit
    if (!formData.name.trim()) errors.name = "Name is required";

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

    if (!formData.address.trim()) errors.address = "Address is required";

    if (!formData.gender) errors.gender = "Gender is required";

    if (!formData.date_of_birth)
      errors.date_of_birth = "Date of birth is required";

    // Specific Validation for Update
    if (selectedEmployee) {
      const isBranchEmpty = !formData.branchName.trim();
      const isPositionEmpty = !formData.position.trim();

      const isBranchUpdated =
        formData.branchName !== selectedEmployee.branchName;
      const isPositionUpdated = formData.position !== selectedEmployee.position;

      if (
        !(
          (isBranchEmpty && isPositionEmpty) ||
          (isBranchUpdated && isPositionUpdated)
        )
      ) {
        errors.form =
          "You must either clear branch and department or update both to new values.";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return; // Stop submission if there are errors
    }

    if (selectedEmployee) {
      // Edit Employee
      const isBranchUpdated =
        formData.branchName !== selectedEmployee.branchName;
      const isPositionUpdated = formData.position !== selectedEmployee.position;

      // Xác định branch name để gửi
      const branchNameToSend =
        formData.branchName.trim() !== ""
          ? isBranchUpdated
            ? formData.branchName // Nếu đã cập nhật, gửi giá trị mới
            : selectedEmployee.branchName // Nếu không cập nhật, giữ giá trị cũ
          : null; // Nếu không có branchName, gửi null

      // Xác định department name để gửi
      const departmentNameToSend =
        formData.position.trim() !== ""
          ? isPositionUpdated
            ? formData.position // Nếu đã cập nhật, gửi giá trị mới
            : selectedEmployee.position // Nếu không cập nhật, giữ giá trị cũ
          : null; // Nếu không có position, gửi null

      const updateData = {
        employee_name: formData.name,
        employee_email: formData.email,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        employee_phone_number: formData.phone,
        employee_address: formData.address,
        branch_name: branchNameToSend,
        department_name: departmentNameToSend,
        hire_date: formData.hire_date,
        quit_date: formData.quit_date || null,
      };

      try {
        const response = await http(
          `/employee/${selectedEmployee.id}`,
          "PATCH",
          updateData
        );
        const updatedEmployee = response.data;
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp
          )
        );
        toast.success("Employee updated successfully!", {
          position: "top-right",
          autoClose: 1500,
        });
      } catch (error) {
        console.error("Error updating employee:", error);
        alert("Failed to update employee. Please try again.");
      }
    } else {
      // Add New Employee
      try {
        const response = await http(`/employee`, "POST", {
          employee_name: formData.name,
          employee_email: formData.email,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          employee_phone_number: formData.phone,
          employee_address: formData.address,
        });

        const newEmployee = response.data;
        setEmployees((prev) => [...prev, newEmployee]);
        toast.success("Employee added successfully!", {
          position: "top-right",
          autoClose: 1500,
        });
      } catch (error) {
        console.error("Error adding employee:", error);
        alert("Failed to add employee. Please try again.");
      }
    }

    // Reset form and close modal
    setShowAddForm(false);
    setFormData({
      branchName: "",
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
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    await deleteEmployee(selectedEmployee.id); // Gọi API DELETE
    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id)); // Cập nhật danh sách employees
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

  const deleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/employee/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete employee with ID: ${employeeId}`);
      }

      toast.success(`Employee with ID: ${employeeId} deleted successfully!`, {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee. Please try again.");
    }
  };

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
                value={filterOptions.branchName}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    branchName: e.target.value,
                  })
                }
              >
                <option value="">--All Branches--</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.name}>
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
            <button
              onClick={() => {
                setShowAddForm(true);
                setSelectedEmployee(null); // Đặt lại trạng thái để chuyển sang chế độ thêm mới
                setFormData({
                  branchName: "",
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
              }}
              className="add-button"
            >
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
                      <td>{employee.branchName || "N/A"}</td>
                      <td>{employee.position || "N/A"}</td>
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
                              branchName: employee.branchName || "",
                              name: employee.name,
                              position: employee.position || "",
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
              {/* Common Fields for Add and Edit */}
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
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  className={`input ${
                    formErrors.date_of_birth ? "input-error" : ""
                  }`}
                  value={formData.date_of_birth || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date_of_birth: e.target.value,
                    })
                  }
                />
                {formErrors.date_of_birth && (
                  <p className="error">{formErrors.date_of_birth}</p>
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

              {/* Additional Fields for Edit */}
              {selectedEmployee && (
                <>
                  <div className="form-section">
                    <h4
                      className="section-title"
                      style={{
                        marginTop: "15px",
                      }}
                    >
                      Work Information
                    </h4>
                    <div className="form-field">
                      <label className="label">Branch</label>
                      <select
                        className={`select ${
                          formErrors.branchName ? "input-error" : ""
                        }`}
                        value={formData.branchName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            branchName: e.target.value,
                          })
                        }
                      >
                        <option value="">--Select Branch--</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.name}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.branchName && (
                        <p className="error">{formErrors.branchName}</p>
                      )}
                    </div>

                    <div className="form-field">
                      <label className="label">Department</label>
                      <select
                        className={`select ${
                          formErrors.position ? "input-error" : ""
                        }`}
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                      >
                        <option value="">--Select Department--</option>
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
                      <label className="label">Hire Date</label>
                      <input
                        type="date"
                        className={`input ${
                          formErrors.hire_date ? "input-error" : ""
                        }`}
                        value={formData.hire_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hire_date: e.target.value,
                          })
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
                          setFormData({
                            ...formData,
                            quit_date: e.target.value,
                          })
                        }
                      />
                      {formErrors.quit_date && (
                        <p className="error">{formErrors.quit_date}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="form-buttons">
                <button
                  type="submit"
                  className="submit-button"
                  style={{ marginTop: "15px" }}
                >
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

            {/* Thông tin cá nhân */}
            <div className="form-section">
              <h4 className="section-title">Personal Information</h4>
              <p>
                <strong>Name:</strong> {detailedEmployee.name}
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
                <strong>Date of Birth:</strong> {detailedEmployee.date_of_birth}
              </p>
            </div>

            {/* Thông tin công việc */}
            <div className="form-section">
              <h4 className="section-title" style={{ marginTop: "15px" }}>
                Work Information
              </h4>
              <p>
                <strong>Branch:</strong> {detailedEmployee.branchName || "N/A"}
              </p>
              <p>
                <strong>Department:</strong> {detailedEmployee.position}
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
