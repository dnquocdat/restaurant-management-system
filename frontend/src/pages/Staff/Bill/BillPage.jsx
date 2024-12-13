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
    items: [{ name: "Online Course", quantity: 1, price: 1800 }],
  },
];
export const BillPage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("table");

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

  return (
    <div className="invoice-list-container">
      <div className="invoice-list-wrapper">
        <h1 className="invoice-title">Invoices</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "table" ? "active" : ""}`}
            onClick={() => setActiveTab("table")}
          >
            Invoice Table
          </button>
          <button
            className={`tab-button ${activeTab === "online" ? "active" : ""}`}
            onClick={() => setActiveTab("online")}
          >
            Online Invoices
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" style={{ marginLeft: 25 }} />
          <input
            type="text"
            placeholder="Search by Invoice ID"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === "table" ? (
          /* Regular Invoice Table */
          <div className="table-container">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Table Invoice ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
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
        ) : (
          /* Online Invoice Table */
          <div className="table-container">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Online Invoice ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOnlineInvoices.map((invoice) => (
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
        )}

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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
