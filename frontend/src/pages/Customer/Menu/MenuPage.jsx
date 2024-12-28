import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsFilterLeft, BsSortDownAlt } from "react-icons/bs";
import "./MenuPage.css";
import { CardFood } from "../../../component/CardFood/CardFood";
import { http } from "../../../helpers/http";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const [dishes, setDishes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await http("/dish", "GET");
      const data = response.data;
      if (data) {
        const formattedCategories = [
          { value: "all", label: "All Categories" }, // Always include the default "All Categories"
          ...data.map((cat) => ({
            value: cat.category_name.toLowerCase(),
            label: cat.category_name,
          })),
        ];
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories.");
    }
  };

  const fetchDishes = async (
    page = 1,
    limit = itemsPerPage,
    sort = "price,asc",
    query = "",
    category = "all"
  ) => {
    setLoading(true);
    setError("");
    try {
      const branchId = localStorage.getItem("selectedBranchId");
      if (!branchId) throw new Error("Branch ID not found in localStorage");

      const params = new URLSearchParams({
        limit,
        sort,
        page,
        query,
      });

      if (category !== "all") {
        params.append("category", category);
      }

      const fetchMenu = await http(
        `/menu/${branchId}?${params.toString()}`,
        "GET"
      );

      const data = fetchMenu.data;
      if (data) {
        setDishes(data.listDish);
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

  // Fetch dishes whenever dependencies change
  useEffect(() => {
    fetchDishes(
      currentPage,
      itemsPerPage,
      `${sortOrder === "asc" ? "price,asc" : "price,desc"}`,
      searchQuery,
      selectedCategory
    );
  }, [currentPage, sortOrder, searchQuery, selectedCategory]);

  const handleFilterFrontend = () => {
    // filter
  };

  return (
    <div className="menu-container">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" style={{ marginLeft: "0px" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            placeholder="Search dishes..."
            className="search-input"
            aria-label="Search dishes"
          />
        </div>
        {/* Desktop Filter Button */}
        <button
          onClick={handleFilterFrontend}
          className="filter-button"
          style={{ margin: 0 }}
          aria-label="Apply filters"
        >
          <BsFilterLeft style={{ marginRight: "0.5rem" }} /> Filter
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-item">
          <BsFilterLeft className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset to first page on category change
            }}
            className="filter-select"
            aria-label="Filter by category"
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
        </div>

        <div className="filter-item">
          <BsSortDownAlt className="filter-icon" />
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1); // Reset to first page on sort change
            }}
            className="filter-select"
            aria-label="Sort by price"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="dishes-grid">
        {loading ? (
          <div className="loading">Loading dishes...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : dishes.length > 0 ? (
          dishes.map((dish) => (
            <CardFood
              dish={{
                id: dish.dish_id,
                name: dish.dish_name,
                category: dish.category_name,
                price: dish.price,
                description: dish.description,
                image: dish.image_link,
              }}
              key={dish.dish_id}
            />
          ))
        ) : (
          <div className="no-results">No dishes found.</div>
        )}
      </div>

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
            setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))
          }
          disabled={currentPage === pagination.totalPages}
          className="pagination-button"
          aria-label="Next page"
        >
          <FiChevronRight className="pagination-icon" />
        </button>
      </div>
    </div>
  );
};

export default MenuPage;
