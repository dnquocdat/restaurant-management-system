import React, { useState, useEffect } from "react";
import {
  FaSort,
  FaSpinner,
  FaEye,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./ListReservationPage.css";
import { Link } from "react-router-dom";

export const ListReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");

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
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * modifier;
    if (a[sortField] > b[sortField]) return 1 * modifier;
    return 0;
  });

  const handleViewDetails = (id) => {
    console.log(`Viewing details for reservation ${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container" role="status">
        <FaSpinner className="loading-icon" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

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
                    onClick={() => field !== "actions" && handleSort(field)}
                    disabled={field === "actions"}
                  >
                    {label}
                    {field !== "actions" && (
                      <FaSort
                        className={`sort-icon ${
                          sortField === field ? "active-sort" : ""
                        }`}
                      />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedReservations.map((reservation) => (
              <tr key={reservation.id}>
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
                    }`}
                  >
                    {reservation.status}
                  </span>
                </td>
                {/* <td>${reservation.amount.toFixed(2)}</td> */}
                {/* <td>
                  <button
                    onClick={() => handleViewDetails(reservation.id)}
                    className="view-button"
                  >
                    <FaEye />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
