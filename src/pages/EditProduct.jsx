import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import ProductForm from "../components/ProductForm";

import {
  getProduct,
  updateProduct
} from "../services/apiService";

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);

        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (updatedProduct) => {
    try {
      await updateProduct(id, updatedProduct);

      alert("Product updated successfully!");

      navigate("/products");
    } catch (err) {
      alert("Failed to update product.");
    }
  };

  if (loading) {
    return <div className="page">Loading product...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <h1>Edit Product</h1>

      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EditProduct;