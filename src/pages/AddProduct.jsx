import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../services/apiService";

function AddProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (product) => {
    try {
      await createProduct(product);

      alert("Product added successfully!");

      navigate("/products");
    } catch (error) {
      alert("Failed to add product.");
    }
  };

  return (
    <div className="page">
      <h1>Add Product</h1>

      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddProduct;