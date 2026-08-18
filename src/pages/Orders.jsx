import {
  useEffect,
  useMemo,
  useState
} from "react";

import SearchBar from "../components/SearchBar";
import { getOrders } from "../services/apiService";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [sortDate, setSortDate] =
    useState("newest");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();

        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      result = result.filter(
        (order) =>
          order.customer
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(order.id).includes(search)
      );
    }

    if (status !== "all") {
      result = result.filter(
        (order) => order.status === status
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortDate === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return result;
  }, [orders, search, status, sortDate]);

  const totalOrderAmount = useMemo(() => {
    return filteredOrders.reduce(
      (sum, order) =>
        sum + Number(order.total),
      0
    );
  }, [filteredOrders]);

  if (loading) {
    return <div className="page">Loading orders...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders</p>
        </div>

        <div className="order-total">
          Total: ₹
          {totalOrderAmount.toLocaleString()}
        </div>
      </div>

      <div className="filters">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search customer or order ID..."
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="all">All Status</option>
          <option value="Delivered">Delivered</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={sortDate}
          onChange={(e) =>
            setSortDate(e.target.value)
          }
        >
          <option value="newest">
            Newest First
          </option>

          <option value="oldest">
            Oldest First
          </option>
        </select>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>

                <td>{order.customer}</td>

                <td>{order.date}</td>

                <td>
                  <span
                    className={`status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>{order.items}</td>

                <td>
                  ₹{order.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <p className="no-results">
          No orders found.
        </p>
      )}
    </div>
  );
}

export default Orders;