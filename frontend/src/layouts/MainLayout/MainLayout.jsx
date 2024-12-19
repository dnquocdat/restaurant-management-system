import React, { useEffect, useState, useContext } from "react";
import { RxAvatar } from "react-icons/rx";
import {
  FaShoppingCart,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "./MainLayout.css";
import { Link } from "react-router-dom";
import { CartContext } from "../../component/CardContext/CardContext";

export const MainLayout = ({ children, title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  const { clearCart } = useContext(CartContext); // Sử dụng Context
  const [isAuthen, setIsAuthen] = useState(false);
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsAuthen(!!token); // Cập nhật trạng thái isAuthen dựa trên token
    };

    // Kiểm tra trạng thái khi component mount
    checkAuthStatus();

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", checkAuthStatus);

    // Cleanup khi component bị unmount
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token
    clearCart();
    setIsAuthen(false); // Cập nhật trạng thái
  };
  return (
    <div className="container">
      <header>
        <div className="logo-main">
          <img
            src="data:image/jpeg;base64,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ufjhhmYJ2eM1pqRXat9J26XTqas2d9vrqrrdcbcciD/N5QhzV0rNU13LYtiVkc926xbHXA9MVt/ie6zSNo+73YPeVLauM+6+cA/HkZu8N2ami6g2pS5uptRrCwrYVrcjoWAO0/aqRnkcGfHHtQlrVKjCwU6aqo2DIV3QEuybsHbuYgEgZxnzhL5v4RZR3pJTZXWlnegnu7Ftx3XdnGWLZOBge4+cbTNerSNbXbaMba2rDdd2bd+3H9hz+E7PENbVdpl0gsz9GUWVXePbdaxY31Y8gO8+zOB7j/8Akmnwl0tp1VDWLU1hpat7NwrJqZ9yMyg7SVckEjHhxyzIQ0dTpG0y0s2MW171xnO0O9fi+OUb/E3f4GxVMW1GxtP360ZtFpq2Gw4JTYWCKzbd2cAzzjdqH6PWji3udOEaxd2xnNllrbNwBKjvAM4GcGdRuM1uiVA1of4dXUNSK171LVQ76GfG7Y43VnHTcPLMkR/TaVtStrKR9nXvZee4oCAzL5HbkE8+mT5GearTNpdgbG5q1faOqq/NA/oSu1sejj5TY4FqRpNTp3YhUFqd4SMjumIW0MPMFCwI9CZg1951Vtrk7izsd3rknH+McoGCIiEkREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQP/9k="
            alt="logo nha hang"
          />
        </div>
        <div className="nav-bar">
          <Link to={"/"}>Home</Link>
          <Link to={"/menu"}>Menu</Link>
          <Link to={"/booktable"}>Book Table</Link>
          <Link to={"/contact"}>Contact Us</Link>
        </div>
        <div className="handle-user">
          <div className="avatar-container">
            <div className="avatar-user">
              <RxAvatar />
            </div>
            {isAuthen ? (
              <ul className="option-user">
                <li>
                  <Link to={"/profile"}>Profile</Link>
                </li>
                <li>
                  <Link to={"/activity-history"}>Activity History</Link>
                </li>
                <li>
                  <Link to={"/login"} onClick={handleLogout}>
                    Log Out
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="option-user">
                <li>
                  <Link to={"/login"}>Log In</Link>
                </li>
                <li>
                  <Link to={"/login?tab=register"}>Register</Link>
                </li>
              </ul>
            )}
          </div>
          <div className="cart-icon">
            <Link to={"/cart"}>
              <FaShoppingCart />
            </Link>
          </div>
        </div>
      </header>
      <div className="content-main">{children}</div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>
              Welcome to our restaurant! We provide the best dining experience
              with delicious food and excellent service.
            </p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Phone: +123 456 7890</p>
            <p>Email: contact@restaurant.com</p>
            <p>Address: 123 Main Street, City, Country</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <FaFacebook />
              <FaInstagram />
              <FaTwitter />
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Restaurant Name. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};
