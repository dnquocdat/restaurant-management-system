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
  // Main filter states
  const [region, setRegion] = useState("all");
  const [branch, setBranch] = useState("main");
  const [periodType, setPeriodType] = useState("daily");

  // Temporary filter states for selections
  const [tempRegion, setTempRegion] = useState("all");
  const [tempBranch, setTempBranch] = useState("main");
  const [tempPeriodType, setTempPeriodType] = useState("daily");

  // Dynamic filter states based on periodType
  const [dailyFilters, setDailyFilters] = useState({
    month: "",
    year: "",
  });

  const [monthlyFilters, setMonthlyFilters] = useState({
    year: "",
    quarter: "",
  });

  const [quarterlyFilters, setQuarterlyFilters] = useState({
    year: "",
  });

  const [overallFilters, setOverallFilters] = useState({
    startYear: "",
    endYear: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    sales: 0,
    invoices: 0,
    customers: 0,
    revenueStats: {
      labels: [],
      datasets: [],
    },
    customerStats: {
      labels: [],
      datasets: [],
    },
  });

  // Sample data for different period types and filters
  const sampleData = {
    daily: {
      "2024-03": {
        sales: 50000,
        invoices: 250,
        customers: 120,
        revenueStats: {
          labels: Array.from({ length: 31 }, (_, i) => `${i + 1}`),
          datasets: [
            {
              label: "Daily Revenue",
              data: Array.from(
                { length: 31 },
                () => Math.floor(Math.random() * 10000) + 5000
              ),
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        customerStats: {
          labels: Array.from({ length: 31 }, (_, i) => `${i + 1}`),
          datasets: [
            {
              label: "Table Service",
              data: Array.from(
                { length: 31 },
                () => Math.floor(Math.random() * 100) + 50
              ),
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
              label: "Online Orders",
              data: Array.from(
                { length: 31 },
                () => Math.floor(Math.random() * 80) + 30
              ),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        },
      },
      // Add more daily data as needed
    },
    monthly: {
      "2024-Q2": {
        sales: 750000,
        invoices: 375,
        customers: 255,
        revenueStats: {
          labels: ["April", "May", "June"],
          datasets: [
            {
              label: "Monthly Revenue",
              data: [120000, 150000, 130000],
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        customerStats: {
          labels: ["April", "May", "June"],
          datasets: [
            {
              label: "Table Service",
              data: [900, 1200, 1100],
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
              label: "Online Orders",
              data: [600, 800, 750],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        },
      },
      // Add more monthly data as needed
    },
    quarterly: {
      2024: {
        sales: 3000000,
        invoices: 1500,
        customers: 1020,
        revenueStats: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              label: "Quarterly Revenue",
              data: [900000, 1200000, 1100000, 1400000],
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        customerStats: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              label: "Table Service",
              data: [900, 1200, 1100, 1400],
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
              label: "Online Orders",
              data: [600, 800, 750, 900],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        },
      },
      // Add more quarterly data as needed
    },
    overall: {
      "2020-2024": {
        sales: 15000000,
        invoices: 7500,
        customers: 5100,
        revenueStats: {
          labels: ["2020", "2021", "2022", "2023", "2024"],
          datasets: [
            {
              label: "Overall Revenue",
              data: [300000, 350000, 400000, 450000, 500000],
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        customerStats: {
          labels: ["2020", "2021", "2022", "2023", "2024"],
          datasets: [
            {
              label: "Table Service",
              data: [3000, 3500, 4000, 4500, 5000],
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
              label: "Online Orders",
              data: [2000, 2500, 3000, 3500, 4000],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        },
      },
      // Add more overall data as needed
    },
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, branch, periodType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let selectedData = {};

      switch (periodType) {
        case "daily":
          const { month, year } = dailyFilters;
          if (month && year) {
            const key = `${year}-${month.padStart(2, "0")}`;
            selectedData = sampleData.daily[key] || sampleData.daily["2024-03"]; // Fallback to a valid daily key
          }
          break;
        case "monthly":
          const { year: mYear, quarter } = monthlyFilters;
          if (mYear && quarter) {
            const key = `${mYear}-Q${quarter}`;
            selectedData =
              sampleData.monthly[key] || sampleData.monthly["2024-Q2"];
          }
          break;
        case "quarterly":
          const { year: qYear } = quarterlyFilters;
          if (qYear) {
            selectedData =
              sampleData.quarterly[qYear] || sampleData.quarterly["2024"];
          }
          break;
        case "overall":
          const { startYear, endYear } = overallFilters;
          if (startYear && endYear) {
            if (parseInt(startYear) > parseInt(endYear)) {
              setError("Start year cannot be greater than end year.");
              setLoading(false);
              return;
            }
            const key = `${startYear}-${endYear}`;
            selectedData =
              sampleData.overall[key] || sampleData.overall["2020-2024"];
          }
          break;
        default:
          selectedData = sampleData.monthly["2024-Q2"];
      }

      // Ensure selectedData has all required properties
      selectedData = {
        sales: selectedData.sales ?? 0,
        invoices: selectedData.invoices ?? 0,
        customers: selectedData.customers ?? 0,
        revenueStats: selectedData.revenueStats ?? { labels: [], datasets: [] },
        customerStats: selectedData.customerStats ?? {
          labels: [],
          datasets: [],
        },
      };

      setData(selectedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = React.memo(({ icon: Icon, title, value, color }) => (
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
  ));

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
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

  // Handle Apply Button Click
  const handleApply = () => {
    if (tempPeriodType === "overall") {
      const { startYear, endYear } = overallFilters;
      if (parseInt(startYear) > parseInt(endYear)) {
        setError("Start year cannot be greater than end year.");
        return;
      }
    }
    setError(null);
    setRegion(tempRegion);
    setBranch(tempBranch);
    setPeriodType(tempPeriodType);
  };

  // Handle Export Functionality (Placeholder)
  const handleExport = () => {
    // Implement export logic here, such as generating a PDF or CSV file
    alert("Export functionality is under development.");
  };

  return (
    <div className="revenue-dashboard">
      <div className="dashboard-container">
        <div className="header-dashboard">
          <h1 className="title">Revenue Dashboard</h1>
          <div className="filters">
            {/* First: Select Region and Branch */}
            <select
              value={tempRegion}
              onChange={(e) => setTempRegion(e.target.value)}
              className="filter-select"
              aria-label="Select Region"
            >
              <option value="all">All Regions</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>

            <select
              value={tempBranch}
              onChange={(e) => setTempBranch(e.target.value)}
              className="filter-select"
              aria-label="Select Branch"
            >
              <option value="main">Main Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
              <option value="branch3">Branch 3</option>
            </select>

            {/* Second: Select Period Type */}
            <select
              value={tempPeriodType}
              onChange={(e) => setTempPeriodType(e.target.value)}
              className="filter-select"
              aria-label="Select Period Type"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="overall">Overall</option>
            </select>

            {/* Third: Dynamic Filters Based on Period Type */}
            {tempPeriodType === "daily" && (
              <div className="dynamic-filters">
                <label htmlFor="daily-picker" className="filter-label">
                  Select Month-Year:
                </label>
                <input
                  type="month"
                  id="daily-picker"
                  value={`${dailyFilters.year}-${dailyFilters.month}`}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split("-");
                    setDailyFilters({ year, month });
                  }}
                  className="filter-input"
                  aria-label="Select Month and Year"
                />
              </div>
            )}

            {tempPeriodType === "monthly" && (
              <div className="dynamic-filters">
                <label className="filter-label">Select Year and Quarter:</label>
                <select
                  value={monthlyFilters.year}
                  onChange={(e) =>
                    setMonthlyFilters({
                      ...monthlyFilters,
                      year: e.target.value,
                    })
                  }
                  className="filter-select"
                  aria-label="Select Year"
                >
                  <option value="">Select Year</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select
                  value={monthlyFilters.quarter}
                  onChange={(e) =>
                    setMonthlyFilters({
                      ...monthlyFilters,
                      quarter: e.target.value,
                    })
                  }
                  className="filter-select"
                  aria-label="Select Quarter"
                >
                  <option value="">Select Quarter</option>
                  <option value="1">Q1</option>
                  <option value="2">Q2</option>
                  <option value="3">Q3</option>
                  <option value="4">Q4</option>
                </select>
              </div>
            )}

            {tempPeriodType === "quarterly" && (
              <div className="dynamic-filters">
                <label htmlFor="quarterly-picker" className="filter-label">
                  Select Year:
                </label>
                <select
                  id="quarterly-picker"
                  value={quarterlyFilters.year}
                  onChange={(e) =>
                    setQuarterlyFilters({ year: e.target.value })
                  }
                  className="filter-select"
                  aria-label="Select Year"
                >
                  <option value="">Select Year</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            )}

            {tempPeriodType === "overall" && (
              <div className="dynamic-filters">
                <label className="filter-label">Select Year Range:</label>
                <select
                  value={overallFilters.startYear}
                  onChange={(e) =>
                    setOverallFilters({
                      ...overallFilters,
                      startYear: e.target.value,
                    })
                  }
                  className="filter-select"
                  aria-label="Select Start Year"
                >
                  <option value="">From Year</option>
                  <option value="2018">2018</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select
                  value={overallFilters.endYear}
                  onChange={(e) =>
                    setOverallFilters({
                      ...overallFilters,
                      endYear: e.target.value,
                    })
                  }
                  className="filter-select"
                  aria-label="Select End Year"
                >
                  <option value="">To Year</option>
                  <option value="2018">2018</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="actions">
              <button
                onClick={handleApply}
                className="apply-button"
                aria-label="Apply Filters"
              >
                Apply
              </button>
              {/* <button
                onClick={fetchData}
                className="refresh-button"
                aria-label="Refresh Dashboard"
              >
                <FiRefreshCcw className="icon" />
                Refresh
              </button> */}
              <button
                onClick={handleExport}
                className="export-button"
                aria-label="Download Report"
              >
                <FiDownload className="icon" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
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
            value={data.invoices.toLocaleString()}
            color="bg-green-500"
          />
          <StatCard
            icon={FaUsers}
            title="Customers"
            value={data.customers.toLocaleString()}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Section */}
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
