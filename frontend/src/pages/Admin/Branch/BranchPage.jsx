import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdSave, MdCancel, MdList } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import "./BranchPage.css"; // Import the CSS file

const BranchPage = () => {
  const [formData, setFormData] = useState({
    area: "",
    branch: "",
    branchName: "",
    address: "",
    phone: "",
    email: "",
    operationHours: {
      opening: "09:00",
      closing: "22:00",
    },
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showBranchList, setShowBranchList] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(["North", "South", "East", "West"]), 1000)
      );
      setAreas(response);
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranchList = async (area) => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              {
                id: 1,
                area,
                branch: `${area} Main Branch`,
                branchName: `${area} Main`,
                address: `123 ${area} Street`,
                phone: "+1234567890",
                email: `${area.toLowerCase()}@example.com`,
                operationHours: { opening: "09:00", closing: "22:00" },
              },
              {
                id: 2,
                area,
                branch: `${area} Downtown`,
                branchName: `${area} Downtown`,
                address: `456 ${area} Avenue`,
                phone: "+1234567891",
                email: `${area.toLowerCase()}downtown@example.com`,
                operationHours: { opening: "08:00", closing: "21:00" },
              },
            ]),
          100
        )
      );
      setBranchList(response);
    } catch (error) {
      console.error("Error fetching branch list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setFormData(branch);
    setEditMode(true);
    setShowBranchList(false);
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBranchList((prev) =>
          prev.filter((branch) => branch.id !== branchId)
        );
        alert("Branch deleted successfully!");
      } catch (error) {
        console.error("Error deleting branch:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.branchName) newErrors.branchName = "Branch name is required";
    if (!formData.address) newErrors.address = "Address is required";

    const phoneRegex = /^(0\d{9})$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (validateForm()) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (editMode) {
          setBranchList((prev) =>
            prev.map((branch) =>
              branch.id === selectedBranch.id ? { ...formData } : branch
            )
          );
          alert("Branch updated successfully!");
        } else {
          alert("Branch added successfully!");
        }
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      area: "",
      branch: "",
      branchName: "",
      address: "",
      phone: "",
      email: "",
      operationHours: {
        opening: "09:00",
        closing: "22:00",
      },
    });
    setErrors({});
    setEditMode(false);
    setSelectedBranch(null);
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setFormData((prev) => ({ ...prev, area, branch: "" }));
    if (area) {
      fetchBranchList(area);
      setShowBranchList(true);
    } else {
      setBranchList([]);
      setShowBranchList(false);
    }
  };

  return (
    <div className="branch-management-container">
      <div className="form-container">
        <div className="header">
          <h2 className="title">Branch Management</h2>
          <div className="controls">
            <select
              value={formData.area}
              onChange={handleAreaChange}
              className="area-select"
            >
              <option value="">Select Area</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowBranchList(!showBranchList)}
              className="toggle-branch-list-btn"
            >
              <MdList className="icon" />{" "}
              {showBranchList ? "Hide List" : "Show List"}
            </button>
          </div>
        </div>

        {showBranchList && (
          <div className="branch-list">
            <h3 className="branch-list-title">Branch List</h3>
            {branchList.length === 0 ? (
              <p>No branches found for selected area</p>
            ) : (
              <div className="branch-cards">
                {branchList.map((branch) => (
                  <div key={branch.id} className="branch-card">
                    <div className="branch-info">
                      <h4>{branch.branchName}</h4>
                      <p>{branch.address}</p>
                      <p>{branch.phone}</p>
                    </div>
                    <div className="branch-actions">
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="edit-btn"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="delete-btn"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(editMode || !showBranchList) && (
          <form onSubmit={handleSubmit} className="branch-form">
            <div className="form-fields">
              <div className="field">
                <label>Branch Name</label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      branchName: e.target.value,
                    }))
                  }
                  className={`input ${errors.branchName ? "error" : ""}`}
                />
                {errors.branchName && (
                  <p className="error-message">{errors.branchName}</p>
                )}
              </div>

              <div className="field">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className={`input ${errors.address ? "error" : ""}`}
                  rows="3"
                />
                {errors.address && (
                  <p className="error-message">{errors.address}</p>
                )}
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={`input ${errors.phone ? "error" : ""}`}
                />
                {errors.phone && (
                  <p className="error-message">{errors.phone}</p>
                )}
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`input ${errors.email ? "error" : ""}`}
                />
                {errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>
              <div className="opening-hours">
                <div className="field">
                  <label>Opening Hours</label>
                  <div className="time-inputs">
                    <input
                      type="time"
                      value={formData.operationHours.opening}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          operationHours: {
                            ...prev.operationHours,
                            opening: e.target.value,
                          },
                        }))
                      }
                      className="input"
                    />
                    <input
                      type="time"
                      value={formData.operationHours.closing}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          operationHours: {
                            ...prev.operationHours,
                            closing: e.target.value,
                          },
                        }))
                      }
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={isLoading}>
                {isLoading ? <FaSpinner className="spinner" /> : <MdSave />}{" "}
                Save
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                <MdCancel /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BranchPage;
