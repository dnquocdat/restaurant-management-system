import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdSave, MdCancel, MdList } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import "./BranchPage.css"; // Import the CSS file
import { toast } from "react-toastify";

const BranchPage = () => {
  const [formData, setFormData] = useState({
    area: "",
    branchName: "",
    address: "",
    phone: "",
    email: "",
    operationHours: {
      opening: "07:00",
      closing: "22:00",
    },
    tableCount: 0,
    hasCarParking: false,
    hasBikeParking: false,
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
                branchName: `${area} Main`,
                address: `123 ${area} Street`,
                phone: "0123123123",
                email: `${area.toLowerCase()}@example.com`,
                operationHours: { opening: "09:00", closing: "22:00" },
                tableCount: 20,
                hasCarParking: true,
                hasBikeParking: true,
              },
              {
                id: 2,
                area,
                branchName: `${area} Downtown`,
                address: `456 ${area} Avenue`,
                phone: "0123456789",
                email: `${area.toLowerCase()}downtown@example.com`,
                operationHours: { opening: "08:00", closing: "21:00" },
                tableCount: 50,
                hasCarParking: false,
                hasBikeParking: true,
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
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBranchList((prev) =>
          prev.filter((branch) => branch.id !== branchId)
        );
        toast.success(`"Branch deleted successfully!`, {
          position: "top-right",
          autoClose: 1000,
        });
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

    if (formData.tableCount <= 0)
      newErrors.tableCount = "Table count must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (validateForm()) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (editMode && selectedBranch) {
          // Chế độ chỉnh sửa branch
          setBranchList((prev) =>
            prev.map((branch) =>
              branch.id === selectedBranch.id ? { ...formData } : branch
            )
          );
          toast.success(`Branch updated successfully!`, {
            position: "top-right",
            autoClose: 1500,
          });
        } else {
          // Chế độ thêm mới branch
          const newBranch = {
            ...formData,
            id:
              branchList.length > 0
                ? Math.max(...branchList.map((b) => b.id)) + 1
                : 1, // Gán ID mới
          };
          setBranchList((prev) => [...prev, newBranch]);
          toast.success(`Branch added successfully!`, {
            position: "top-right",
            autoClose: 1500,
          });
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
      area: formData.area || "",
      branch: "",
      branchName: "",
      address: "",
      phone: "",
      email: "",
      operationHours: {
        opening: "09:00",
        closing: "22:00",
      },
      tableCount: 0,
      hasCarParking: false,
      hasBikeParking: false,
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
              <option value="">Select Region</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            {formData.area && (
              <button
                onClick={() => {
                  resetForm(); // Đảm bảo form được reset (dữ liệu rỗng)
                  setFormData((prev) => ({ ...prev, area: formData.area })); // Giữ lại area được chọn
                  setEditMode(true); // Kích hoạt chế độ thêm branch
                }}
                className="add-branch-btn"
              >
                <MdList /> Add Branch
              </button>
            )}
          </div>
        </div>

        {!editMode && branchList.length === 0 && (
          <p>No branches found for selected region</p>
        )}

        {!editMode && branchList.length > 0 && (
          <div className="branch-cards">
            {branchList.map((branch) => (
              <div key={branch.id} className="branch-card">
                <div className="branch-info">
                  <h4>{branch.branchName}</h4>
                  <p>Address: {branch.address}</p>
                  <p>Phone: {branch.phone}</p>
                  <p>Table Amount: {branch.tableCount}</p>
                  <p>Car Parking: {branch.hasCarParking ? "Yes" : "No"}</p>
                  <p>Bike Parking: {branch.hasBikeParking ? "Yes" : "No"}</p>
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

        {formData.area && editMode && (
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

              <div className="field">
                <label>Table Count</label>
                <input
                  type="number"
                  value={formData.tableCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tableCount: parseInt(e.target.value, 10),
                    }))
                  }
                  className="input"
                />
              </div>
              <div className="field">
                <label>Car Parking</label>
                <select
                  value={formData.hasCarParking ? "yes" : "no"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasCarParking: e.target.value === "yes",
                    }))
                  }
                  className="input"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="field">
                <label>Bike Parking</label>
                <select
                  value={formData.hasBikeParking ? "yes" : "no"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasBikeParking: e.target.value === "yes",
                    }))
                  }
                  className="input"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
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
