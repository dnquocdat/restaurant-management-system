import React, { useState, useEffect } from "react";
import {
  FaUtensils,
  FaPizzaSlice,
  FaLeaf,
  FaGlobeAsia,
  FaSearch,
} from "react-icons/fa";
import "./HomePage.css";
import { CardFood } from "../../../component/CardFood/CardFood";

const HomePage = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      alt: "Delicious spread of various dishes",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5",
      alt: "Fine dining experience",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
      alt: "Gourmet restaurant interior",
    },
  ];

  const categories = [
    { id: 1, name: "Italian Cuisine", icon: <FaPizzaSlice /> },
    { id: 2, name: "Asian Delights", icon: <FaGlobeAsia /> },
    { id: 3, name: "Vegetarian Options", icon: <FaLeaf /> },
    { id: 4, name: "Fine Dining", icon: <FaUtensils /> },
  ];

  const bestSellers = [
    {
      id: 1,
      name: "Margherita Pizza",
      restaurant: "Luigi's Italian",
      price: "18.99",
      description: "Fresh basil, mozzarella, and tomato sauce",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    },
    {
      id: 2,
      name: "Sushi Platter",
      restaurant: "Sakura Japanese",
      price: "24.99",
      description: "Assorted fresh sushi and sashimi",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    },
    {
      id: 3,
      name: "Buddha Bowl",
      restaurant: "Green Garden",
      price: "16.99",
      description: "Quinoa, avocado, and fresh vegetables",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    },
    {
      id: 4,
      name: "Beef Wellington",
      restaurant: "The Grand Plaza",
      price: "45.99",
      description: "Premium beef wrapped in puff pastry",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);
  // console.log(banners.length);
  const filteredBestSellers = bestSellers.filter(
    (dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="homepage min-h-screen bg-gray-50">
      {/* Banner Section */}
      {/* <button className="open-modal-button" onClick={() => setIsOpen(true)}>
        Chọn Nhánh
      </button> */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chọn một Nhánh</h2>
            {/* <ul className="branch-list">
              {branches.map((branch, index) => (
                <li key={index}>
                  {branch}
                </li>
              ))}
            </ul> */}
            <button
              className="close-modal-button"
              onClick={() => setIsOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <div className="banner relative h-60vh overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`banner-slide absolute w-full h-full transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="banner-image w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
        <div className="banner-overlay absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center space-y-6">
          <h1 className="banner-title">Discover Culinary Excellence</h1>
          {/* Search Bar */}
          <div className="search-bar relative w-full max-w-xl mx-auto px-4">
            <input
              type="text"
              placeholder="Search for dishes, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories max-w-7xl mx-auto px-4 py-12">
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-content">
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-name">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="best-sellers max-w-7xl mx-auto px-4 py-12">
        <h2 className="section-title">Best Sellers</h2>
        <div className="best-sellers-grid">
          {filteredBestSellers.map((dish) => (
            <CardFood key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
