import React, { useState } from "react";
import { FaStar, FaReceipt, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "./HistoryPage.css";
import { toast } from "react-toastify";

export const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState(""); // for search by order ID
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Number of items per page
  const navigate = useNavigate();
  const [ratingSubmitted, setRatingSubmitted] = useState({});

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
    {
      id: 3,
      date: "2024-01-12",
      items: [
        { name: "Veggie Burger", price: 10.99 },
        { name: "Onion Rings", price: 5.99 },
      ],
      total: 16.98,
      status: "Pending",
    },
    // Add more orders for testing pagination
  ];

  const reservationHistory = [
    {
      id: 1,
      date: "2024-01-20",
      time: "19:00",
      guests: 4,
      tableNumber: "A12",
    },
    {
      id: 2,
      date: "2024-01-18",
      time: "20:30",
      guests: 2,
      tableNumber: "B08",
    },
  ];

  // Initialize ratings state for each reservation and each criterion
  const initialRatings = reservationHistory.reduce((acc, reservation) => {
    acc[reservation.id] = {
      service: 0,
      location: 0,
      foodQuality: 0,
      price: 0,
      ambience: 0,
    };
    return acc;
  }, {});

  const [ratings, setRatings] = useState(initialRatings);

  const handleRatingChange = (reservationId, criterion, rating) => {
    setRatings((prev) => ({
      ...prev,
      [reservationId]: {
        ...prev[reservationId],
        [criterion]: rating,
      },
    }));
  };

  const handleSubmitReservation = async (reservationId) => {
    const reservationRatings = ratings[reservationId];
    const body = {
      service_rating: reservationRatings.service.toString(),
      location_rating: reservationRatings.location.toString(),
      food_rating: reservationRatings.foodQuality.toString(),
      price_rating: reservationRatings.price.toString(),
      ambiance_rating: reservationRatings.ambience.toString(),
    };
    console.log(body);
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservation/${reservationId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        setRatingSubmitted((prev) => ({
          ...prev,
          [reservationId]: true,
        }));
        toast.success(`Thank you for your feedback!`, {
          position: "top-right",
          autoClose: 1500,
        });
      } else {
        alert("Failed to submit your feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again later.");
    }

    // Optionally reset the ratings after submission
    setRatings((prev) => ({
      ...prev,
      [reservationId]: {
        service: 0,
        location: 0,
        foodQuality: 0,
        price: 0,
        ambience: 0,
      },
    }));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  // Filter orders by search query
  const filteredOrders = orderHistory.filter((order) =>
    order.id.toString().includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <>
            <div className="search-bar-his">
              <div className="searchid-icon">
                <FaSearch />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by Order ID"
              />
            </div>
            <div className="orders">
              {currentOrders.map((order) => (
                <Link to={`/order-detail/${order.id}`} key={order.id}>
                  <div className="card">
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

            {/* Pagination */}
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredOrders.length / itemsPerPage) },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`page-button ${
                    pageNumber === currentPage ? "active" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </>
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
                <div className="rating-form">
                  {[
                    "service",
                    "location",
                    "foodQuality",
                    "price",
                    "ambience",
                  ].map((criterion) => (
                    <div key={criterion} className="rating-criterion">
                      <label>
                        {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                        :
                      </label>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              handleRatingChange(
                                reservation.id,
                                criterion,
                                star
                              )
                            }
                            className={`star ${
                              star <= ratings[reservation.id][criterion]
                                ? "active"
                                : ""
                            }`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    className="submit-button"
                    onClick={() => handleSubmitReservation(reservation.id)}
                  >
                    Submit Ratings
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
