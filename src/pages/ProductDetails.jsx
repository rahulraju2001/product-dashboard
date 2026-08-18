import { useEffect, useState } from "react";

import {
  Link,
  useParams
} from "react-router-dom";

import { getProduct } from "../services/apiService";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);

        setProduct(response.data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-details">
        <img
          src={product.image}
          alt={product.name}
        />

        <div>
          <h1>{product.name}</h1>

          <p>
            <strong>Category:</strong>{" "}
            {product.category}
          </p>

          <p>
            <strong>Price:</strong> ₹{product.price}
          </p>

          <p>
            <strong>Stock:</strong>{" "}
            {product.stock}
          </p>

          <p>
            <strong>Rating:</strong> ⭐{" "}
            {product.rating}
          </p>

          {product.stock === 0 && (
            <p className="out-of-stock">
              Currently Out of Stock
            </p>
          )}

          <Link
            to={`/products/${product.id}/edit`}
            className="primary-button"
          >
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;