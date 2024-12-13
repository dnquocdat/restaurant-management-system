import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineEdit } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./StatusModal.css";
import "./OrderOnlinePage.css";

export const OrderOnlinePage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("orderTime");
  const [searchQuery, setSearchQuery] = useState("");

  const ordersPerPage = 6;

  // Mock data
  const mockOrders = [
    {
      id: "ORD001",
      customerName: "John Smith",
      items: ["Burger", "Fries", "Coke"],
      totalAmount: 25.99,
      status: "pending",
      orderTime: "2024-01-20T10:30:00",
    },
    {
      id: "ORD002",
      customerName: "Emma Wilson",
      items: ["Pizza", "Salad"],
      totalAmount: 32.5,
      status: "in-progress",
      orderTime: "2024-01-20T11:15:00",
    },
    {
      id: "ORD003",
      customerName: "Michael Brown",
      items: ["Pasta", "Garlic Bread", "Wine"],
      totalAmount: 45.75,
      status: "completed",
      orderTime: "2024-01-20T09:45:00",
    },
    // Add more mock orders as needed
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    })
    .filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "orderTime") {
        return new Date(b.orderTime) - new Date(a.orderTime);
      }
      if (sortBy === "totalAmount") {
        return b.totalAmount - a.totalAmount;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setIsModalOpen(false);
  };

  const StatusModal = ({ order, onClose }) => {
    const [newStatus, setNewStatus] = useState(order.status);

    return (
      <div className="modal-overlay">
        <div className="modal-content" role="dialog" aria-modal="true">
          <h2 className="modal-title">Update Order Status</h2>
          <div className="modal-details">
            <p>
              <span className="modal-label">Order ID:</span> {order.id}
            </p>
            <p>
              <span className="modal-label">Customer:</span>{" "}
              {order.customerName}
            </p>
            <p>
              <span className="modal-label">Total Amount:</span> $
              {order.totalAmount}
            </p>
          </div>
          <div className="modal-select">
            <label htmlFor="status">Select New Status:</label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="modal-actions">
            <button onClick={onClose} className="modal-button cancel-button">
              Cancel
            </button>
            <button
              onClick={() => handleStatusUpdate(order.id, newStatus)}
              className="modal-button update-button"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      pending: "badge-pending",
      "in-progress": "badge-in-progress",
      completed: "badge-completed",
      cancelled: "badge-cancelled",
    };

    return (
      <span className={`status-badge ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="order-management-container">
      <h1 className="order-management-title">Order Management</h1>

      <div className="order-management-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <AiOutlineSearch className="search-icon" />
        </div>

        <div className="filter-sort">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() =>
              setSortBy(sortBy === "orderTime" ? "totalAmount" : "orderTime")
            }
            className="sort-button"
          >
            <BiSortAlt2 className="sort-icon" />
            Sort by {sortBy === "orderTime" ? "Amount" : "Time"}
          </button>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <span key={index} className="item-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                    className="edit-button"
                    aria-label="Edit order status"
                  >
                    <AiOutlineEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div className="pagination-info">
            Showing {indexOfFirstOrder + 1} to{" "}
            {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <StatusModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};
