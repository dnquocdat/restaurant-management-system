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
import { toast } from "react-toastify";
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
      time: "18:00",
      tableNumber: 5,
      customerName: "John Smith",
      guestCount: 2,
      status: "waiting_for_guest",
      amount: 150.0,
      email: "john.smith@example.com",
      phone: "+1 234-567-8900",
    },
    {
      id: 2,
      code: "RES002",
      date: "2024-02-16",
      time: "19:30",
      tableNumber: 3,
      customerName: "Emma Wilson",
      guestCount: 4,
      status: "table_in_use",
      amount: 280.0,
      email: "emma.w@example.com",
      phone: "+1 234-567-8901",
    },
    {
      id: 3,
      code: "RES003",
      date: "2024-02-17",
      time: "20:00",
      tableNumber: 7,
      customerName: "Michael Brown",
      guestCount: 3,
      status: "completed",
      amount: 210.0,
      email: "michael.b@example.com",
      phone: "+1 234-567-8902",
    },
    {
      id: 4,
      code: "RES004",
      date: "2024-02-18",
      time: "21:00",
      tableNumber: 4,
      customerName: "Sophia Davis",
      guestCount: 5,
      status: "canceled",
      amount: 320.0,
      email: "sophia.d@example.com",
      phone: "+1 234-567-8903",
    },
    {
      id: 5,
      code: "RES005",
      date: "2024-02-19",
      time: "17:45",
      tableNumber: 2,
      customerName: "Chris Lee",
      guestCount: 1,
      status: "waiting_for_guest",
      amount: 75.0,
      email: "chris.lee@example.com",
      phone: "+1 234-567-8904",
    },
    {
      id: 6,
      code: "RES006",
      date: "2024-02-20",
      time: "19:00",
      tableNumber: 6,
      customerName: "Olivia Johnson",
      guestCount: 3,
      status: "table_in_use",
      amount: 180.0,
      email: "olivia.j@example.com",
      phone: "+1 234-567-8905",
    },
    {
      id: 7,
      code: "RES007",
      date: "2024-02-21",
      time: "20:30",
      tableNumber: 1,
      customerName: "James Carter",
      guestCount: 6,
      status: "completed",
      amount: 450.0,
      email: "james.c@example.com",
      phone: "+1 234-567-8906",
    },
    {
      id: 8,
      code: "RES008",
      date: "2024-02-22",
      time: "18:15",
      tableNumber: 8,
      customerName: "Liam Martinez",
      guestCount: 2,
      status: "canceled",
      amount: 120.0,
      email: "liam.m@example.com",
      phone: "+1 234-567-8907",
    },
    {
      id: 9,
      code: "RES009",
      date: "2024-02-23",
      time: "19:45",
      tableNumber: 10,
      customerName: "Isabella Hernandez",
      guestCount: 4,
      status: "waiting_for_guest",
      amount: 300.0,
      email: "isabella.h@example.com",
      phone: "+1 234-567-8908",
    },
    {
      id: 10,
      code: "RES010",
      date: "2024-02-24",
      time: "20:15",
      tableNumber: 9,
      customerName: "Mason Garcia",
      guestCount: 3,
      status: "table_in_use",
      amount: 270.0,
      email: "mason.g@example.com",
      phone: "+1 234-567-8909",
    },
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

  const deleteReservation = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservation/${id}`, //:id selected res
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }
      // Cập nhật danh sách reservations sau khi xóa thành công
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "Canceled" } : res
        )
      );
      toast.success(`Reservation ${id} has been deleted successfully.`, {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Failed to delete the reservation. Please try again.");
    }
  };

  const updateReservationStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservation/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }
      const updatedReservation = await response.json();

      // Cập nhật trạng thái reservation trong danh sách
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "table_in_use" } : res
        )
      );

      toast.success(`Reservation ${id} has been updated to ${newStatus}.`, {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Error updating reservation status:", error);
      alert("Failed to update reservation status. Please try again.");
    }
  };

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">Reservations</h1>

      {/* Search Bar */}
      <div className="search-bar-rs">
        <input
          type="text"
          placeholder="Search by Reservation Code or ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search Reservations"
        />
        <AiOutlineSearch className="search-icon-rs" />
      </div>
      {/* Reservations Table */}
      <div className="table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              {[
                { field: "code", label: "Reservation Code" },
                { field: "date", label: "Date" },
                { field: "time", label: "Time" }, // New Time column
                { field: "tableNumber", label: "Table Number" }, // New Table Number column
                { field: "customerName", label: "Customer Name" },
                { field: "guestCount", label: "Guests" },
                { field: "status", label: "Status" },
                { field: "action", label: "Action" },
              ].map(({ field, label }) => (
                <th key={field}>
                  <button
                    className="sort-button"
                    onClick={() => handleSort(field)}
                    aria-label={`Sort by ${label}`}
                  >
                    {label}
                    {/* <FaSort
                      className={`sort-icon ${
                        sortField === field
                          ? `active-sort ${sortDirection}`
                          : ""
                      }`}
                    /> */}
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
                  <td>{reservation.time}</td> {/* New time field */}
                  <td>{reservation.tableNumber}</td>{" "}
                  {/* New tableNumber field */}
                  <td>
                    <div>{reservation.customerName}</div>
                    <div className="email">{reservation.email}</div>
                  </td>
                  <td>{reservation.guestCount}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        reservation.status === "waiting_for_guest"
                          ? "status-waiting"
                          : reservation.status === "table_in_use"
                          ? "status-in-use"
                          : reservation.status === "completed"
                          ? "status-completed"
                          : "status-canceled"
                      } ${
                        reservation.status === "waiting_for_guest"
                          ? "clickable-status"
                          : ""
                      }`}
                      onClick={(e) => {
                        if (reservation.status === "waiting_for_guest") {
                          handleStatusClick(e, reservation.id);
                        }
                      }}
                      role={
                        reservation.status === "waiting_for_guest"
                          ? "button"
                          : "text"
                      }
                      tabIndex={
                        reservation.status === "waiting_for_guest" ? 0 : -1
                      }
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          reservation.status === "waiting_for_guest"
                        ) {
                          handleStatusClick(e, reservation.id);
                        }
                      }}
                      aria-label={
                        reservation.status === "waiting_for_guest"
                          ? `Click to confirm or cancel reservation ${reservation.code}`
                          : ""
                      }
                    >
                      {reservation.status.replaceAll("_", " ")}{" "}
                      {/* Hiển thị dạng thân thiện */}
                    </span>
                  </td>
                  {/* action */}
                  <td>
                    {reservation.status === "waiting_for_guest" && (
                      <>
                        <button
                          className="confirm-res-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const confirmAction = window.confirm(
                              `Confirm table-in-use for reservation ${reservation.code}?`
                            );
                            if (confirmAction) {
                              updateReservationStatus(
                                reservation.id,
                                "table_in_use"
                              );
                            }
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          className="cancel-res-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const cancelAction = window.confirm(
                              `Cancel reservation ${reservation.code}?`
                            );
                            if (cancelAction) {
                              deleteReservation(reservation.id); // Gọi API DELETE
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <FaArrowLeft />
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};
