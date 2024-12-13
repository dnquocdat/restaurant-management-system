import React, { useState } from "react";
import { FaStar, FaReceipt, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HistoryPage.css";
import { Link } from "react-router-dom";

export const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  const orderHistory = [
    {
      id: 1,
      date: "2024-01-15",
      items: [
        { name: "Margherita Pizza", price: 12.99 },
        { name: "Caesar Salad", price: 8.99 },
      ],
      total: 21.98,
      status: "Delivered",
    },
    {
      id: 2,
      date: "2024-01-14",
      items: [
        { name: "Chicken Burger", price: 9.99 },
        { name: "French Fries", price: 4.99 },
      ],
      total: 14.98,
      status: "Delivered",
    },
  ];

  const reservationHistory = [
    {
      id: 1,
      date: "2024-01-20",
      time: "19:00",
      guests: 4,
      tableNumber: "A12",
      rating: 4,
    },
    {
      id: 2,
      date: "2024-01-18",
      time: "20:30",
      guests: 2,
      tableNumber: "B08",
      rating: 5,
    },
  ];

  const [ratings, setRatings] = useState(
    reservationHistory.reduce((acc, reservation) => {
      acc[reservation.id] = reservation.rating;
      return acc;
    }, {})
  );

  const handleRatingChange = (reservationId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [reservationId]: rating,
    }));
  };

  return (
    <div className="activity-history-container">
      <h1 className="activity-history-title">Activity History</h1>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("orders")}
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
        >
          <FaReceipt className="tab-icon" />
          Order History
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`tab-button ${
            activeTab === "reservations" ? "active" : ""
          }`}
        >
          <FaCalendarAlt className="tab-icon" />
          Table Reservations
        </button>
      </div>

      <div className="content">
        {activeTab === "orders" ? (
          <div className="orders">
            {orderHistory.map((order) => (
              <Link to={`/order-detail/${order.id}`}>
                <div key={order.id} className="card">
                  <div className="card-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p>{order.date}</p>
                    </div>
                    <span className="status">{order.status}</span>
                  </div>
                  <div className="card-body">
                    {order.items.map((item, index) => (
                      <div key={index} className="item">
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="total">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="reservations">
            {reservationHistory.map((reservation) => (
              <div key={reservation.id} className="card">
                <div className="card-header">
                  <h3>Table {reservation.tableNumber}</h3>
                  <p>
                    {reservation.date} at {reservation.time}
                  </p>
                  <p>
                    {reservation.guests}{" "}
                    {reservation.guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
                <div className="rating">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(reservation.id, star)}
                        className={`star ${
                          star <= ratings[reservation.id] ? "active" : ""
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  <span>Your rating: {ratings[reservation.id]} stars</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
