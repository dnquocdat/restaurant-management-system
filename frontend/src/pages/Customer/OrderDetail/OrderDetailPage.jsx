import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm import này
import { FaStar, FaTimes } from "react-icons/fa";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import "./OrderDetailPage.css";

export const OrderDetailPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const navigate = useNavigate(); // Khởi tạo navigate

  const mockInvoiceData = [
    {
      id: 1,
      name: "Grilled Salmon Fillet",
      price: 24.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3",
      description: "Fresh Atlantic salmon grilled to perfection with herbs",
    },
    {
      id: 2,
      name: "Truffle Mushroom Risotto",
      price: 18.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3",
      description: "Creamy Italian risotto with wild mushrooms and truffle oil",
    },
    {
      id: 3,
      name: "Wagyu Beef Steak",
      price: 45.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3",
      description: "Premium grade Wagyu beef cooked to your preference",
    },
  ];

  const calculateTotal = () => {
    return mockInvoiceData.reduce(
      (total, dish) => total + dish.price * dish.quantity,
      0
    );
  };

  const handleReviewClick = (dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleBack = () => {
    navigate("/activity-history");
  };

  const ReviewModal = ({ dish, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Review submitted:", { dish, rating, review });
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Review {dish.name}</h3>
            <button
              onClick={onClose}
              className="close-button"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    className={`star ${
                      ratingValue <= (hover || rating) ? "active" : ""
                    }`}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(rating)}
                    aria-label={`Rate ${ratingValue} stars`}
                  >
                    <FaStar />
                  </button>
                );
              })}
            </div>

            <textarea
              className="review-text"
              rows="4"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            ></textarea>

            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="invoice-container">
      <div className="invoice-card">
        <div className="invoice-header">
          <h1>Order Invoice</h1>
          <button onClick={handleBack} className="back-button">
            &#8592; Back to Orders
          </button>
        </div>

        <div className="invoice-content">
          <div className="invoice-items">
            {mockInvoiceData.map((dish) => (
              <div key={dish.id} className="dish-item">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="dish-image"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                  }}
                />

                <div className="dish-info">
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <div className="dish-details">
                    <div className="dish-pricing">
                      <p>Price: ${dish.price.toFixed(2)}</p>
                      <p>Quantity: {dish.quantity}</p>
                      <p>
                        Subtotal: ${(dish.price * dish.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleReviewClick(dish)}
                      className="review-button"
                    >
                      <BsFillChatSquareTextFill />
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="invoice-total">
            <h2>Total Amount</h2>
            <p>${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>

      {isModalOpen && selectedDish && (
        <ReviewModal
          dish={selectedDish}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
