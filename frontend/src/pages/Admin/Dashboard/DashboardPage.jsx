import React, { useState, useEffect } from "react";
import { FiDownload, FiRefreshCcw } from "react-icons/fi";
import { FaStore, FaChartLine, FaUsers, FaFileInvoice } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./DashboardPage.css"; // Importing the CSS

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState("monthly");
  const [region, setRegion] = useState("all");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    sales: 0,
    invoices: 0,
    customers: 0,
    profit: 0,
    revenueStats: {
      labels: [],
      datasets: [],
    },
    customerStats: {
      labels: [],
      datasets: [],
    },
  });

  const dummyData = {
    sales: 2500000,
    invoices: 1250,
    customers: 850,
    profit: 750000,
    revenueStats: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Monthly Revenue",
          data: [30000, 45000, 35000, 50000, 49000, 60000],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    customerStats: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Table Service",
          data: [300, 450, 350, 500, 490, 600],
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Online Orders",
          data: [200, 300, 250, 400, 380, 450],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    },
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, region, branch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(dummyData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="stat-card">
      <div className="stat-card-header">
        <div>
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
        </div>
        <div className={`${color} stat-card-icon`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-message">
          <strong>Error!</strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="revenue-dashboard">
      <div className="dashboard-container">
        <div className="header">
          <h1 className="title">Revenue Dashboard</h1>
          <div className="filters">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
              aria-label="Select date range"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="filter-select"
              aria-label="Select region"
            >
              <option value="all">All Regions</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>

            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="filter-select"
              aria-label="Select branch"
            >
              <option value="main">Main Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
              <option value="branch3">Branch 3</option>
            </select>

            <div className="actions">
              <button
                onClick={fetchData}
                className="refresh-button"
                aria-label="Refresh dashboard"
              >
                <FiRefreshCcw className="mr-2" />
                Refresh
              </button>
              <button className="export-button" aria-label="Download report">
                <FiDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="stats">
          <StatCard
            icon={FaStore}
            title="Total Sales"
            value={`$${data.sales.toLocaleString()}`}
            color="bg-blue-500"
          />
          <StatCard
            icon={FaFileInvoice}
            title="Invoices"
            value={data.invoices}
            color="bg-green-500"
          />
          <StatCard
            icon={FaUsers}
            title="Customers"
            value={data.customers}
            color="bg-purple-500"
          />
          <StatCard
            icon={FaChartLine}
            title="Profit"
            value={`$${data.profit.toLocaleString()}`}
            color="bg-red-500"
          />
        </div>

        <div className="charts">
          <div className="chart-container">
            <h2 className="chart-title">Revenue Statistics</h2>
            <Line data={data.revenueStats} options={{ responsive: true }} />
          </div>
          <div className="chart-container">
            <h2 className="chart-title">Customer Service Type Statistics</h2>
            <Bar
              data={data.customerStats}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Number of Customers",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
