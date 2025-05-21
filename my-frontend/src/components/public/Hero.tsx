import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Professional Home Services at Your Fingertips</h1>
          <p>Book trusted professionals for all your home service needs. Fast, reliable, and hassle-free.</p>
          <div className="hero-buttons">
            <Link to="/book" className="primary-btn">Become a provider</Link>
            <Link to="/services" className="secondary-btn">join as a client</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 