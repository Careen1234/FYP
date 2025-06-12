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
        <Link to="/book">Book Now</Link>
        <Link to="/about">About us</Link>
        <Link to="/contact">Contact</Link>

        {/* Login and Register as Links styled as buttons */}
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/register" className="login-btn">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
