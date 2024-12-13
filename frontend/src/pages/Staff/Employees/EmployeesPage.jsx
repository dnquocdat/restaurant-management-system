import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaBuilding, FaBriefcase } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import "./EmployeesPage.css";

export const EmployeesPage = () => {
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [employeeRatings, setEmployeeRatings] = useState({}); // Track ratings for each employee

  const employees = [
    {
      id: 1,
      name: "John Davidson",
      department: "Engineering",
      position: "Senior Developer",
      email: "john.davidson@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "images.unsplash.com/photo-1500648767791-00dcc994a43e",
      ratings: {
        2024: {
          Q1: 4.5,
          Q2: 4.0,
          Q3: 4.8,
          Q4: 5.0,
        },
        2023: {
          Q1: 4.0,
          Q2: 3.8,
          Q3: 4.3,
          Q4: 4.7,
        },
      },
    },
    {
      id: 2,
      name: "Sarah Williams",
      department: "Marketing",
      position: "Marketing Manager",
      email: "sarah.williams@company.com",
      phone: "+1 (555) 234-5678",
      avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
      ratings: {
        2024: {
          Q1: 4.3,
          Q2: 4.6,
          Q3: 4.2,
          Q4: 4.9,
        },
        2023: {
          Q1: 4.1,
          Q2: 4.0,
          Q3: 4.4,
          Q4: 4.5,
        },
      },
    },
    {
      id: 3,
      name: "Michael Chen",
      department: "Finance",
      position: "Financial Analyst",
      email: "michael.chen@company.com",
      phone: "+1 (555) 345-6789",
      avatar: "images.unsplash.com/photo-1519085360753-af0119f7cbe7",
      ratings: {
        2024: {
          Q1: 4.7,
          Q2: 4.8,
          Q3: 4.6,
          Q4: 5.0,
        },
        2023: {
          Q1: 4.3,
          Q2: 4.4,
          Q3: 4.5,
          Q4: 4.9,
        },
      },
    },
    {
      id: 4,
      name: "Dn",
      department: "Dev",
      position: "Financial Analyst",
      email: "michael.chen@company.com",
      phone: "123123123123",
      avatar: "images.unsplash.com/photo-1519085360753-af0119f7cbe",
      ratings: {
        2024: {
          Q1: 3.8,
          Q2: 4.0,
          Q3: 4.2,
          Q4: 4.4,
        },
        2023: {
          Q1: 3.6,
          Q2: 3.9,
          Q3: 4.0,
          Q4: 4.1,
        },
      },
    },
  ];

  const handleExpandCard = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  const handleQuarterChange = (employeeId, event) => {
    setEmployeeRatings({
      ...employeeRatings,
      [employeeId]: {
        ...employeeRatings[employeeId],
        quarter: event.target.value,
      },
    });
  };

  const handleYearChange = (employeeId, event) => {
    setEmployeeRatings({
      ...employeeRatings,
      [employeeId]: {
        ...employeeRatings[employeeId],
        year: event.target.value,
      },
    });
  };

  return (
    <div className="container">
      <h1 className="heading">Employee Directory</h1>
      <div className="grid-content">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="card"
            role="article"
            aria-label={`Employee card for ${employee.name}`}
          >
            <div className="card-content">
              <div className="employee-header">
                <img
                  src={`https://${employee.avatar}`}
                  alt={employee.name}
                  className="avatar"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
                  }}
                />
                <div>
                  <h2 className="employee-name">{employee.name}</h2>
                  <p className="employee-department">{employee.department}</p>
                </div>
              </div>
              <button
                onClick={() => handleExpandCard(employee.id)}
                className="btn-toggle"
                aria-expanded={expandedEmployee === employee.id}
                aria-controls={`details-${employee.id}`}
              >
                {expandedEmployee === employee.id
                  ? "Hide Details"
                  : "View Details"}
              </button>
              {expandedEmployee === employee.id && (
                <div id={`details-${employee.id}`} className="details">
                  <div className="detail-item">
                    <FaBriefcase className="icon" />
                    <span>{employee.position}</span>
                  </div>
                  <div className="detail-item">
                    <FaEnvelope className="icon" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="detail-item">
                    <FaPhone className="icon" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="detail-item">
                    <FaBuilding className="icon" />
                    <span>{employee.department}</span>
                  </div>

                  {/* Rating Service Section */}
                  <div className="detail-item">
                    <FaStar className="icon" />
                    <div className="rating-container">
                      <span>Rating for</span>
                      <select
                        value={
                          employeeRatings[employee.id]?.year || selectedYear
                        }
                        onChange={(e) => handleYearChange(employee.id, e)}
                        className="select"
                      >
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </select>
                      <select
                        value={
                          employeeRatings[employee.id]?.quarter ||
                          selectedQuarter
                        }
                        onChange={(e) => handleQuarterChange(employee.id, e)}
                        className="select"
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                      <span className="rating-value">
                        :{" "}
                        {employee.ratings[
                          employeeRatings[employee.id]?.year || selectedYear
                        ]?.[
                          employeeRatings[employee.id]?.quarter ||
                            selectedQuarter
                        ] || "No rating available"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
