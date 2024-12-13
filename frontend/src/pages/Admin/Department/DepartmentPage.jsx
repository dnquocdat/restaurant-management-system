import React, { useState } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import "./DepartmentPage.css"; // Import the custom CSS file

const DepartmentPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Engineering Department",
      people: 150,
      salary: 75000,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    },
    {
      id: 2,
      name: "Marketing Department",
      people: 50,
      salary: 65000,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    },
    {
      id: 3,
      name: "Finance Department",
      people: 30,
      salary: 85000,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
    },
    {
      id: 4,
      name: "Develop Department",
      people: 50,
      salary: 805000,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
    },
  ]);

  const [editForm, setEditForm] = useState({
    name: "",
    people: 0,
    salary: 0,
  });

  const validateForm = () => {
    const errors = {};
    if (!editForm.name.trim()) {
      errors.name = "Department name is required";
    }
    if (editForm.people < 1) {
      errors.people = "Number of people must be greater than 0";
    }
    if (editForm.salary < 0) {
      errors.salary = "Salary cannot be negative";
    }
    return errors;
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsEditing(true);
    setEditForm({
      name: department.name,
      people: department.people,
      salary: department.salary,
    });
  };

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

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedDepartment(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]:
        name === "people" || name === "salary" ? parseInt(value) || 0 : value,
    });
  };

  return (
    <div className="department-container">
      <div className="department-header">
        <h1>Departments</h1>
      </div>
      <div className="department-list">
        {departments.map((department) => (
          <div key={department.id} className="department-card">
            <div className="department-image">
              <img
                src={department.image}
                alt={`${department.name} Header`}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1497366216548-37526070297c";
                }}
              />
            </div>

            <div className="department-content">
              <div className="department-title">
                <BiBuildings style={{ fontSize: 20 }} />
                {isEditing && selectedDepartment?.id === department.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="input-field"
                    aria-label="Department Name"
                  />
                ) : (
                  <h2>{department.name}</h2>
                )}
                {!isEditing ? (
                  <button
                    onClick={() => handleEdit(department)}
                    className="edit-button"
                  >
                    <FiEdit2 />
                    Edit
                  </button>
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
                    {isEditing && selectedDepartment?.id === department.id ? (
                      <input
                        type="number"
                        name="people"
                        value={editForm.people}
                        onChange={handleInputChange}
                        min="1"
                        className="input-field"
                      />
                    ) : (
                      <p>{department.people}</p>
                    )}
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
                        onChange={handleInputChange}
                        min="0"
                        className="input-field"
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
      </div>
    </div>
  );
};

export default DepartmentPage;
