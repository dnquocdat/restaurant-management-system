import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import "./CreateSlip.css";
export const CreateSlipPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    numberOfGuests: "",
    selectedTable: "",
    date: new Date().toLocaleDateString(),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tables = [
    { id: 1, name: "Table 1" },
    { id: 2, name: "Table 2" },
    { id: 3, name: "Table 3" },
    { id: 4, name: "Table 4" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    const guests = Number(formData.numberOfGuests);
    if (isNaN(guests) || guests <= 0) {
      newErrors.numberOfGuests = "Number of guests must be greater than 0";
    }

    if (!formData.selectedTable) {
      newErrors.selectedTable = "Please select a table";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="reservation-container">
      <div className="reservation-wrapper">
        <h2 className="reservation-title">Reservation Form</h2>
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group">
            <label htmlFor="customerName" className="form-label">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              id="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className={`form-input ${
                errors.customerName ? "input-error" : ""
              }`}
              placeholder="Enter customer name"
              aria-label="Customer name input"
            />
            {errors.customerName && (
              <p className="error-message">{errors.customerName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="numberOfGuests" className="form-label">
              Number of Guests
            </label>
            <input
              type="number"
              name="numberOfGuests"
              id="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              className={`form-input ${
                errors.numberOfGuests ? "input-error" : ""
              }`}
              placeholder="Enter number of guests"
              min="1"
              aria-label="Number of guests input"
            />
            {errors.numberOfGuests && (
              <p className="error-message">{errors.numberOfGuests}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="text"
              name="date"
              id="date"
              value={formData.date}
              disabled
              className="form-input disabled-input"
              aria-label="Date input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="selectedTable" className="form-label">
              Select Table
            </label>
            <select
              name="selectedTable"
              id="selectedTable"
              value={formData.selectedTable}
              onChange={handleInputChange}
              className={`form-select ${
                errors.selectedTable ? "input-error" : ""
              }`}
              aria-label="Table selection dropdown"
            >
              <option value="">Select a table</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
            {errors.selectedTable && (
              <p className="error-message">{errors.selectedTable}</p>
            )}
          </div>

          <div className="form-submit">
            <button type="submit" className="submit-button">
              Submit Reservation
            </button>
          </div>
        </form>

        {/* <div className="reservation-preview">
          <h3 className="preview-title">Preview</h3>
          <div className="preview-content">
            <p>
              <span className="preview-label">Customer Name:</span>{" "}
              {formData.customerName || "Not specified"}
            </p>
            <p>
              <span className="preview-label">Number of Guests:</span>{" "}
              {formData.numberOfGuests || "Not specified"}
            </p>
            <p>
              <span className="preview-label">Date:</span> {formData.date}
            </p>
            <p>
              <span className="preview-label">Table:</span>{" "}
              {formData.selectedTable
                ? tables.find((t) => t.id === Number(formData.selectedTable))
                    ?.name
                : "Not specified"}
            </p>
          </div>
        </div> */}

        {isSubmitted && (
          <div className="submission-alert">
            <FiCheck className="check-icon" />
            <span>Reservation submitted successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
