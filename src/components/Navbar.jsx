import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          Store Dashboard
        </Link>

        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;