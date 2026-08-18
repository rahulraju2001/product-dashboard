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

  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [products]);

  if (loading) {
    return <div className="page">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="dashboard-card">
          <h3>Out of Stock</h3>
          <p>{outOfStock}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Top 5 Products</h2>

        <div className="top-products">
          {topProducts.map((product) => (
            <div
              className="top-product"
              key={product.id}
            >
              <img
                src={product.image}
                alt={product.name}
              />

              <div>
                <h3>{product.name}</h3>
                <p>Rating: ⭐ {product.rating}</p>
                <p>₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Orders Overview</h2>

        <div className="simple-chart">
          {orders.map((order) => (
            <div className="chart-row" key={order.id}>
              <span>Order #{order.id}</span>

              <div className="chart-bar">
                <div
                  style={{
                    width: `${Math.min(
                      order.total / 100,
                      100
                    )}%`
                  }}
                />
              </div>

              <strong>₹{order.total}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;