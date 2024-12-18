import React, { useState } from "react";
import { FiEdit2, FiCheck, FiX, FiTrash2, FiPlus } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import "./DepartmentPage.css"; // Import the custom CSS file

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
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
      employees: ["Alice", "Bob", "Charlie"], // Example employees
    },
    {
      id: 2,
      name: "Marketing Department",
      salary: 65000,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      employees: ["David", "Eve"],
    },
    {
      id: 3,
      name: "Finance Department",
      salary: 85000,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      employees: ["Frank", "Grace", "Heidi"],
    },
    {
      id: 4,
      name: "Develop Department",
      salary: 805000,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      employees: ["Ivan", "Judy"],
    },
  ]);

  // State to manage the edit form
  const [editForm, setEditForm] = useState({
    name: "",
    salary: 0,
    image: "", // To store image data URL
  });

  // State to manage adding a new department
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    salary: 0,
    image: "", // To store image data URL
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
    // Image is optional, but if not provided, use a default image
    return errors;
  };

  // Handle edit button click
  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsEditing(true);
    setEditForm({
      name: department.name,
      salary: department.salary,
      image: department.image,
    });
  };

  // Handle save after editing
  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0 && selectedDepartment) {
      const updatedDepartments = departments.map((dept) =>
        dept.id === selectedDepartment.id ? { ...dept, ...editForm } : dept
      );
      setDepartments(updatedDepartments);
      setIsEditing(false);
      setSelectedDepartment(null);
      setFormErrors({});
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

  // Handle image file change in edit form
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the file as data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input change in add form
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({
      ...prev,
      [name]: name === "salary" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle image file change in add form
  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the file as data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDepartment((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding a new department
  const handleAddDepartment = (e) => {
    e.preventDefault();
    const errors = validateAddForm();
    if (Object.keys(errors).length === 0) {
      const newDept = {
        id: departments.length
          ? Math.max(...departments.map((d) => d.id)) + 1
          : 1,
        name: newDepartment.name,
        salary: newDepartment.salary,
        image:
          newDepartment.image ||
          "https://images.unsplash.com/photo-1497366216548-37526070297c", // Default image
        employees: [], // Initialize with no employees
      };
      setDepartments([...departments, newDept]);
      setNewDepartment({ name: "", salary: 0, image: "" });
      setAddFormErrors({});
      setIsAddModalOpen(false); // Close modal after adding
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
              {/* <div className="form-group-dpm">
                <label htmlFor="image">Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleAddImageChange}
                  className="input-field file-input"
                  aria-label="New Department Image"
                />
                {newDepartment.image && (
                  <img
                    src={newDepartment.image}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
              </div> */}
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
            {/* <div className="department-image">
              <img
                src={department.image}
                alt={`${department.name} Header`}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1497366216548-37526070297c";
                }}
              />
            </div> */}

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

              {/* {isEditing && selectedDepartment?.id === department.id && (
                <div className="edit-image-section">
                  <label htmlFor="edit-image">Edit Image:</label>
                  <input
                    type="file"
                    name="edit-image"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="input-field file-input"
                    aria-label="Edit Department Image"
                  />
                  {editForm.image && (
                    <img
                      src={editForm.image}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                </div>
              )} */}

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
