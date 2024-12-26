import React, { useEffect, useState } from "react";
import { BsArrowRight, BsCreditCard } from "react-icons/bs";
import { FaShippingFast, FaMoneyBill } from "react-icons/fa";
import { http } from "../../../helpers/http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const CheckoutForm = ({ setStep, cart, clearCart }) => {
  const navigate = useNavigate();
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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [errors, setErrors] = useState({});
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
      const codeProvince = provinces.find(
        (item) => item.name === formData.province
      );
      console.log("code province", codeProvince);

      fetch(`https://provinces.open-api.vn/api/p/${codeProvince.code}?depth=2`)
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
      const codeDistrict = districts.find(
        (item) => item.name === formData.district
      );
      fetch(`https://provinces.open-api.vn/api/d/${codeDistrict.code}?depth=2`)
        .then((response) => response.json())
        .then((data) => setWards(data.wards || []))
        .catch((error) => console.error("Error fetching wards:", error));
    } else {
      setWards([]);
      setFormData((prev) => ({ ...prev, ward: "" }));
    }
  }, [formData.district]);

  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Sử dụng hàm cập nhật trạng thái dạng hàm
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      // case "cardNumber":
      //   newErrors.cardNumber = /^\d{16}$/.test(value)
      //     ? ""
      //     : "Invalid card number";
      //   break;
      // case "expiryDate":
      //   newErrors.expiryDate = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)
      //     ? ""
      //     : "Invalid expiry date (MM/YY)";
      //   break;
      // case "cvv":
      //   newErrors.cvv = /^\d{3,4}$/.test(value) ? "" : "Invalid CVV";
      //   break;
      case "phone":
        newErrors.phone = /^[0-9]{10}$/.test(value)
          ? ""
          : "Phone number must be exactly 10 digits";
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

    if (hasError || Object.values(errors).some((error) => error)) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    submitOrder();
  };

  const submitOrder = async () => {
    // Chuẩn bị dữ liệu body từ formData và cart
    const orderData = {
      cus_name: formData.name,
      phone_number: formData.phone,
      address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`,
      notes: "No additional notes",
      listDish: cart.map((item) => ({
        dish_id: item.id,
        dish_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    const fetchOrder = await http("/order/submit-online/1", "POST", orderData);
    if (fetchOrder.status == 201) {
      toast.success(`Checkout Successful!`, {
        position: "top-right",
        autoClose: 1500,
      });
    }
    clearCart();
    navigate("/activity-history");
  };
  return (
    <div>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2 className="section-title">Check Out</h2>
        <div className="payment-method-section">
          <div className="shipping-info">
            <h3 className="section-subtitle">
              <FaShippingFast className="icon" /> Shipping Information
            </h3>
            <div className="form-group-checkout">
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
            <div className="form-group-checkout">
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
            <div className="form-group-checkout">
              <label htmlFor="province">Province/City</label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
              >
                <option value="">-- Select Province/City --</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="error-message">{errors.province}</p>
              )}
            </div>
            <div className="form-group-checkout">
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
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="error-message">{errors.district}</p>
              )}
            </div>
            <div className="form-group-checkout">
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
            <div className="form-group-checkout">
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
    </div>
  );
};

export default CheckoutForm;
