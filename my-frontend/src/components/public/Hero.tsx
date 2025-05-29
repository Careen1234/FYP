import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleClientRegistration = () => {
    navigate('/auth?mode=register&type=client');
  };

  const handleProviderRegistration = () => {
    navigate('/auth?mode=register&type=provider');
  };

  return (
    <div className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Professional Home Services at Your Fingertips</h1>
          <p>Book trusted professionals for all your home service needs. Fast, reliable, and hassle-free.</p>
          <div className="hero-buttons">
            <button onClick={handleProviderRegistration} className="primary-btn">
              Become a provider
            </button>
            <button onClick={handleClientRegistration} className="secondary-btn">
              Join as a client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 