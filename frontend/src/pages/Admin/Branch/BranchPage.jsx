import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdSave, MdCancel, MdList } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import "./BranchPage.css"; // Import the CSS file
import { toast } from "react-toastify";
import { http } from "../../../helpers/http";
import { FaSearch } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  //123
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
    pageSize: 0,
  });

  const [filters, setFilters] = useState({
    query: "",
    area: "",
    page: 1,
    limit: 4,
  });

  useEffect(() => {
    fetchRegions();
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [filters]);

  const fetchRegions = async () => {
    setIsLoading(true);
    try {
      const response = await http(`/region`, "GET");
      const data = response.data;
      setAreas(data || []);
    } catch (error) {
      console.error("Error fetching regions:", error);
      toast.error("Failed to fetch regions.", {
        position: "top-right",
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await http(`/branch?${queryParams}`, "GET");
      const data = response.data;

      setBranches(data.branches || []);
      setPagination({
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1,
        pageSize: data.pagination?.pageSize || 4,
        hasMore: data.pagination?.hasMore || false,
      });
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches.", {
        position: "top-right",
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch); // Lưu branch đang được chỉnh sửa
    setFormData({
      area: branch.region_id || "", // Cập nhật `area` nếu có
      branchName: branch.branch_name || "",
      address: branch.address || "",
      phone: branch.phone_number || "",
      email: branch.email || "",
      operationHours: {
        opening: branch.open_time
          ? branch.open_time.split("T")[1].slice(0, 5)
          : "07:00",
        closing: branch.close_time
          ? branch.close_time.split("T")[1].slice(0, 5)
          : "22:00",
      },
      tableCount: branch.table_amount || 0,
      hasCarParking: !!branch.has_car_park,
      hasBikeParking: !!branch.has_motorbike_park,
    });
    setEditMode(true); // Kích hoạt chế độ chỉnh sửa
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      query: searchValue,
      page: 1, // Reset về trang đầu khi tìm kiếm
    }));
  };

  const goToPage = (page) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(page, pagination.totalPages)), // Giới hạn trong khoảng hợp lệ
    }));
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
    if (validateForm()) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (editMode && selectedBranch) {
          await updateBranch(selectedBranch.branch_id);
        } else {
          await addBranch();
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

  const handleAreaChange = async (e) => {
    const selectedRegion = e.target.value; // Lấy region_id được chọn
    setFormData((prev) => ({ ...prev, area: selectedRegion })); // Cập nhật state formData.area

    if (selectedRegion) {
      setIsLoading(true); // Bật trạng thái loading
      try {
        const queryParams = new URLSearchParams({
          region_id: selectedRegion,
          page: 1,
          limit: pagination.pageSize || 4,
        }).toString();

        const response = await http(`/branch/search?${queryParams}`, "GET"); // Gọi API với tham số
        const data = response.data;

        setBranchList(data.branches || []);
        setPagination({
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
          pageSize: data.pagination?.pageSize || 4,
          hasMore: data.pagination?.hasMore || false,
        });
        setShowBranchList(true);
      } catch (error) {
        console.error("Error fetching branches for region:", error);
        toast.error("Failed to fetch branches for selected region.", {
          position: "top-right",
          autoClose: 1500,
        });
      } finally {
        setIsLoading(false); // Tắt trạng thái loading
      }
    } else {
      // Nếu không chọn region, reset danh sách branch
      setBranchList([]);
      setShowBranchList(false);
    }
  };

  const addBranch = async () => {
    const dataAdd = {
      region_id: formData.area,
      branch_name: formData.branchName,
      address: formData.address,
      open_time: formData.operationHours.opening,
      close_time: formData.operationHours.closing,
      phone_number: formData.phone,
      email: formData.email,
      has_car_park: formData.hasCarParking,
      has_motorbike_park: formData.hasBikeParking,
      table_amount: formData.tableCount,
    };

    setIsLoading(true);

    try {
      const response = await http(`/branch`, "POST", dataAdd);

      if (response?.status === 201) {
        toast.success("Branch added successfully!", {
          position: "top-right",
          autoClose: 1500,
        });
        resetForm(); // Reset form sau khi thêm thành công
        setBranchList((prev) => [...prev, response.data]);
      } else {
        throw new Error(response?.data?.message || "Failed to add branch");
      }
    } catch (error) {
      console.error("Error adding branch:", error);
      toast.error("An error occurred while adding the branch.", {
        position: "top-right",
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false); // Dừng trạng thái loading
    }
  };

  const updateBranch = async (idBranch) => {
    const dataUpdate = {
      branch_name: formData.branchName,
      address: formData.address,
      open_time: formData.operationHours.opening,
      close_time: formData.operationHours.closing,
      phone_number: formData.phone,
      email: formData.email,
      has_car_park: formData.hasCarParking,
      has_motorbike_park: formData.hasBikeParking,
      table_amount: formData.tableCount,
    };

    setIsLoading(true);

    try {
      const fetchUpdateBranch = await http(
        `/branch/${idBranch}`, // Sử dụng `idBranch` đúng cách
        "PATCH",
        dataUpdate
      );

      if (fetchUpdateBranch) {
        toast.success("Branch updated successfully!", {
          position: "top-right",
          autoClose: 1500,
        });
        resetForm();
        setBranchList((prev) =>
          prev.map((branch) =>
            branch.branch_id === idBranch ? fetchUpdateBranch.data : branch
          )
        );
      } else {
        const errorData = await fetchUpdateBranch.json();
        console.error("Error updating branch:", errorData);
        toast.error(`Failed to update branch: ${errorData.message}`, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error updating branch:", error);
      toast.error("An unexpected error occurred while updating the branch.", {
        position: "top-right",
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="branch-management-container">
      <div className="form-container">
        <div className="header" style={{ marginBottom: 0 }}>
          <h2 className="title">Branch Management</h2>
        </div>
        <div className="search-bar-emp">
          <FaSearch className="search-icon-emp" />
          <input
            type="text"
            placeholder="Search by name..."
            className="search-input-emp"
            value={filters.query}
            onChange={handleSearch} // Cập nhật filters.query
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchBranches(); // Gọi API khi nhấn Enter
            }}
          />
        </div>

        <div className="controls">
          <select
            value={formData.area}
            onChange={handleAreaChange}
            className="area-select"
          >
            <option value="">Select Region</option>
            {areas.map((region) => (
              <option key={region.region_id} value={region.region_id}>
                {region.region_name}
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

        {!editMode && branchList.length === 0 && (
          <p>No branches found for selected region</p>
        )}

        {!editMode && branchList.length > 0 && (
          <div className="branch-cards">
            {branchList.map((branch) => (
              <div key={branch.branch_id} className="branch-card">
                <div className="branch-info">
                  <h4>{branch.branch_name}</h4>
                  <p>Address: {branch.address}</p>
                  <p>Phone: {branch.phone_number}</p>
                  <p>Table Amount: {branch.table_amount}</p>
                  <p>Car Parking: {branch.has_car_park ? "Yes" : "No"}</p>
                  <p>
                    Bike Parking: {branch.has_motorbike_park ? "Yes" : "No"}
                  </p>
                </div>
                <div className="branch-actions">
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="edit-btn"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.branch_id)}
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

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => goToPage(filters.page - 1)} // Chuyển sang trang trước
            disabled={filters.page === 1}
            className="pagination-button"
            aria-label="Previous page"
          >
            <FiChevronLeft className="pagination-icon" />
          </button>
          <span className="pagination-info">
            Page {filters.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => goToPage(filters.page + 1)} // Chuyển sang trang kế
            disabled={filters.page === pagination.totalPages}
            className="pagination-button"
            aria-label="Next page"
          >
            <FiChevronRight className="pagination-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchPage;
