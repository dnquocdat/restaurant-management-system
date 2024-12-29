import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineEdit } from "react-icons/ai";
import { BiSortAlt2 } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./StatusModal.css";
import "./OrderOnlinePage.css";
import { http } from "../../../helpers/http";
import { toast } from "react-toastify";

export const OrderOnlinePage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("orderTime");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Mock data
  const [mockOrders, setMockOrders] = useState([]);
  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    fetchOrder(currentPage, 5, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchOrder = async (page = 1, limit = 5, query = "") => {
    try {
      const branchId = localStorage.getItem("staff_branch");
      if (!branchId) throw new Error("Branch ID not found in localStorage");

      const params = new URLSearchParams({
        limit,
        page,
        query,
      });

      const fetchMenu = await http(
        `/order/branch/${branchId}?${params.toString()}`,
        "GET"
      );

      const data = fetchMenu.data;
      console.log(data);
      if (data) {
        setMockOrders(data.orders);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
        });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      setError("Failed to fetch dishes. Please try again later.");
    }
  };

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
    try {
      const fetchUpdateOrderStatus = http(`/order/${orderId}`, "PATCH", {
        order_status: newStatus,
      });
      console.log(fetchUpdateOrderStatus);
      if (fetchUpdateOrderStatus) {
        toast.success(`Update status order online successfully!`, {
          position: "top-right",
          autoClose: 1500,
        });
      }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
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
              <option value="billed">Billed</option>
              <option value="in-delivery">In Delivery</option>
              <option value="delivered">Delivered</option>
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
      billed: "badge-billed",
      "in-delivery": "badge-in-delivery",
      delivered: "badge-delivered",
      cancelled: "badge-cancelled",
    };

    return (
      <span className={`status-badge ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
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

        {/* pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
            aria-label="Previous page"
          >
            <FiChevronLeft className="pagination-icon" />
          </button>
          <span className="pagination-info">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, pagination.totalPages)
              )
            }
            disabled={currentPage === pagination.totalPages}
            className="pagination-button"
            aria-label="Next page"
          >
            <FiChevronRight className="pagination-icon" />
          </button>
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
