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
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await http("/employee/profile", "GET");
      const data = response.data;
      const formattedDate = new Date(data.date_of_birth).toLocaleDateString(
        "en-GB"
      );
      setFormData({
        photo: null,
        name: data.employee_name,
        dateOfBirth: formattedDate,
        gender: data.gender,
        phone: data.employee_phone_number,
        address: data.employee_address,
        salary: data.salary,
        department: data.department_name,
        branch: data.current_branch_name,
      });

      if (data.photo) {
        setPreview(data.photo);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (formData.photo) {
        URL.revokeObjectURL(formData.photo);
      }
    };
  }, [formData.photo]);

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

        <div className="employee-details">
          <div className="employee-photo-edit">
            <img src={preview} alt="Employee" className="employee-photo" />
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
            formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
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
      </div>
    </div>
  );
};
