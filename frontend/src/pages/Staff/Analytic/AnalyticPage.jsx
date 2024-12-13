import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BsCalendarDate, BsFilter } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import "./AnalyticPage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticPage = () => {
  const [activeTab, setActiveTab] = useState("daily");

  const mockData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      invoices: [45, 59, 80, 81, 56, 55, 40],
      revenue: [2500, 3200, 4100, 3800, 2900, 2600, 2000],
    },
    quarterly: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      invoices: [180, 220, 190, 240],
      revenue: [12000, 15000, 13500, 16000],
    },
    yearly: {
      labels: ["2019", "2020", "2021", "2022", "2023"],
      invoices: [800, 950, 1100, 1250, 1400],
      revenue: [48000, 52000, 58000, 62000, 68000],
    },
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } Statistics`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: mockData[activeTab].labels,
    datasets: [
      {
        label: "Invoices",
        data: mockData[activeTab].invoices,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Revenue ($)",
        data: mockData[activeTab].revenue,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  // Subcomponents

  const TabButton = ({ tab, label, Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`tab-button ${activeTab === tab ? "active" : ""}`}
      aria-label={`View ${label} statistics`}
    >
      <Icon className="tab-icon" />
      <span>{label}</span>
    </button>
  );

  const StatCard = ({ title, value, Icon }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <Icon className="stat-icon" />
      </div>
    </div>
  );

  const TableComponent = () => (
    <div className="table-container">
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Invoices</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {mockData[activeTab].labels.map((label, index) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{mockData[activeTab].invoices[index]}</td>
              <td>${mockData[activeTab].revenue[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Statistics Dashboard</h1>
          <div className="dashboard-tabs">
            <TabButton tab="daily" label="Daily" Icon={BsCalendarDate} />
            <TabButton tab="quarterly" label="Quarterly" Icon={BsFilter} />
            <TabButton tab="yearly" label="Yearly" Icon={FiBarChart2} />
          </div>
        </div>

        <div className="dashboard-stat-cards">
          <StatCard
            title="Total Invoices"
            value={mockData[activeTab].invoices.reduce((a, b) => a + b, 0)}
            Icon={BsCalendarDate}
          />
          <StatCard
            title="Total Revenue"
            value={`$${mockData[activeTab].revenue.reduce((a, b) => a + b, 0)}`}
            Icon={FiBarChart2}
          />
          <StatCard
            title="Average Revenue"
            value={`$${Math.round(
              mockData[activeTab].revenue.reduce((a, b) => a + b, 0) /
                mockData[activeTab].revenue.length
            )}`}
            Icon={BsFilter}
          />
        </div>

        <div className="dashboard-chart">
          <Line options={chartOptions} data={chartData} />
        </div>

        <TableComponent />
      </div>
    </div>
  );
};
