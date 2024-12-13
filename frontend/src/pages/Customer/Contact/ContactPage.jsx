import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaDirections,
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import "./ContactPage.css";

export const ContactPage = () => {
  const contactInfo = {
    address: "123 Gourmet Avenue, Culinary District, Food City, FC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@gourmetrestaurant.com",
    workingHours: [
      { day: "Monday - Friday", hours: "11:00 AM - 10:00 PM" },
      { day: "Saturday - Sunday", hours: "10:00 AM - 11:00 PM" },
    ],
    socialMedia: [
      {
        platform: "Facebook",
        icon: <FaFacebookF />,
        link: "https://facebook.com",
      },
      { platform: "Twitter", icon: <FaTwitter />, link: "https://twitter.com" },
      {
        platform: "Instagram",
        icon: <FaInstagram />,
        link: "https://instagram.com",
      },
    ],
  };

  return (
    <div className="contact-map-container">
      <div className="contact-map-grid">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <GoLocation className="icon" aria-hidden="true" />
            <div>
              <h3>Address</h3>
              <p>{contactInfo.address}</p>
            </div>
          </div>
          <div className="info-item">
            <FaPhone className="icon" aria-hidden="true" />
            <div>
              <h3>Phone</h3>
              <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
            </div>
          </div>
          <div className="info-item">
            <FaEnvelope className="icon" aria-hidden="true" />
            <div>
              <h3>Email</h3>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </div>
          </div>
          <div className="info-item">
            <FaClock className="icon" aria-hidden="true" />
            <div>
              <h3>Working Hours</h3>
              {contactInfo.workingHours.map((schedule, index) => (
                <div key={index}>
                  <span>{schedule.day}:</span> {schedule.hours}
                </div>
              ))}
            </div>
          </div>
          <div className="social-media">
            <h3>Follow Us</h3>
            <div className="social-icons">
              {contactInfo.socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.platform} page`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="map-container">
          <iframe
            title="Restaurant Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937586!2d2.292292615509614!3d48.858370079287466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sus!4v1647935894264!5w"
            allowFullScreen
            loading="lazy"
            className="map-iframe"
            aria-label="Google Maps showing restaurant location"
          />
          <a
            href="https://www.google.com/maps/dir//Eiffel+Tower"
            target="_blank"
            rel="noopener noreferrer"
            className="get-directions"
            aria-label="Get directions to our restaurant"
          >
            <FaDirections className="directions-icon" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
