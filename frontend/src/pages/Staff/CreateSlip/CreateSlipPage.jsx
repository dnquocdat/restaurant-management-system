import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import {
  FiClock,
  FiUser,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateSlip.css";
export const CreateSlipPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    numberOfGuests: "",
    phone: "",
    time: "",
    date: new Date(),
    specialRequests: "", // Thêm trường này
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    // Kiểm tra số điện thoại
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone number required";
    }

    const guests = Number(formData.numberOfGuests);
    if (isNaN(guests) || guests <= 0) {
      newErrors.numberOfGuests = "Number of guests must be greater than 0";
    }

    if (!formData.time) {
      newErrors.time = "Please select a time for your reservation";
    }

    if (formData.specialRequests.length > 500) {
      newErrors.specialRequests =
        "Special requests must be under 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkAvailability = (time) => {
    // Giả sử đây là danh sách tất cả các bàn đã đặt tại các thời gian cụ thể.
    const bookedSlots = [
      { tableId: 1, time: "1:00 PM" },
      { tableId: 2, time: "1:00 PM" },
      { tableId: 3, time: "1:00 PM" },
      // Thêm các bản ghi đặt bàn khác ở đây
    ];

    // Danh sách tất cả các bàn có sẵn (ví dụ: tổng cộng 4 bàn)
    const allTables = [1, 2, 3, 4];

    // Kiểm tra xem có bàn nào trống trong thời gian đã chọn không
    const availableTable = allTables.find(
      (tableId) =>
        !bookedSlots.some(
          (slot) => slot.tableId === tableId && slot.time === time
        )
    );

    if (availableTable) {
      return { isAvailable: true, availableTable }; // Trả về bàn có sẵn
    } else {
      return { isAvailable: false }; // Không có bàn trống
    }
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
    const isValid = validateForm(); // Giả sử validateForm là hàm kiểm tra tính hợp lệ của form

    if (isValid) {
      const result = checkAvailability(formData.time); // Gọi hàm kiểm tra bàn trống tại thời gian đã chọn

      if (!result.isAvailable) {
        // Nếu không có bàn trống
        alert("Sorry, all tables are booked for the selected time.");
        return;
      }

      // Nếu có bàn trống
      alert(
        `Table ${result.availableTable} is available at the selected time.`
      );
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);

      const submissionData = {
        ...formData,
        date: formData.date.toISOString().split("T")[0], // Chuyển thành chuỗi định dạng YYYY-MM-DD
      };
      console.log("Form submitted:", submissionData);
    }
  };

  return (
    <div className="reservation-container">
      <div className="reservation-wrapper">
        <h2 className="reservation-title">Reservation Form</h2>
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group-create-slip">
            <label htmlFor="customerName" className="form-label">
              Customer Name
            </label>
            <div className="input-container">
              <FiUser className="input-icon" />
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
            </div>
            {errors.customerName && (
              <p className="error-message">{errors.customerName}</p>
            )}
          </div>

          <div className="form-group-create-slip">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <div className="input-container">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? "input-error" : ""}`}
                placeholder="Enter phone number"
                aria-label="Phone number input"
              />
            </div>
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="form-group-create-slip">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <div className="input-container">
              <FiCalendar className="input-icon" />
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                className="form-input"
                minDate={new Date()} // Ngày nhỏ nhất là ngày hiện tại
                dateFormat="yyyy-MM-dd" // Định dạng ngày
                aria-label="Date input"
              />
            </div>
          </div>

          <div className="form-group-create-slip">
            <label htmlFor="time" className="form-label">
              Time
            </label>
            <div className="input-container">
              <FiClock className="input-icon" />
              <select
                name="time"
                id="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`form-input ${errors.time ? "input-error" : ""}`}
                aria-label="Select reservation time"
              >
                <option value="">Select a time</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
            {errors.time && <p className="error-message">{errors.time}</p>}
          </div>

          <div className="form-group-create-slip">
            <label htmlFor="numberOfGuests" className="form-label">
              Number of Guests
            </label>
            <div className="input-container">
              <FiUser className="input-icon" />
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
            </div>
            {errors.numberOfGuests && (
              <p className="error-message">{errors.numberOfGuests}</p>
            )}
          </div>

          <div className="form-group-create-slip">
            <label htmlFor="specialRequests" className="form-label">
              Special Requests
            </label>
            <div className="input-container">
              <FiMessageSquare className="input-icon" />
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter any special requests (optional)"
                aria-label="Special requests input"
              ></textarea>
            </div>
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
