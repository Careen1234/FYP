import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import "./Navbar.css";
import "../ContactModal";

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
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
