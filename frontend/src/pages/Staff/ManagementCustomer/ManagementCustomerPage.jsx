import React, { useState, useMemo } from "react";
import { FaSearch, FaTimes, FaEye, FaEdit } from "react-icons/fa";
import "./ManagementCustomerPage.css";
import { http } from "../../../helpers//http";
import { toast } from "react-toastify";

// Mock dữ liệu nhân viên (staff)
const mockStaffs = [
  {
    staff_id: 101,
    name: "Nguyen Van A",
    gender: "Male",
    phone: "090-111-2222",
    department: "Sales",
    branch: "Ho Chi Minh",
  },
  {
    staff_id: 102,
    name: "Tran Thi B",
    gender: "Female",
    phone: "098-222-3333",
    department: "Customer Service",
    branch: "Ha Noi",
  },
];

// Hàm lấy tên Staff từ staff_id
const getStaffName = (staffId) => {
  const staff = mockStaffs.find((s) => s.staff_id === staffId);
  return staff ? staff.name : "Unknown Staff";
};

// Hàm lấy rank của member card từ card_type_id
const getMemberCardRank = (typeId) => {
  switch (typeId) {
    case 1:
      return "Membership";
    case 2:
      return "Silver";
    case 3:
      return "Gold";
    default:
      return "Unknown";
  }
};

// Mock dữ liệu khách hàng + thẻ thành viên
// Mock dữ liệu khách hàng + thẻ thành viên
const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
    cccd: "123456789012", // Thêm trường CCCD
    memberCard: {
      member_card_id: 1001,
      created_at: "2024-01-10",
      updated_at: "2024-02-15",
      total_points: 150,
      card_issuer: 101,
      branch_created: 1,
      card_type_id: 2, // Silver
      member_id: "123456789012", // Đặt bằng CCCD
      member_name: "John Doe",
      member_phone_number: "123-456-7890",
      member_gender: "Male",
      is_active: true,
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "098-765-4321",
    cccd: "098765432109", // Thêm trường CCCD
    memberCard: {
      member_card_id: 1002,
      created_at: "2024-01-12",
      updated_at: "2024-02-18",
      total_points: 200,
      card_issuer: 102,
      branch_created: 2,
      card_type_id: 1, // Membership
      member_id: "", // Ban đầu là rỗng
      member_name: "Jane Smith",
      member_phone_number: "098-765-4321",
      member_gender: "Female",
      is_active: true,
    },
  },
  {
    id: 3,
    name: "Alice Johnson",
    phone: "555-123-4567",
    cccd: "555555555555", // Thêm trường CCCD
    memberCard: {
      member_card_id: 1003,
      created_at: "2024-01-15",
      updated_at: "2024-02-20",
      total_points: 50,
      card_issuer: 101,
      branch_created: 1,
      card_type_id: 3, // Gold
      member_id: "555555555555", // Đặt bằng CCCD
      member_name: "Alice Johnson",
      member_phone_number: "555-123-4567",
      member_gender: "Female",
      is_active: true,
    },
  },
];

export const ManagementCustomerPage = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state cho Detail View
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Modal state cho Staff Detail
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Modal state cho Edit Customer
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
  });

  // Modal state cho Add Card
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [newMemberCard, setNewMemberCard] = useState({
    member_id: "",
    member_name: "",
    member_phone_number: "",
    member_gender: "Male",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [customers, searchQuery]
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const currentCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewDetailClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedCustomer(null);
    setIsDetailModalOpen(false);
  };

  const closeStaffModal = () => {
    setSelectedStaff(null);
    setIsStaffModalOpen(false);
  };

  const handleViewStaffDetail = (staffId) => {
    const staff = mockStaffs.find((s) => s.staff_id === staffId);
    if (staff) {
      setSelectedStaff(staff);
      setIsStaffModalOpen(true);
    }
  };

  const handleEditClick = (customer) => {
    setEditCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email || "", // Khởi tạo email trống nếu không tồn tại
      phone: customer.phone,
      gender: customer.memberCard.member_gender, // Thêm gender vào form
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      // Chuẩn bị dữ liệu để gửi
      const data = {
        member_id: editCustomer.member_id, // Giữ nguyên Member ID
        member_name: editCustomer.name,
        member_phone_number: editCustomer.phone,
        member_gender: editCustomer.gender,
        email: editCustomer.email, // Thêm email vào body
      };
      // số 1 là idMemberCard, sẽ thay đổi khi có API thật
      await updateMemberCard(1, data);

      // Cập nhật danh sách khách hàng trong UI
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editCustomer.id
            ? {
                ...customer,
                name: editCustomer.name,
                phone: editCustomer.phone,
                email: editCustomer.email,
                memberCard: {
                  ...customer.memberCard,
                  member_gender: editCustomer.gender,
                },
              }
            : customer
        )
      );

      closeEditModal(); // Đóng modal sau khi lưu
    } catch (error) {
      console.error("Failed to save edit:", error.message);
    }
  };

  // Xử lý thêm thẻ mới
  const handleAddCard = () => {
    const { member_id, member_name, member_phone_number, member_gender } =
      newMemberCard;

    if (!member_id || !member_name || !member_phone_number || !member_gender) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const cccdRegex = /^\d{9}$/;
    if (!cccdRegex.test(member_id)) {
      alert("Member ID (CCCD) phải là 9 chữ số.");
      return;
    }

    const dataAdd = {
      member_id,
      member_name,
      member_phone_number,
      member_gender,
    };

    try {
      const idBranch = 1;
      const fetchAddCart = http(`/card/${idBranch}`, "POST", dataAdd);

      if (fetchAddCart) {
        toast.success(`Added membercard successfully!`, {
          position: "top-right",
          autoClose: 1000,
        });
      }
      // Thêm khách hàng mới vào danh sách
      const newCustomer = {
        id: customers.length + 1, // Tăng ID mới
        name: newMemberCard.member_name, // Đúng biến
        phone: newMemberCard.member_phone_number,
        cccd: newMemberCard.member_id,
        memberCard: {
          ...newMemberCard, // Đúng biến
          created_at: new Date().toISOString().split("T")[0],
          updated_at: new Date().toISOString().split("T")[0],
        },
      };

      setCustomers((prev) => [...prev, newCustomer]);
      setIsAddCardModalOpen(false);
      setNewMemberCard({
        member_id: "",
        member_name: "",
        member_phone_number: "",
        member_gender: "Male",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const updateMemberCard = async (idMemberCard, data) => {
    try {
      const fetchUpdateCard = http(`/card/${idMemberCard}`, "PATCH", data);
      if (fetchUpdateCard) {
        toast.success("Member card updated successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error updating member card:", error.message);
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 1500,
      });
      throw error;
    }
  };

  return (
    <div className="customer-list-container">
      <div className="customer-list-wrapper">
        <h1 className="customer-title">Customer Management</h1>

        {/* Search Bar và Add Card Button */}
        <div
          className="search-and-add-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Customer Name"
              className="search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="add-card-button"
          >
            Add Card
          </button>
        </div>

        {/* Customer Table */}
        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Card ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Total Points</th>
                <th>Level Card</th>
                <th>Issuer</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.memberCard.member_card_id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.memberCard.member_phone_number}</td>
                  <td style={{ textAlign: "center" }}>
                    {customer.memberCard.total_points}
                  </td>
                  <td
                    className={`member-card ${getMemberCardRank(
                      customer.memberCard.card_type_id
                    )}`}
                  >
                    {getMemberCardRank(customer.memberCard.card_type_id)}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleViewStaffDetail(customer.memberCard.card_issuer)
                      }
                      className="staff-detail-button"
                    >
                      {getStaffName(customer.memberCard.card_issuer)}
                    </button>
                  </td>
                  <td style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleViewDetailClick(customer)}
                      className="view-detail-button"
                      aria-label={`View details for ${customer.name}`}
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditClick(customer)}
                      className="edit-button"
                      style={{ margin: 0, padding: 8 }}
                      aria-label={`Edit ${customer.name}`}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCustomers.length > itemsPerPage && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-button ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Detail Modal */}
        {isDetailModalOpen && selectedCustomer && (
          <div className="modal-overlay">
            <div className="modal-content" role="dialog" aria-modal="true">
              <div className="modal-header">
                <h2 className="modal-title">
                  Member Card Detail - {selectedCustomer.name}
                </h2>
                <button
                  onClick={closeDetailModal}
                  className="modal-close-button"
                  aria-label="Close modal"
                >
                  <FaTimes className="modal-close-icon" />
                </button>
              </div>

              <div className="modal-body">
                {/* Hiển thị ảnh khách hàng */}
                <h3 className="modal-subtitle">Member Card Info</h3>
                <div className="modal-section">
                  <p>
                    <strong>Member Card ID:</strong>{" "}
                    {selectedCustomer.memberCard.member_card_id}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {selectedCustomer.memberCard.created_at}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {selectedCustomer.memberCard.updated_at}
                  </p>
                  <p>
                    <strong>Total Points:</strong>{" "}
                    {selectedCustomer.memberCard.total_points}
                  </p>
                  <p>
                    <strong>Card Issuer (Staff):</strong>{" "}
                    <button
                      onClick={() =>
                        handleViewStaffDetail(
                          selectedCustomer.memberCard.card_issuer
                        )
                      }
                      className="staff-detail-button"
                    >
                      {getStaffName(selectedCustomer.memberCard.card_issuer)}
                    </button>
                  </p>
                  <p>
                    <strong>Branch Created:</strong>{" "}
                    {selectedCustomer.memberCard.branch_created}
                  </p>
                  <p>
                    <strong>Card Type ID:</strong>{" "}
                    {selectedCustomer.memberCard.card_type_id} (
                    {getMemberCardRank(
                      selectedCustomer.memberCard.card_type_id
                    )}
                    )
                  </p>
                  <p>
                    <strong>Member ID:</strong>{" "}
                    {selectedCustomer.memberCard.member_id}
                  </p>
                  <p>
                    <strong>Member Name:</strong>{" "}
                    {selectedCustomer.memberCard.member_name}
                  </p>
                  <p>
                    <strong>Member Phone Number:</strong>{" "}
                    {selectedCustomer.memberCard.member_phone_number}
                  </p>
                  <p>
                    <strong>Member Gender:</strong>{" "}
                    {selectedCustomer.memberCard.member_gender}
                  </p>
                  <p>
                    <strong>Is Active:</strong>{" "}
                    {selectedCustomer.memberCard.is_active ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Detail Modal */}
        {isStaffModalOpen && selectedStaff && (
          <div className="modal-overlay">
            <div className="modal-content" role="dialog" aria-modal="true">
              <div className="modal-header">
                <h2 className="modal-title">
                  Staff Detail - {selectedStaff.name}
                </h2>
                <button
                  onClick={closeStaffModal}
                  className="modal-close-button"
                  aria-label="Close modal"
                >
                  <FaTimes className="modal-close-icon" />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <p>
                    <strong>Name:</strong> {selectedStaff.name}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedStaff.gender}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedStaff.phone}
                  </p>
                  <p>
                    <strong>Department:</strong> {selectedStaff.department}
                  </p>
                  <p>
                    <strong>Branch:</strong> {selectedStaff.branch}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Customer Modal */}
        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" role="dialog" aria-modal="true">
              <div className="modal-header">
                <h2 className="modal-title">Edit Customer Info</h2>
                <button
                  onClick={closeEditModal}
                  className="modal-close-button"
                  aria-label="Close modal"
                >
                  <FaTimes className="modal-close-icon" />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-section">
                  <label>Member ID (CCCD):</label>
                  <input
                    type="text"
                    value={editCustomer.member_id}
                    onChange={(e) =>
                      setEditCustomer((prev) => ({
                        ...prev,
                        member_id: e.target.value,
                      }))
                    }
                    className="modal-input"
                  />
                </div>
                <div className="modal-section">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editCustomer.name}
                    onChange={(e) =>
                      setEditCustomer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="modal-input"
                  />
                </div>
                <div className="modal-section">
                  <label>Email:</label>
                  <input
                    type="text"
                    value={editCustomer.email}
                    onChange={(e) =>
                      setEditCustomer((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="modal-input"
                    placeholder="Enter email"
                  />
                </div>
                <div className="modal-section">
                  <label>Phone:</label>
                  <input
                    type="text"
                    value={editCustomer.phone}
                    onChange={(e) =>
                      setEditCustomer((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="modal-input"
                  />
                </div>
                <div className="modal-section">
                  <label>Gender:</label>
                  <select
                    value={editCustomer.gender || "Male"} // Default là "Male"
                    onChange={(e) =>
                      setEditCustomer((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="modal-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button onClick={handleSaveEdit} className="save-button">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      closeEditModal();
                      setTimeout(() => {
                        setNewMemberCard({
                          member_id: "",
                          member_name: "",
                          member_phone_number: "",
                          member_gender: "Male",
                        });
                      }, 0); // Reset form sau khi đóng modal
                    }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Card Modal */}
        {isAddCardModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" role="dialog" aria-modal="true">
              <div className="modal-header">
                <h2 className="modal-title">Add New Member Card</h2>
                <button
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="modal-close-button"
                  aria-label="Close modal"
                >
                  <FaTimes className="modal-close-icon" />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-section">
                  <label>Member ID (CCCD):</label>
                  <input
                    type="text"
                    value={newMemberCard.member_id}
                    onChange={(e) =>
                      setNewMemberCard((prev) => ({
                        ...prev,
                        member_id: e.target.value,
                      }))
                    }
                    className="modal-input"
                    placeholder="Enter 12-digit CCCD"
                    maxLength={12}
                  />
                </div>
                <div className="modal-section">
                  <label>Member Name:</label>
                  <input
                    type="text"
                    value={newMemberCard.member_name}
                    onChange={(e) =>
                      setNewMemberCard((prev) => ({
                        ...prev,
                        member_name: e.target.value,
                      }))
                    }
                    className="modal-input"
                    placeholder="Enter member name"
                  />
                </div>
                <div className="modal-section">
                  <label>Member Phone Number:</label>
                  <input
                    type="text"
                    value={newMemberCard.member_phone_number}
                    onChange={(e) =>
                      setNewMemberCard((prev) => ({
                        ...prev,
                        member_phone_number: e.target.value,
                      }))
                    }
                    className="modal-input"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="modal-section">
                  <label>Member Gender:</label>
                  <select
                    value={newMemberCard.member_gender}
                    onChange={(e) =>
                      setNewMemberCard((prev) => ({
                        ...prev,
                        member_gender: e.target.value,
                      }))
                    }
                    className="modal-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    {/* Thêm các lựa chọn khác nếu cần */}
                  </select>
                </div>

                <div className="modal-actions">
                  <button onClick={handleAddCard} className="save-button">
                    Submit
                  </button>
                  <button
                    onClick={() => setIsAddCardModalOpen(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
