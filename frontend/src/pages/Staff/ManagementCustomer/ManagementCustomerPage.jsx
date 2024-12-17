import React, { useState, useMemo } from "react";
import { FaSearch, FaTimes, FaEye, FaEdit } from "react-icons/fa";
import "./ManagementCustomerPage.css";

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
      return "None";
    case 2:
      return "Bronze";
    case 3:
      return "Silver";
    case 4:
      return "Gold";
    default:
      return "Unknown";
  }
};

// Mock dữ liệu khách hàng + thẻ thành viên
const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    memberCard: {
      member_card_id: 1001,
      created_at: "2024-01-10",
      updated_at: "2024-02-15",
      total_points: 150,
      card_issuer: 101,
      branch_created: 1,
      card_type_id: 2, // Bronze
      member_id: 1,
      member_name: "John Doe",
      member_phone_number: "123-456-7890",
      member_gender: "Male",
      is_active: true,
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "098-765-4321",
    memberCard: {
      member_card_id: 1002,
      created_at: "2024-01-12",
      updated_at: "2024-02-18",
      total_points: 200,
      card_issuer: 102,
      branch_created: 2,
      card_type_id: 1, // None
      member_id: 2,
      member_name: "Jane Smith",
      member_phone_number: "098-765-4321",
      member_gender: "Female",
      is_active: true,
    },
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alicej@example.com",
    phone: "555-123-4567",
    memberCard: {
      member_card_id: 1003,
      created_at: "2024-01-15",
      updated_at: "2024-02-20",
      total_points: 50,
      card_issuer: 101,
      branch_created: 1,
      card_type_id: 3, // Silver
      member_id: 3,
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

  // Modal state for Detail View
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Modal state for Staff Detail
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Modal state for Edit Customer
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
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
      email: customer.email,
      phone: customer.phone,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = () => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === editCustomer.id
          ? {
              ...c,
              name: editCustomer.name,
              email: editCustomer.email,
              phone: editCustomer.phone,
            }
          : c
      )
    );
    closeEditModal();
  };

  // Modal state for Edit Card Level
  const [isEditCardLevelModalOpen, setIsEditCardLevelModalOpen] =
    useState(false);
  const [selectedCustomerForLevel, setSelectedCustomerForLevel] =
    useState(null);
  const [newCardLevel, setNewCardLevel] = useState(1); // Default to 'None'

  // Handle changing the member card level
  const handleEditCardLevel = (customer) => {
    setSelectedCustomerForLevel(customer);
    setNewCardLevel(customer.memberCard.card_type_id); // Set current card level
    setIsEditCardLevelModalOpen(true);
  };

  const closeEditCardLevelModal = () => {
    setIsEditCardLevelModalOpen(false);
    setSelectedCustomerForLevel(null);
  };

  const handleSaveCardLevel = () => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === selectedCustomerForLevel.id
          ? {
              ...c,
              memberCard: {
                ...c.memberCard,
                card_type_id: newCardLevel, // Update the card type id
              },
            }
          : c
      )
    );
    closeEditCardLevelModal();
  };

  return (
    <div className="customer-list-container">
      <div className="customer-list-wrapper">
        <h1 className="customer-title">Customer Management</h1>

        {/* Search Bar */}
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

        {/* Customer Table */}
        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>Member Card</th>
                <th>Adjust Level</th>
                <th>ISSUER</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td
                    className={`member-card ${getMemberCardRank(
                      customer.memberCard.card_type_id
                    )}`}
                  >
                    {getMemberCardRank(customer.memberCard.card_type_id)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditCardLevel(customer)}
                      className="edit-card-level-button"
                    >
                      Adjust
                    </button>
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
              {currentCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-results">
                    No customers found.
                  </td>
                </tr>
              )}
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

                <div className="modal-actions">
                  <button onClick={handleSaveEdit} className="save-button">
                    Save
                  </button>
                  <button onClick={closeEditModal} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Card Level Modal */}
        {isEditCardLevelModalOpen && selectedCustomerForLevel && (
          <div className="modal-overlay">
            <div className="modal-content" role="dialog" aria-modal="true">
              <div className="modal-header">
                <h2 className="modal-title">
                  Adjust Member Card Level - {selectedCustomerForLevel.name}
                </h2>
                <button
                  onClick={closeEditCardLevelModal}
                  className="modal-close-button"
                  aria-label="Close modal"
                >
                  <FaTimes className="modal-close-icon" />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-section">
                  <label>Choose Card Level:</label>
                  <select
                    value={newCardLevel}
                    onChange={(e) => setNewCardLevel(Number(e.target.value))}
                    className="modal-input"
                  >
                    <option value={1}>None</option>
                    <option value={2}>Bronze</option>
                    <option value={3}>Silver</option>
                    <option value={4}>Gold</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button onClick={handleSaveCardLevel} className="save-button">
                    Save
                  </button>
                  <button
                    onClick={closeEditCardLevelModal}
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
