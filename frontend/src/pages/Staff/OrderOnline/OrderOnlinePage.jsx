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
      items: [
        { name: "Burger", quantity: 2, price: 5.0 },
        { name: "Fries", quantity: 1, price: 3.5 },
        { name: "Coke", quantity: 1, price: 2.0 },
      ],
      totalAmount: 25.99,
      discount: 0.2,
      status: "pending",
      orderTime: "2024-01-20T10:30:00",
    },
    {
      id: "ORD002",
      customerName: "Emma Wilson",
      items: [
        { name: "Pizza", quantity: 1, price: 12.0 },
        { name: "Garlic Bread", quantity: 2, price: 3.5 },
        { name: "Lemonade", quantity: 1, price: 2.5 },
      ],
      totalAmount: 27.5,
      discount: 0.1,
      status: "in-progress",
      orderTime: "2024-01-20T11:15:00",
    },
    {
      id: "ORD003",
      customerName: "Michael Brown",
      items: [
        { name: "Pasta", quantity: 1, price: 10.0 },
        { name: "Wine", quantity: 1, price: 20.0 },
        { name: "Cheesecake", quantity: 2, price: 4.5 },
      ],
      totalAmount: 39.0,
      discount: 0.15,
      status: "completed",
      orderTime: "2024-01-20T09:45:00",
    },
    {
      id: "ORD004",
      customerName: "Sophia Green",
      items: [
        { name: "Salad", quantity: 1, price: 6.5 },
        { name: "Soup", quantity: 2, price: 4.0 },
        { name: "Iced Tea", quantity: 1, price: 2.0 },
      ],
      totalAmount: 20.5,
      discount: 0.05,
      status: "cancelled",
      orderTime: "2024-01-20T08:30:00",
    },
    {
      id: "ORD005",
      customerName: "Oliver Taylor",
      items: [
        { name: "Steak", quantity: 1, price: 25.0 },
        { name: "Mashed Potatoes", quantity: 1, price: 5.5 },
        { name: "Beer", quantity: 2, price: 4.0 },
      ],
      totalAmount: 38.5,
      discount: 0.25,
      status: "pending",
      orderTime: "2024-01-20T12:00:00",
    },
    {
      id: "ORD006",
      customerName: "Ava Martinez",
      items: [
        { name: "Fish Tacos", quantity: 2, price: 6.5 },
        { name: "Rice", quantity: 1, price: 2.5 },
        { name: "Margarita", quantity: 2, price: 8.0 },
      ],
      totalAmount: 31.0,
      discount: 0.1,
      status: "completed",
      orderTime: "2024-01-20T13:30:00",
    },
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
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen("details");
                    }}
                    className="details-button-orderonline"
                    style={{
                      color: "white",
                      padding: "0 10px",
                      borderRadius: "7px",
                      border: "none",
                      background: "#3182ce",
                    }}
                    aria-label="View order details"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                    className="edit-button"
                    style={{ margin: 0 }}
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

      {isModalOpen === "details" && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2 className="modal-title">
                Order Details - {selectedOrder.id}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="close-button"
                aria-label="Close modal"
              >
                x
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <span className="modal-label">Customer:</span>
                <span className="modal-value">
                  {selectedOrder.customerName}
                </span>
              </div>

              <div className="modal-items">
                <h3 className="modal-subtitle">Items:</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="modal-item">
                    <div className="modal-item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <p className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="modal-total">
                <span className="total-label">Total:</span>
                <span className="total-amount">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="modal-discount">
                <span className="discount-label">Discount Applied:</span>
                <span className="discount-amount">
                  {selectedOrder.discount * 100}% ( $
                  {(selectedOrder.totalAmount * selectedOrder.discount).toFixed(
                    2
                  )}
                  )
                </span>
              </div>

              <div className="modal-final">
                <span className="final-label">Final Amount:</span>
                <span className="final-amount">
                  $
                  {(
                    selectedOrder.totalAmount *
                    (1 - selectedOrder.discount)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
