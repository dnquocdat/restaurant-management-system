import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
  FaCalendarAlt,
  FaUsers,
  FaEdit,
} from "react-icons/fa";
import "./ProfileStaffPage.css";
import { http } from "../../../helpers/http";

export const ProfileStaffPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    photo: null,
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    salary: "",
    department: "",
    branch: "",
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3789/3789820.png"
  );

  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Human Resources",
    "Finance",
    "Operations",
  ];
  // fetchEmployeeData();
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // thêm mới hàm fetch api get employee information
  const fetchEmployeeData = async () => {
    try {
      const response = await http("/employee/profile", "GET"); // Địa chỉ API để lấy thông tin nhân viên
      const data = response.data;
      //console.log("Employee data:", data);
      // console.log("Employee data:", data);
      // Cập nhật formData với dữ liệu nhận được từ API
      setFormData({
        photo: null,
        name: data.employee_name,
        dateOfBirth: data.date_of_birth,
        gender: data.gender,
        phone: data.employee_phone_number,
        address: data.employee_address,
        salary: data.salary,
        department: data.department_name,
        branch: data.current_branch_name,
      });

      // Cập nhật preview ảnh nếu có ảnh trả về từ API
      if (data.photo) {
        setPreview(data.photo);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    // Cleanup the object URL to avoid memory leaks
    return () => {
      if (formData.photo) {
        URL.revokeObjectURL(formData.photo);
      }
    };
  }, [formData.photo]);

  const handleInputChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handlePhoneInput = (e) => {
    if (!isEditing) return;
    const { value } = e.target;
    const formatted = value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
    setFormData({ ...formData, phone: formatted });
    validateField("phone", formatted);
  };

  const handleImageUpload = (e) => {
    if (!isEditing) return;
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else if (value.length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "phone":
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!value) {
          newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = "Invalid phone format";
        } else {
          delete newErrors.phone;
        }
        break;

      case "salary":
        if (isNaN(value) || value <= 0) {
          newErrors.salary = "Please enter a valid salary";
        } else {
          delete newErrors.salary;
        }
        break;

      default:
        if (!value && name !== "photo") {
          newErrors[name] = "This field is required";
        } else {
          delete newErrors[name];
        }
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) isValid = false;
    });

    if (isValid) {
      console.log("Form submitted:", formData);
      setIsEditing(false);
      // Here, you can handle the form submission, e.g., send data to an API
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const renderField = (label, value, icon) => {
    return (
      <div className="field-container">
        <div className="field-icon">{icon}</div>
        <div className="field-label">{label}:</div>
        <div className="field-value">{value}</div>
      </div>
    );
  };

  return (
    <div className="employee-form-container">
      <div className="employee-form-box">
        <div className="form-header">
          <h2 className="form-title">Employee Information</h2>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-photo-section">
              <div className="photo-wrapper">
                {preview ? (
                  <img src={preview} alt="Preview" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">
                    <FaUser className="placeholder-icon" />
                  </div>
                )}
                <label
                  htmlFor="photo"
                  className="photo-upload-label"
                  aria-label="Upload photo"
                >
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="photo-input"
                  />
                  <span className="upload-icon">+</span>
                </label>
              </div>
            </div>

            <div className="form-fields">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <FaUser className="form-icon" />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? "input-error" : ""}`}
                  placeholder="Enter name"
                  required
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              {/* Date of Birth Field */}
              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">
                  <FaCalendarAlt className="form-icon" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Gender Field */}
              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  <FaUsers className="form-icon" />
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="error-message">{errors.gender}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <FaPhone className="form-icon" />
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneInput}
                  className={`form-input ${errors.phone ? "input-error" : ""}`}
                  placeholder="(123) 456-7890"
                  required
                />
                {errors.phone && (
                  <p className="error-message">{errors.phone}</p>
                )}
              </div>

              {/* Address Field */}
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  <FaMapMarkerAlt className="form-icon" />
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.address ? "input-error" : ""
                  }`}
                  placeholder="Enter address"
                  required
                />
                {errors.address && (
                  <p className="error-message">{errors.address}</p>
                )}
              </div>

              {/* Salary Field */}
              <div className="form-group">
                <label htmlFor="salary" className="form-label">
                  <FaDollarSign className="form-icon" />
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={`form-input ${errors.salary ? "input-error" : ""}`}
                  placeholder="Enter salary"
                  required
                />
                {errors.salary && (
                  <p className="error-message">{errors.salary}</p>
                )}
              </div>

              {/* Department Field */}
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  <FaBriefcase className="form-icon" />
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`form-select ${
                    errors.department ? "input-error" : ""
                  }`}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="error-message">{errors.department}</p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Information
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={toggleEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="employee-details">
            <div
              className="employee-photo-edit"
              onClick={toggleEdit}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") toggleEdit();
              }}
            >
              <img src={preview} alt="Employee" className="employee-photo" />
              <div className="edit-overlay">
                <FaEdit className="edit-icon" />
              </div>
            </div>
            {renderField(
              "Name",
              formData.name,
              <FaUser className="field-icon-style" />
            )}
            {renderField(
              "Date of Birth",
              formData.dateOfBirth,
              <FaCalendarAlt className="field-icon-style" />
            )}
            {renderField(
              "Gender",
              formData.gender.charAt(0).toUpperCase() +
                formData.gender.slice(1),
              <FaUsers className="field-icon-style" />
            )}
            {renderField(
              "Phone",
              formData.phone,
              <FaPhone className="field-icon-style" />
            )}
            {renderField(
              "Address",
              formData.address,
              <FaMapMarkerAlt className="field-icon-style" />
            )}
            {renderField(
              "Salary",
              `$${formData.salary}`,
              <FaDollarSign className="field-icon-style" />
            )}
            {renderField(
              "Department",
              formData.department,
              <FaBriefcase className="field-icon-style" />
            )}
            {renderField(
              "Branch",
              formData.branch,
              <FaMapMarkerAlt className="field-icon-style" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
