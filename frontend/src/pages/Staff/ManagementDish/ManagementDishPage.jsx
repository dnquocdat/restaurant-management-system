import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./ManagementDishPage.css"; // Import file CSS

const ManagementDishPage = () => {
  const [dishes, setDishes] = useState([
    {
      id: 1,
      name: "Grilled Salmon",
      price: 24.99,
      description:
        "Fresh Atlantic salmon grilled to perfection with a blend of herbs and citrus. Served with seasonal vegetables and herb-infused rice.",
      category: "Seafood",
      image:
        "images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500",
    },
    {
      id: 2,
      name: "Margherita Pizza",
      price: 18.99,
      description:
        "Traditional Neapolitan pizza featuring San Marzano tomatoes, fresh mozzarella, and aromatic basil leaves on a perfectly crispy crust.",
      category: "Pizza",
      image:
        "images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500",
    },
    {
      id: 3,
      name: "Margherita Pizza",
      price: 18.99,
      description:
        "Traditional Neapolitan pizza featuring San Marzano tomatoes, fresh mozzarella, and aromatic basil leaves on a perfectly crispy crust.",
      category: "Pizza",
      image:
        "images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDish, setSelectedDish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDish = () => {
    setFormMode("add");
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const handleEditDish = (dish) => {
    setFormMode("edit");
    setSelectedDish(dish);
    setFormData({
      ...dish,
    });
    setIsModalOpen(true);
  };

  const handleDeleteDish = (dish) => {
    setSelectedDish(dish);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setDishes(dishes.filter((dish) => dish.id !== selectedDish.id));
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDish = {
      ...formData,
      id: formMode === "add" ? dishes.length + 1 : selectedDish.id,
      price: parseFloat(formData.price),
    };

    if (formMode === "add") {
      setDishes([...dishes, newDish]);
    } else {
      setDishes(
        dishes.map((dish) => (dish.id === selectedDish.id ? newDish : dish))
      );
    }
    setIsModalOpen(false);
  };

  const handleViewDetails = (dish) => {
    setSelectedDish(dish);
    setIsViewModalOpen(true);
  };

  return (
    <div className="restaurant-dish-manager">
      <div className="container">
        <div className="header">
          <h1 className="title">Restaurant Dish Manager</h1>
          <button
            onClick={handleAddDish}
            className="add-dish-button"
            aria-label="Add new dish"
          >
            <FiPlus /> Add Dish
          </button>
        </div>

        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes by name or category..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="dishes-grid">
          <AnimatePresence>
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="dish-card"
              >
                <img
                  src={`https://${dish.image}`}
                  alt={dish.name}
                  className="dish-image"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                  }}
                />
                <div className="dish-info">
                  <h3 className="dish-name">{dish.name}</h3>
                  <p className="dish-price">${dish.price.toFixed(2)}</p>
                  <p className="dish-description">{dish.description}</p>
                  <div className="dish-actions">
                    <button
                      onClick={() => handleViewDetails(dish)}
                      className="view-details-button"
                      style={{ margin: 0 }}
                      aria-label={`View details for ${dish.name}`}
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleEditDish(dish)}
                      className="edit-button"
                      style={{ margin: 0 }}
                      aria-label={`Edit ${dish.name}`}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteDish(dish)}
                      className="delete-button"
                      style={{ margin: 0, fontSize: 20 }}
                      aria-label={`Delete ${dish.name}`}
                    >
                      <FiTrash2 style={{ fontSize: 20 }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal components */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">
                {formMode === "add" ? "Add New Dish" : "Edit Dish"}
              </h2>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    required
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    {formMode === "add" ? "Add Dish" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Confirm Delete</h2>
              <p>Are you sure you want to delete {selectedDish?.name}?</p>
              <div className="confirm-delete-modal">
                <div className="form-actions">
                  <button onClick={confirmDelete} className="delete-button">
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {isViewModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Dish Details</h2>
              <div className="view-dish-details">
                <img
                  src={`https://${selectedDish?.image}`}
                  alt={selectedDish?.name}
                  className="dish-image"
                />
                <div className="dish-info">
                  <h3>{selectedDish?.name}</h3>
                  <p>{selectedDish?.description}</p>
                  <p>Price: ${selectedDish?.price}</p>
                  <p>Category: {selectedDish?.category}</p>
                </div>
                <div className="form-actions">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="cancel-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementDishPage;
