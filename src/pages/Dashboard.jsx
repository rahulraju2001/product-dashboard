import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  getOrders
} from "../services/apiService";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsResponse, ordersResponse] =
          await Promise.all([
            getProducts(),
            getOrders()
          ]);

        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
  }, [orders]);

  const outOfStock = useMemo(() => {
    return products.filter(
      (product) => Number(product.stock) === 0
    ).length;
  }, [products]);

  // Currently based on rating because the order data
  // does not contain product IDs or quantities.
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 5);
  }, [products]);

  const maxRating = useMemo(() => {
    return Math.max(
      ...topProducts.map((product) => Number(product.rating)),
      5
    );
  }, [topProducts]);

  if (loading) {
    return <div className="page">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page dashboard-page">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            STORE OVERVIEW
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Overview of your products, orders and revenue.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon">📦</div>

          <div>
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🛒</div>

          <div>
            <h3>Total Orders</h3>
            <p>{orders.length}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">₹</div>

          <div>
            <h3>Total Revenue</h3>
            <p>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="dashboard-card stock-card">
          <div className="card-icon">⚠</div>

          <div>
            <h3>Out of Stock</h3>
            <p>{outOfStock}</p>
          </div>
        </div>

      </div>

      {/* Top Products */}
      <div className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>Top 5 Products</h2>
            <p>
              Highest-rated products in your store
            </p>
          </div>

          <span className="section-badge">
            Rating
          </span>
        </div>

        <div className="top-products">
          {topProducts.map((product, index) => (
            <div
              className="top-product"
              key={product.id}
            >
              <div className="product-rank">
                #{index + 1}
              </div>

              <img
                src={product.image}
                alt={product.name}
              />

              <div className="top-product-content">
                <h3>{product.name}</h3>

                <p className="product-category">
                  {product.category}
                </p>

                <div className="product-rating">
                  ⭐ {product.rating}
                </div>

                <strong>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Vertical Bar Chart */}
      <div className="dashboard-section chart-section">

        <div className="section-heading">
          <div>
            <h2>Top Products Rating</h2>
            <p>
              Rating comparison of the top 5 products
            </p>
          </div>

          <span className="section-badge">
            Out of 5
          </span>
        </div>

        <div className="vertical-chart">

          {/* Y-axis */}
          <div className="chart-y-axis">
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>

          {/* Chart */}
          <div className="chart-area">

            <div className="chart-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="chart-bars">

              {topProducts.map((product) => {
                const rating = Number(product.rating);

                const height =
                  (rating / maxRating) * 100;

                return (
                  <div
                    className="chart-column"
                    key={product.id}
                  >
                    <div className="bar-value">
                      {rating.toFixed(1)}
                    </div>

                    <div className="bar-wrapper">
                      <div
                        className="vertical-bar"
                        style={{
                          height: `${height}%`
                        }}
                        title={`${product.name}: ${rating}`}
                      />
                    </div>

                    <div className="bar-label">
                      {product.name}
                    </div>
                  </div>
                );
              })}

            </div>

          </div>
        </div>

      </div>

      {/* Orders Overview */}
      <div className="dashboard-section">

        <div className="section-heading">
          <div>
            <h2>Recent Orders</h2>
            <p>
              Order values from your store
            </p>
          </div>
        </div>

        <div className="orders-overview">

          {orders.length === 0 ? (
            <p className="no-results">
              No orders available.
            </p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div
                className="order-overview-row"
                key={order.id}
              >
                <div>
                  <strong>
                    Order #{order.id}
                  </strong>

                  <span>
                    {order.customer}
                  </span>
                </div>

                <span className="order-status">
                  {order.status}
                </span>

                <strong className="order-price">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </strong>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;