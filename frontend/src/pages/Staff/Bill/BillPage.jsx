import React, { useState } from "react";
import {
  FaFileInvoice,
  FaDesktop,
  FaGlobe,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import "./BillPage.css";

const mockInvoices = [
  {
    id: 1,
    type: "desk",
    invoiceNumber: "INV-2024-001",
    date: "2024-01-15",
    customerName: "John Doe",
    amount: 1500.0,
    discount: 0.1, // 10% discount
    items: [
      { name: "Product A", quantity: 2, price: 500 },
      { name: "Product B", quantity: 1, price: 500 },
    ],
  },
  {
    id: 2,
    type: "online",
    invoiceNumber: "INV-2024-002",
    date: "2024-01-16",
    customerName: "Jane Smith",
    amount: 2500.0,
    discount: 0.2, // 20% discount
    items: [
      { name: "Service X", quantity: 1, price: 1500 },
      { name: "Service Y", quantity: 2, price: 500 },
    ],
  },
];

const mockOnlineInvoices = [
  {
    id: 3,
    type: "online",
    invoiceNumber: "ONL-2024-001",
    date: "2024-01-17",
    customerName: "Alice Johnson",
    amount: 3000.0,
    discount: 0.15, // 15% discount
    items: [
      { name: "Digital Service A", quantity: 1, price: 2000 },
      { name: "Digital Product B", quantity: 2, price: 500 },
    ],
  },
  {
    id: 4,
    type: "online",
    invoiceNumber: "ONL-2024-002",
    date: "2024-01-18",
    customerName: "Bob Wilson",
    amount: 1800.0,
    discount: 0.1, // 10% discount
    items: [{ name: "Online Course", quantity: 1, price: 1800 }],
  },
];

export const BillPage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Số lượng hóa đơn mỗi trang

  const filteredInvoices = mockInvoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOnlineInvoices = mockOnlineInvoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices =
    activeTab === "table"
      ? filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)
      : filteredOnlineInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(
    (activeTab === "table"
      ? filteredInvoices.length
      : filteredOnlineInvoices.length) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="invoice-list-container">
      <div className="invoice-list-wrapper">
        <h1 className="invoice-title">Invoices</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "table" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("table");
              setCurrentPage(1);
            }}
          >
            Invoice Table
          </button>
          <button
            className={`tab-button ${activeTab === "online" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("online");
              setCurrentPage(1);
            }}
          >
            Online Invoices
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Invoice ID"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Invoice Table */}
        <div className="table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customerName}</td>
                  <td>{invoice.date}</td>
                  <td>${invoice.amount.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(invoice)}
                      className="view-details-button"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`page-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && selectedInvoice && (
          <div className="modal-overlay">
            <div className="modal-content" role="dialog" aria-modal="true">
              <div className="modal-header">
                <h2 className="modal-title">
                  Invoice Details - {selectedInvoice.invoiceNumber}
                </h2>
                <button
                  onClick={closeModal}
                  className="modal-close-button"
                  aria-label="Close modal"
                >
                  <FaTimes className="modal-close-icon" />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <span className="modal-label">Customer:</span>
                  <span className="modal-value">
                    {selectedInvoice.customerName}
                  </span>
                </div>

                <div className="modal-items">
                  <h3 className="modal-subtitle">Items:</h3>
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="modal-item">
                      <div className="modal-item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="modal-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">
                    ${selectedInvoice.amount.toFixed(2)}
                  </span>
                </div>

                {/* Add Discount and Final Amount */}
                <div className="modal-discount">
                  <span className="discount-label">Discount Applied:</span>
                  <span className="discount-amount">
                    {selectedInvoice.discount * 100}% (
                    {(
                      selectedInvoice.amount * selectedInvoice.discount
                    ).toFixed(2)}
                    )
                  </span>
                </div>

                <div className="modal-final">
                  <span className="final-label">Final Amount:</span>
                  <span className="final-amount">
                    $
                    {(
                      selectedInvoice.amount *
                      (1 - selectedInvoice.discount)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
