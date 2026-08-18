import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";

import {
  deleteProduct,
  getProducts
} from "../services/apiService";

import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState("none");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await getProducts();

        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(products.map((product) => product.category))
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (stockFilter === "in-stock") {
      result = result.filter(
        (product) => product.stock > 0
      );
    }

    if (stockFilter === "out-of-stock") {
      result = result.filter(
        (product) => product.stock === 0
      );
    }

    if (sortPrice === "low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortPrice === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    products,
    search,
    category,
    stockFilter,
    sortPrice
  ]);

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const currentProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * productsPerPage;

    return filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );
  }, [
    filteredProducts,
    currentPage
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, stockFilter, sortPrice]);

  const handleDelete = useCallback(async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (err) {
      alert("Failed to delete product.");
    }
  }, []);

  if (loading) {
    return <div className="page">Loading products...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your store products</p>
        </div>

        <Link
          to="/products/add"
          className="primary-button"
        >
          + Add Product
        </Link>
      </div>

      <div className="filters">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search products..."
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) =>
            setStockFilter(e.target.value)
          }
        >
          <option value="all">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">
            Out of Stock
          </option>
        </select>

        <select
          value={sortPrice}
          onChange={(e) =>
            setSortPrice(e.target.value)
          }
        >
          <option value="none">Sort by Price</option>
          <option value="low-high">
            Price: Low to High
          </option>
          <option value="high-low">
            Price: High to Low
          </option>
        </select>
      </div>

      <div className="products-grid">
        {currentProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
            />

            <div className="product-card-body">
              <h2>{product.name}</h2>

              <p className="category">
                {product.category}
              </p>

              <p className="price">
                ₹{product.price}
              </p>

              <p>
                Stock:{" "}
                <strong>
                  {product.stock}
                </strong>
              </p>

              <p>
                Rating: ⭐ {product.rating}
              </p>

              {product.stock === 0 && (
                <span className="out-of-stock">
                  Out of Stock
                </span>
              )}

              <div className="product-actions">
                <Link
                  to={`/products/${product.id}`}
                  className="view-button"
                >
                  View
                </Link>

                <Link
                  to={`/products/${product.id}/edit`}
                  className="edit-button"
                >
                  Edit
                </Link>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(product.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentProducts.length === 0 && (
        <p className="no-results">
          No products found.
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Products;