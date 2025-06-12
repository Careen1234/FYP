import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import './Navbar.css';
import '../ContactModal';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

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
        <button className="login-btn">Login</button>
        <button className="login-btn">register</button>
      </div>
    </nav>
  );
};

export default Navbar;
