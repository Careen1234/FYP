import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">QuickAssist</Link>
      </div>
      <div className="navbar-links">
        <Link to="/services">Services</Link>

        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>

        <Link to="/register">
          <button className="login-btn">Register</button>
        </Link>

        <Link to="/become-provider">
          <button className="login-btn">Become a Provider</button>
        </Link>

        <Link to="/request-service">
          <button className="login-btn">Request Service</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
