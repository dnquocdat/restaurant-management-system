import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CardFood.css";
import { CartContext } from "../CardContext/CardContext";

export const CardFood = ({ dish }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddCart = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click từ lan ra ngoài
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    if (!token) {
      toast.warning("Please log in to add items to the cart.", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
      return;
    }

    // Nếu có token, thêm sản phẩm vào giỏ hàng
    addToCart(dish);
    toast.success(`${dish.name} added to cart!`, {
      position: "top-right",
      autoClose: 1500,
    });
  };

  return (
    <div className="dish-card" onClick={() => navigate(`/detail/${dish.id}`)}>
      <div className="dish-image-container">
        <img
          src={dish.image}
          alt={dish.name}
          className="dish-image"
          loading="lazy"
        />
      </div>
      <div className="dish-details">
        <div>
          <h3 className="dish-name">{dish.name}</h3>
          <p className="dish-restaurant">{dish.restaurant}</p>
          <p className="dish-description">{dish.description}</p>
        </div>
        <div className="dish-footer">
          <span className="dish-price">${dish.price}</span>
          <button className="order-button" onClick={handleAddCart}>
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};
