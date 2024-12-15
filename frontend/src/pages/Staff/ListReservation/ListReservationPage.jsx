import React, { useState, useEffect } from "react";
import {
  FaSort,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./ListReservationPage.css";

export const ListReservationPage = () => {
  // State variables
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // Constants for pagination
  const reservationsPerPage = 10;

  // Mock data
  const mockData = [
    {
      id: 1,
      code: "RES001",
      date: "2024-02-15",
      customerName: "John Smith",
      guestCount: 2,
      status: "Confirmed",
      amount: 150.0,
      email: "john.smith@example.com",
      phone: "+1 234-567-8900",
    },
    {
      id: 2,
      code: "RES002",
      date: "2024-02-16",
      customerName: "Emma Wilson",
      guestCount: 4,
      status: "Pending",
      amount: 280.0,
      email: "emma.w@example.com",
      phone: "+1 234-567-8901",
    },
    {
      id: 3,
      code: "RES003",
      date: "2024-02-17",
      customerName: "Michael Brown",
      guestCount: 3,
      status: "Confirmed",
      amount: 210.0,
      email: "michael.b@example.com",
      phone: "+1 234-567-8902",
    },
    // Add more mock data as needed
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReservations(mockData);
        setError(null);
      } catch (err) {
        setError("Failed to load reservations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort direction if same field is clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter reservations based on search query
  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.id.toString().includes(searchQuery)
  );

  // Sort filtered reservations
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;
    let aField = a[sortField];
    let bField = b[sortField];

    // Handle date sorting
    if (sortField === "date") {
      aField = new Date(aField);
      bField = new Date(bField);
    }

    if (aField < bField) return -1 * modifier;
    if (aField > bField) return 1 * modifier;
    return 0;
  });

  // Pagination calculations
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = sortedReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(
    filteredReservations.length / reservationsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle previous page
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Handle next page
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Handle status click to confirm status change
  const handleStatusClick = (e, id) => {
    e.stopPropagation(); // Prevent triggering row click
    const reservation = reservations.find((res) => res.id === id);
    if (reservation.status === "Pending") {
      const confirmChange = window.confirm(
        `Are you sure you want to confirm reservation ${reservation.code}?`
      );
      if (confirmChange) {
        setReservations((prevReservations) =>
          prevReservations.map((res) =>
            res.id === id ? { ...res, status: "Confirmed" } : res
          )
        );
      }
    }
  };

  // Handle row click to navigate to order details
  const handleRowClick = (id, status) => {
    if (status === "Pending") {
      return;
    }
    navigate("/staff/order", { state: { reservationId: id } });
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container" role="status">
        <FaSpinner className="loading-icon" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container" role="alert">
        <FaExclamationTriangle className="error-icon" />
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">Reservations</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Reservation Code or ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search Reservations"
        />
        <AiOutlineSearch className="search-icon" />
      </div>

      {/* Reservations Table */}
      <div className="table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              {[
                { field: "code", label: "Reservation Code" },
                { field: "date", label: "Date" },
                { field: "customerName", label: "Customer Name" },
                { field: "guestCount", label: "Guests" },
                { field: "status", label: "Status" },
              ].map(({ field, label }) => (
                <th key={field}>
                  <button
                    className="sort-button"
                    onClick={() => handleSort(field)}
                    aria-label={`Sort by ${label}`}
                  >
                    {label}
                    <FaSort
                      className={`sort-icon ${
                        sortField === field
                          ? `active-sort ${sortDirection}`
                          : ""
                      }`}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentReservations.length > 0 ? (
              currentReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="reservation-row"
                  onClick={() =>
                    handleRowClick(reservation.id, reservation.status)
                  }
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleRowClick(reservation.id, reservation.status);
                    }
                  }}
                  aria-label={`View details for reservation ${reservation.code}`}
                >
                  <td>
                    <span className="code-badge">{reservation.code}</span>
                  </td>
                  <td>{new Date(reservation.date).toLocaleDateString()}</td>
                  <td>
                    <div>{reservation.customerName}</div>
                    <div className="email">{reservation.email}</div>
                  </td>
                  <td>{reservation.guestCount}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        reservation.status === "Confirmed"
                          ? "status-confirmed"
                          : "status-pending"
                      } ${
                        reservation.status === "Pending"
                          ? "clickable-status"
                          : ""
                      }`}
                      onClick={(e) => handleStatusClick(e, reservation.id)}
                      role={
                        reservation.status === "Pending" ? "button" : "text"
                      }
                      tabIndex={reservation.status === "Pending" ? 0 : -1}
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          reservation.status === "Pending"
                        ) {
                          handleStatusClick(e, reservation.id);
                        }
                      }}
                      aria-label={
                        reservation.status === "Pending"
                          ? `Click to confirm reservation ${reservation.code}`
                          : ""
                      }
                    >
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
            aria-label="Previous Page"
          >
            <FaArrowLeft />
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`pagination-button ${
                  currentPage === pageNumber ? "active-page" : ""
                }`}
                aria-label={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
            aria-label="Next Page"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};
