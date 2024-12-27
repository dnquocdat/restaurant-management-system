import React, { useState } from "react";
import { FiEdit2, FiCheck, FiX, FiTrash2, FiPlus } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import "./DepartmentPage.css"; // Import the custom CSS file
import { http } from "../../../helpers/http";
import { toast } from "react-toastify";

const DepartmentPage = () => {
  // State to manage editing
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // State to manage departments with employees
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Engineering Department",
      salary: 75000,
      employees: ["Alice", "Bob", "Charlie"], // Example employees
    },
    {
      id: 2,
      name: "Marketing Department",
      salary: 65000,
      employees: ["David", "Eve"],
    },
    {
      id: 3,
      name: "Finance Department",
      salary: 85000,
      employees: ["Frank", "Grace", "Heidi"],
    },
    {
      id: 4,
      name: "Develop Department",
      salary: 805000,
      employees: ["Ivan", "Judy"],
    },
  ]);

  // State to manage the edit form
  const [editForm, setEditForm] = useState({
    name: "",
    salary: 0,
  });

  // State to manage adding a new department
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    salary: 0,
  });
  const [addFormErrors, setAddFormErrors] = useState({});

  // State for search and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // State for modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Validation for edit form
  const validateForm = () => {
    const errors = {};
    if (!editForm.name.trim()) {
      errors.name = "Department name is required";
    }
    if (editForm.salary < 0) {
      errors.salary = "Salary cannot be negative";
    }
    return errors;
  };

  // Validation for add form
  const validateAddForm = () => {
    const errors = {};
    if (!newDepartment.name.trim()) {
      errors.name = "Department name is required";
    }
    if (newDepartment.salary < 0) {
      errors.salary = "Salary cannot be negative";
    }
    return errors;
  };

  // Handle edit button click
  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsEditing(true);
    setEditForm({
      name: department.name,
      salary: department.salary,
    });
  };

  // Handle save after editing
  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0 && selectedDepartment) {
      // Prepare the updated department data
      const updatedDept = {
        department_name: editForm.name,
        salary: editForm.salary,
      };

      try {
        // Use the http function to make the PATCH API call
        const fetchEditDept = await http(
          `/department/${selectedDepartment.id}`,
          "PATCH",
          updatedDept
        );

        if (fetchEditDept.status === 200) {
          // Update local state with the modified department
          const updatedDepartments = departments.map((dept) =>
            dept.id === selectedDepartment.id
              ? { ...dept, name: editForm.name, salary: editForm.salary }
              : dept
          );
          setDepartments(updatedDepartments);
          setIsEditing(false);
          setSelectedDepartment(null);
          setFormErrors({});
          toast.success("Department updated successfully!", {
            position: "top-right",
            autoClose: 1500,
          });
        } else {
          toast.error("Failed to update department.", {
            position: "top-right",
            autoClose: 1500,
          });
        }
      } catch (error) {
        console.error("Error updating department:", error);
        toast.error("An unexpected error occurred while updating.", {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } else {
      setFormErrors(errors);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedDepartment(null);
    setFormErrors({});
  };

  // Handle input change in edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "salary" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle input change in add form
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({
      ...prev,
      [name]: name === "salary" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle adding a new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    const errors = validateAddForm();
    if (Object.keys(errors).length === 0) {
      // Prepare the new department data
      const newDept = {
        department_name: newDepartment.name,
        salary: newDepartment.salary,
      };
      try {
        // Use the http function to make the API call
        const fetchAddDept = await http("/department", "POST", newDept);
        // setDepartments([...departments, fetchAddDept.data]); // Assuming the API returns the new department
        // setNewDepartment({ name: "", salary: 0 });
        setAddFormErrors({});
        setIsAddModalOpen(false);
        if (fetchAddDept.status == 201) {
          toast.success(`Add department successfully!`, {
            position: "top-right",
            autoClose: 1500,
          });
        } else {
          toast.error(`Add department failed!`, {
            position: "top-right",
            autoClose: 1500,
          });
        }
      } catch (error) {
        console.error("Error adding department:", error);
        alert("An unexpected error occurred while adding the department.");
      }
    } else {
      setAddFormErrors(errors);
    }
  };

  // Handle deleting a department
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      const updatedDepartments = departments.filter((dept) => dept.id !== id);
      setDepartments(updatedDepartments);
      // If the deleted department was being edited, cancel editing
      if (selectedDepartment?.id === id) {
        handleCancel();
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted and filtered departments
  const sortedDepartments = React.useMemo(() => {
    let sortableDepartments = [...departments];

    // Filter based on search term
    if (searchTerm) {
      sortableDepartments = sortableDepartments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on sortConfig
    if (sortConfig.key) {
      sortableDepartments.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableDepartments;
  }, [departments, sortConfig, searchTerm]);

  return (
    <div className="department-container">
      <div className="department-header">
        <h1>Departments</h1>
      </div>

      {/* Controls: Search, Sort, Add */}
      <div className="controls">
        <div className="search-bar-dpm">
          <FaSearch className="search-icon-dpm" />
          <input
            type="text"
            placeholder="Search by department name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search Departments"
          />
        </div>
        <div className="sort-buttons">
          {/* <button onClick={() => handleSort("name")} className="sort-button">
            Sort by Name{" "}
            {sortConfig.key === "name"
              ? sortConfig.direction === "ascending"
                ? "↑"
                : "↓"
              : ""}
          </button> */}
          <button onClick={() => handleSort("salary")} className="sort-button">
            Sort by Salary{" "}
            {sortConfig.key === "salary"
              ? sortConfig.direction === "ascending"
                ? "↑"
                : "↓"
              : ""}
          </button>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="add-department-button"
        >
          <FiPlus /> Add Department
        </button>
      </div>

      {/* Add Department Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="modal-header">
              <h2>Add New Department</h2>
              <button
                className="modal-close-button"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close Add Department Modal"
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddDepartment} className="add-form">
              <div className="form-group-dpm">
                <label htmlFor="name">Department Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newDepartment.name}
                  onChange={handleAddInputChange}
                  className="input-field"
                  aria-label="New Department Name"
                />
                {addFormErrors.name && (
                  <span className="error">{addFormErrors.name}</span>
                )}
              </div>
              <div className="form-group-dpm">
                <label htmlFor="salary">Salary:</label>
                <input
                  type="number"
                  name="salary"
                  value={newDepartment.salary}
                  onChange={handleAddInputChange}
                  min="0"
                  className="input-field"
                  aria-label="New Department Salary"
                />
                {addFormErrors.salary && (
                  <span className="error">{addFormErrors.salary}</span>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="add-button">
                  <FiPlus /> Add Department
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department List */}
      <div className="department-list">
        {sortedDepartments.map((department) => (
          <div key={department.id} className="department-card">
            <div className="department-content">
              <div className="department-title">
                <BiBuildings style={{ fontSize: 20 }} />
                {isEditing && selectedDepartment?.id === department.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditInputChange}
                    className="input-field"
                    aria-label="Department Name"
                  />
                ) : (
                  <h2>{department.name}</h2>
                )}
                {!isEditing ? (
                  <div className="title-buttons">
                    <button
                      onClick={() => handleEdit(department)}
                      className="edit-button"
                      style={{ margin: 0 }}
                      aria-label={`Edit ${department.name}`}
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
                      className="delete-button"
                      aria-label={`Delete ${department.name}`}
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                ) : (
                  selectedDepartment?.id === department.id && (
                    <div className="action-buttons">
                      <button onClick={handleSave} className="save-button">
                        <FiCheck />
                        Save
                      </button>
                      <button onClick={handleCancel} className="cancel-button">
                        <FiX />
                        Cancel
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="department-info">
                <div className="info-item">
                  <BsPeople />
                  <div>
                    <h3>People</h3>
                    <p>{department.employees.length}</p>
                  </div>
                </div>

                <div className="info-item">
                  <BiBuildings />
                  <div>
                    <h3>Salary</h3>
                    {isEditing && selectedDepartment?.id === department.id ? (
                      <input
                        type="number"
                        name="salary"
                        value={editForm.salary}
                        onChange={handleEditInputChange}
                        min="0"
                        className="input-field"
                        aria-label="Department Salary"
                      />
                    ) : (
                      <p>${department.salary.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedDepartments.length === 0 && (
          <p className="no-results">No departments found.</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;
