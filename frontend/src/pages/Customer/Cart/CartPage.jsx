// src/pages/Customer/Cart/CartPage.js
import React, { useState, useEffect, useContext } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { BsArrowRight, BsCreditCard } from "react-icons/bs";
import { FaShippingFast, FaMoneyBill } from "react-icons/fa";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../component/CardContext/CardContext";

export const CartPage = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { cart, removeFromCart, updateQuantity, calculateSubtotal } =
    useContext(CartContext); // Sử dụng Context

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // States for provinces, districts, and wards
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch provinces on mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.province) {
      fetch(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`)
        .then((response) => response.json())
        .then((data) => setDistricts(data.districts || []))
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
      setFormData((prev) => ({ ...prev, district: "", ward: "" }));
    }
  }, [formData.province]);

  // Fetch wards when district changes
  useEffect(() => {
    if (formData.district) {
      fetch(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`)
        .then((response) => response.json())
        .then((data) => setWards(data.wards || []))
        .catch((error) => console.error("Error fetching wards:", error));
    } else {
      setWards([]);
      setFormData((prev) => ({ ...prev, ward: "" }));
    }
  }, [formData.district]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // set value input for name
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "cardNumber":
        newErrors.cardNumber = /^\d{16}$/.test(value)
          ? ""
          : "Invalid card number";
        break;
      case "expiryDate":
        newErrors.expiryDate = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)
          ? ""
          : "Invalid expiry date (MM/YY)";
        break;
      case "cvv":
        newErrors.cvv = /^\d{3,4}$/.test(value) ? "" : "Invalid CVV";
        break;
      case "phone":
        newErrors.phone = /^[0-9]{10,15}$/.test(value)
          ? ""
          : "Invalid phone number";
        break;
      case "province":
        newErrors.province = value ? "" : "Province is required";
        break;
      case "district":
        newErrors.district = value ? "" : "District is required";
        break;
      case "ward":
        newErrors.ward = value ? "" : "Ward is required";
        break;
      default:
        if (!value.trim()) {
          newErrors[name] = "This field is required";
        } else {
          delete newErrors[name];
        }
    }

    setErrors(newErrors);
  };

  const CartItem = ({ item }) => (
    <div className="cart-item" key={item.id}>
      <img
        src={item.image}
        alt={item.name}
        className="cart-item-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27";
        }}
      />
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">${item.price}</p>
        <div className="cart-item-actions">
          <button
            onClick={() =>
              updateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="quantity-button"
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span className="quantity">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="quantity-button"
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
          <button
            onClick={() => removeFromCart(item.id)}
            className="remove-button"
            aria-label="Remove item"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
      <div className="cart-item-total">
        <p>${(Number(item.price) * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );

  const ShoppingCart = () => {
    const navigate = useNavigate();

    return (
      <div className="shopping-cart">
        <h2 className="section-title">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <CartItem item={item} key={item.id} />
              ))}
            </div>
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(calculateSubtotal() + 10).toFixed(2)}</span>
              </div>
              <button
                onClick={() => setStep(2)}
                className="proceed-button"
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const CheckoutForm = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      // Check for errors before submitting
      const requiredFields = [
        "name",
        "phone",
        "province",
        "district",
        "ward",
        "address",
      ];
      let hasError = false;
      requiredFields.forEach((field) => {
        if (!formData[field].trim()) {
          validateField(field, formData[field]);
          hasError = true;
        }
      });

      if (paymentMethod === "card") {
        ["cardNumber", "expiryDate", "cvv"].forEach((field) => {
          if (!formData[field].trim()) {
            validateField(field, formData[field]);
            hasError = true;
          }
        });
      }

      if (hasError || Object.values(errors).some((error) => error)) {
        alert("Please fix the errors in the form before submitting.");
        return;
      }

      // Xử lý gửi đơn hàng, ví dụ: gửi đến API
      console.log("Order placed successfully!", formData);
      alert("Order placed successfully!");
      // Xoá giỏ hàng sau khi đặt hàng thành công (tùy chọn)
      // setCart([]); // Nếu bạn muốn xoá giỏ hàng, cần thêm hàm trong CartContext
      // Chuyển hướng người dùng đến trang xác nhận hoặc trang chủ
      // navigate("/");
    };

    return (
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2 className="section-title">Check Out</h2>
        <div className="payment-method-section">
          <h3 className="section-subtitle">Payment Method</h3>
          <div className="payment-method-options">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`payment-button ${
                paymentMethod === "card" ? "active" : ""
              }`}
            >
              <BsCreditCard className="icon" /> Card Payment
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`payment-button ${
                paymentMethod === "cash" ? "active" : ""
              }`}
            >
              <FaMoneyBill className="icon" /> Cash on Delivery
            </button>
          </div>
        </div>
        <div className="form-sections">
          {paymentMethod === "card" && (
            <div className="payment-info">
              <h3 className="section-subtitle">
                <BsCreditCard className="icon" /> Payment Information
              </h3>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234567812345678"
                  maxLength={16}
                />
                {errors.cardNumber && (
                  <p className="error-message">{errors.cardNumber}</p>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="error-message">{errors.expiryDate}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}
          <div className="shipping-info">
            <h3 className="section-subtitle">
              <FaShippingFast className="icon" /> Shipping Information
            </h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="1234567890"
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="province">Province/City</label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
              >
                <option value="">-- Select Province/City --</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="error-message">{errors.province}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="district">District</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                disabled={!formData.province}
              >
                <option value="">-- Select District --</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="error-message">{errors.district}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="ward">Ward</label>
              <select
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                disabled={!formData.district}
              >
                <option value="">-- Select Ward --</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </select>
              {errors.ward && <p className="error-message">{errors.ward}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St, Apartment 4B"
              ></input>
              {errors.address && (
                <p className="error-message">{errors.address}</p>
              )}
            </div>
          </div>
        </div>
        <div className="checkout-actions">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="back-button"
          >
            <BsArrowRight className="icon rotate-180" /> Back to Cart
          </button>
          <button type="submit" className="place-order-button">
            Check Out
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container">
      <div className="progress-bar">
        <div className={`progress-step ${step === 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Cart</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step === 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Checkout</span>
        </div>
      </div>
      {step === 1 ? <ShoppingCart /> : <CheckoutForm />}
    </div>
  );
};
