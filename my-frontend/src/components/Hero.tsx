import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Professional Home Services at Your Fingertips</h1>
        <p>Book trusted professionals for all your home service needs. Fast, reliable, and hassle-free.</p>
        <div className="hero-buttons">
          <Link to="/book" className="primary-btn">Join as a client</Link>
          <Link to="/services" className="secondary-btn">Became a provider</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/hero-image.jpg" alt="Home Services" />
      </div>
    </div>
  );
};

export default Hero; 