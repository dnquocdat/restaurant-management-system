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
import { toast } from "react-toastify";

// time picker
import dayjs from "dayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const CreateSlipPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    numberOfGuests: "",
    phone: "",
    time: "",
    date: new Date(),
    specialRequests: "", // Thêm trường này
  });
  const resetForm = () => {
    setFormData({
      customerName: "",
      numberOfGuests: "",
      phone: "",
      time: "",
      date: new Date(),
      specialRequests: "",
    });
    setErrors({});
  };
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

    if (!formData.time || !/^\d{2}:\d{2}:\d{2}$/.test(formData.time)) {
      newErrors.time = "Valid time (HH:mm:ss) is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    const result = checkAvailability(formData.time); // Check table availability
    if (!result.isAvailable) {
      alert("Sorry, all tables are booked for the selected time.");
      return;
    }

    const body = {
      cus_name: formData.customerName,
      guests_number: parseInt(formData.numberOfGuests, 10),
      phone_number: formData.phone,
      arrival_time: formData.time,
      arrival_date: formData.date.toISOString().split("T")[0], // Convert date to YYYY-MM-DD
      notes: formData.specialRequests,
    };
    console.log(body);
    try {
      const response = await fetch("http://localhost:3000/api/reservation/1", {
        //:branchId lấy trong staff
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Reservation Successful:", responseData);
      toast.success(`Reservation successfully!`, {
        position: "top-right",
        autoClose: 1500,
      });
      // setIsSubmitted(true); // Show success message
      // setTimeout(() => setIsSubmitted(false), 3000);
      resetForm();
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Failed to submit reservation. Please try again.");
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopTimePicker
                  value={
                    formData.time ? dayjs(`2000-01-01T${formData.time}`) : null
                  }
                  onChange={(newValue) => {
                    const formattedTime = dayjs(newValue).format("HH:mm:ss"); // Convert time to 24-hour format
                    setFormData({ ...formData, time: formattedTime });
                  }}
                  ampm={true} // Enable AM/PM format for user input
                  renderInput={(params) => (
                    <input
                      {...params}
                      className={`form-input ${
                        errors.time ? "input-error" : ""
                      }`}
                      aria-label="Select reservation time"
                    />
                  )}
                />
              </LocalizationProvider>
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
