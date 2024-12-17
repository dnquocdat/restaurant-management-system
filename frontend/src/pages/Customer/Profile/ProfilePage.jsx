import React, { useState } from "react";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [avatar, setAvatar] = useState(
    "https://via.placeholder.com/150" // Placeholder URL for avatar
  );
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Dang Ngoc Quoc Dat",
    email: "dangngocquocdat10112004@gmail.com",
    address: "123 Main St, City, Country",
    phoneNumber: "+1234567890",
    memberCard: "Gold",
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  return (
    <div className="profile-container" style={{ minHeight: "90vh" }}>
      <h1>Manage Profile</h1>
      <div className="tabs">
        <button
          className={activeTab === "personal-info" ? "active-tab" : ""}
          onClick={() => handleTabClick("personal-info")}
        >
          Personal Information
        </button>
        <button
          className={activeTab === "security" ? "active-tab" : ""}
          onClick={() => handleTabClick("security")}
        >
          Account and Security
        </button>
      </div>

      {activeTab === "personal-info" && (
        <div className="tab-content" style={{ minHeight: "80vh" }}>
          <h2>Personal Information</h2>
          <div className="personal-info-container">
            {/* Avatar Section */}
            <div className="avatar-section">
              <img src={avatar} alt="Avatar" className="avatar-img" />
              <label className="avatar-upload">
                Change Avatar
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </label>
            </div>

            {/* Form Section */}
            <div className="form-section">
              <div className="form-group-prfcus">
                <label>Name</label>
                <input
                  type="text"
                  value={userInfo.name}
                  name="name"
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form-group-prfcus">
                <label>Email</label>
                <input
                  type="email"
                  value={userInfo.email}
                  name="email"
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form-group-prfcus">
                <label>Address</label>
                <input
                  type="text"
                  value={userInfo.address}
                  name="address"
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form-group-prfcus">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={userInfo.phoneNumber}
                  name="phoneNumber"
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form-group-prfcus">
                <label>Member Card</label>
                <input
                  type="text"
                  value={userInfo.memberCard}
                  name="memberCard"
                  disabled
                />
              </div>
              <button className="edit-button" onClick={handleEditToggle}>
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="tab-content">
          <h2>Account and Security</h2>
          <div className="form-group-prfcus">
            <label>Current Password</label>
            <input type="password" placeholder="Enter current password" />
          </div>
          <div className="form-group-prfcus">
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <div className="form-group-prfcus">
            <label>Confirm New Password</label>
            <input type="password" placeholder="Confirm new password" />
          </div>
          <div className="form-actions">
            <button className="save-button">Update</button>
            <button className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
