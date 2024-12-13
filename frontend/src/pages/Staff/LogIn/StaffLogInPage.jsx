import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import "./StaffLogInPage.css";

export const StaffLogInPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.password && formData.username && formData.password) {
      setIsLoading(true);
      // Simulating API call
      setTimeout(() => {
        setIsLoading(false);
        // You can handle successful login here
      }, 2000);
    }
  };

  return (
    <div className="staff-login-container">
      <div className="staff-login-box">
        <h2 className="staff-login-title">Staff Login</h2>
        <form onSubmit={handleSubmit} className="staff-login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your username"
              aria-label="Username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Enter your password"
                aria-label="Password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="error-message" role="alert" aria-live="polite">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? "button-disabled" : ""}`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
