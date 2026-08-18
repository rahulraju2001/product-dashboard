import { useState } from "react";

function ProductForm({ initialValues, onSubmit }) {
  const [formData, setFormData] = useState(
    initialValues || {
      name: "",
      category: "",
      price: "",
      stock: "",
      rating: "",
      image: ""
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (
      formData.price === "" ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Price must be greater than 0";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (
      formData.rating === "" ||
      Number(formData.rating) < 0 ||
      Number(formData.rating) > 5
    ) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating)
    });
  };

  const handleReset = () => {
    setFormData(
      initialValues || {
        name: "",
        category: "",
        price: "",
        stock: "",
        rating: "",
        image: ""
      }
    );

    setErrors({});
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product Name</label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        {errors.name && (
          <p className="error">{errors.name}</p>
        )}
      </div>

      <div className="form-group">
        <label>Category</label>

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />

        {errors.category && (
          <p className="error">{errors.category}</p>
        )}
      </div>

      <div className="form-group">
        <label>Price</label>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />

        {errors.price && (
          <p className="error">{errors.price}</p>
        )}
      </div>

      <div className="form-group">
        <label>Stock</label>

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
        />

        {errors.stock && (
          <p className="error">{errors.stock}</p>
        )}
      </div>

      <div className="form-group">
        <label>Rating</label>

        <input
          type="number"
          name="rating"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
        />

        {errors.rating && (
          <p className="error">{errors.rating}</p>
        )}
      </div>

      <div className="form-group">
        <label>Image URL</label>

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />

        {errors.image && (
          <p className="error">{errors.image}</p>
        )}
      </div>

      <div className="form-buttons">
        <button type="submit" className="primary-button">
          Submit
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default ProductForm;