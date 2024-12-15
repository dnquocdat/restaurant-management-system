import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsFilterLeft, BsSortDownAlt } from "react-icons/bs";
// import axios from "axios"; // Uncomment when using axios for API calls
import "./MenuPage.css";
import { CardFood } from "../../../component/CardFood/CardFood";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const itemsPerPage = 6;

  // Frontend Data (Keep your existing data)
  const dummyDishes = [
    {
      id: 1,
      name: "Grilled Salmon",
      category: "main",
      price: "24.99",
      description: "Fresh Atlantic salmon with herbs and lemon butter sauce",
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "Caesar Salad",
      category: "appetizer",
      price: "12.99",
      description: "Crispy romaine lettuce with classic Caesar dressing",
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      name: "Chocolate Lava Cake",
      category: "dessert",
      price: "8.99",
      description: "Warm chocolate cake with molten center",
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3",
    },
    {
      id: 4,
      name: "Margherita Pizza",
      category: "main",
      price: "18.99",
      description: "Classic pizza with tomatoes, mozzarella, and basil",
      image:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3",
    },
    {
      id: 5,
      name: "Bruschetta",
      category: "appetizer",
      price: "9.99",
      description: "Toasted bread with tomatoes and fresh basil",
      image:
        "https://images.unsplash.com/photo-1572695795506-a283411c1cc9?ixlib=rb-4.0.3",
    },
    {
      id: 6,
      name: "Tiramisu",
      category: "dessert",
      price: "7.99",
      description: "Classic Italian dessert with coffee and mascarpone",
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3",
    },
    {
      id: 7,
      name: "Beef Steak",
      category: "main",
      price: "32.99",
      description: "Premium cut beef steak with seasonal vegetables",
      image:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3",
    },
    {
      id: 8,
      name: "Calamari",
      category: "appetizer",
      price: "14.99",
      description: "Crispy fried squid with marinara sauce",
      image:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3",
    },
  ];

  // Frontend Filtering Logic
  const filteredDishes = dummyDishes
    .filter((dish) => {
      const categoryMatch =
        selectedCategory === "all" || dish.category === selectedCategory;
      const priceMatch =
        priceRange === "all" ||
        (priceRange === "0-15" && parseFloat(dish.price) <= 15) ||
        (priceRange === "15-25" &&
          parseFloat(dish.price) > 15 &&
          parseFloat(dish.price) <= 25) ||
        (priceRange === "25+" && parseFloat(dish.price) > 25);
      const searchMatch =
        searchQuery === "" ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && searchMatch;
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price);
    });

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const currentDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Optional: For search suggestions (if you want to keep it)
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = dummyDishes.filter((dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Uncomment the following section when you want to enable backend integration

  /*
  // Backend Data
  const [dishes, setDishes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dishes from backend
  const fetchDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/dishes/filter", {
        searchQuery,
        selectedCategory,
        priceRange,
        sortOrder,
        currentPage,
        itemsPerPage,
      });

      setDishes(response.data.dishes);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch dishes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dishes on initial load and whenever filters change
  useEffect(() => {
    fetchDishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, selectedCategory, priceRange, sortOrder]);

  // Handle Filter Button Click
  const handleFilter = () => {
    setCurrentPage(1); // Reset to first page on new filter
    fetchDishes();
  };
  */

  // Handle Filter Button Click for Frontend (No Backend)
  const handleFilterFrontend = () => {
    setCurrentPage(1); // Reset to first page on new filter
    // No action needed since filtering is handled on frontend
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="search-input"
            aria-label="Search dishes"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((dish) => (
                <div
                  key={dish.id}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchQuery(dish.name);
                    setShowSuggestions(false);
                  }}
                >
                  {dish.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Desktop Filter Button */}
        <button
          onClick={/* handleFilter */ handleFilterFrontend}
          className="filter-button"
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
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="appetizer">Appetizers</option>
            <option value="main">Main Courses</option>
            <option value="dessert">Desserts</option>
          </select>
        </div>

        <div className="filter-item">
          <BsFilterLeft className="filter-icon" />
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="filter-select"
            aria-label="Filter by price range"
          >
            <option value="all">All Prices</option>
            <option value="0-15">$0 - $15</option>
            <option value="15-25">$15 - $25</option>
            <option value="25+">$25+</option>
          </select>
        </div>

        <div className="filter-item">
          <BsSortDownAlt className="filter-icon" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
            aria-label="Sort by price"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {/* Mobile Filter Button */}
      <button
        onClick={/* handleFilter */ handleFilterFrontend}
        className="filter-button mobile-filter"
        aria-label="Apply filters"
      >
        <BsFilterLeft style={{ marginRight: "0.5rem" }} /> Apply Filters
      </button>
      {/* Dishes Grid */}
      <div className="dishes-grid">
        {filteredDishes
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((dish) => (
            <CardFood dish={dish} key={dish.id} />
          ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
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
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-button"
            aria-label="Next page"
          >
            <FiChevronRight className="pagination-icon" />
          </button>
        </div>
      )}
      {/*       
      // Uncomment the following section when integrating with backend

      {loading && <div className="loading">Loading dishes...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && dishes.length > 0 && (
        <div className="dishes-grid">
          {dishes.map((dish) => (
            <CardFood dish={dish} key={dish.id} />
          ))}
        </div>
      )}

      {!loading && !error && dishes.length === 0 && (
        <div className="no-results">No dishes found.</div>
      )}

      {!loading && !error && totalPages > 1 && (
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
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-button"
            aria-label="Next page"
          >
            <FiChevronRight className="pagination-icon" />
          </button>
        </div>
      )}
      */}
    </div>
  );
};

export default MenuPage;
