import React, { useState, useEffect } from "react";
import { FaStar, FaReceipt, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "./HistoryPage.css";
import { toast } from "react-toastify";
import { http } from "../../../helpers/http";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState(""); // for search by order ID
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [ratingSubmitted, setRatingSubmitted] = useState({});

  const [orderHistory, setOrderHistory] = useState([]);

  const [reservationHistory, setReservationHistory] = useState([]);

  const itemsPerPage = 5;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const fetchOrder = async (page = 1, limit = itemsPerPage, query = "") => {
    try {
      const params = new URLSearchParams({
        limit,
        page,
        query,
      });

      const response = await http(`/order/search?${params.toString()}`, "GET");

      const data = response.data;
      if (data) {
        setOrderHistory(data.orders);
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

  const fetchReservation = async (
    page = 1,
    limit = itemsPerPage,
    query = ""
  ) => {
    try {
      const params = new URLSearchParams({
        limit,
        page,
        query,
      });

      const response = await http(
        `/reservation/search?${params.toString()}`,
        "GET"
      );

      const data = response.data;
      if (data) {
        setReservationHistory(data.reservationSlips);
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
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrder(currentPage, itemsPerPage, searchQuery);
    } else if (activeTab === "reservations") {
      fetchReservation(currentPage, itemsPerPage, searchQuery);
    }
  }, [activeTab, currentPage, searchQuery]);

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
      const response = await http(
        `/reservation/${reservationId}/review`,
        "POST",
        body
      );

      if (response) {
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
              {orderHistory.map((order) => (
                <Link
                  to={`/order-detail/${order.order_id}`}
                  key={order.order_id}
                >
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <h3>Order #{order.order_id}</h3>
                        <p>{order.date}</p>
                      </div>
                      <span className="status">{order.status}</span>
                    </div>
                    <div className="card-body">
                      <div className="total">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                        {/* doi api sua total */}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {activeTab === "orders" && orderHistory.length === 0 && (
                <p>No orders available.</p>
              )}
            </div>
          </>
        ) : (
          <div className="reservations">
            <div className="search-bar-his">
              <div className="searchid-icon">
                <FaSearch />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by Reservation ID"
              />
            </div>
            {reservationHistory.map((reservation) => (
              <div key={reservation.reservation_slip_id} className="card">
                <div className="card-header">
                  <h3>Table {reservation.table_number}</h3>
                  <p>
                    {reservation.arrival_date} at {reservation.arrival_time}
                  </p>
                  <p>
                    {reservation.guests_number}{" "}
                    {reservation.guests_number === 1 ? "Guest" : "Guests"}
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
                                reservation.reservation_slip_id,
                                criterion,
                                star
                              )
                            }
                            className={`star ${
                              star <=
                              ratings[reservation.reservation_slip_id][
                                criterion
                              ]
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
            {activeTab === "reservations" &&
              reservationHistory.length === 0 && (
                <p>No reservations available.</p>
              )}
          </div>
        )}

        {/* Pagination */}
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
    </div>
  );
};
