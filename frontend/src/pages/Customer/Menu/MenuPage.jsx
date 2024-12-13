import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsFilterLeft, BsSortDownAlt } from "react-icons/bs";
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
      https:
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

  const filteredDishes = dummyDishes
    .filter((dish) => {
      const categoryMatch =
        selectedCategory === "all" || dish.category === selectedCategory;
      const priceMatch =
        priceRange === "all" ||
        (priceRange === "0-15" && dish.price <= 15) ||
        (priceRange === "15-25" && dish.price > 15 && dish.price <= 25) ||
        (priceRange === "25+" && dish.price > 25);
      const searchMatch =
        searchQuery === "" ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && searchMatch;
    })
    .sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const currentDishes = filteredDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="menu-container">
      <div className="search-section">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="search-input"
            aria-label="Search dishes"
          />
          {/* <FiSearch className="search-icon" /> */}
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
      </div>

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

      <div className="dishes-grid">
        {currentDishes.map((dish) => (
          <CardFood dish={dish} key={dish.id} />
        ))}
      </div>

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
    </div>
  );
};

export default MenuPage;
