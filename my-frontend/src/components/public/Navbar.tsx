import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMenu}>QuickAssist</Link>
        </div>        {/* Desktop Navigation */}
        <div className={`navbar-links ${isMenuOpen ? 'navbar-links-mobile' : ''}`}>
          <a 
            href="#services" 
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('services')}
          </a>
          <a 
            href="#how-it-works" 
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('howItWorks')}
          </a>
          <a 
            href="#why-us" 
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('whyUs')}
          </a>
          <a 
            href="#testimonials" 
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('reviews')}
          </a>

          {/* Language Toggle */}
          <div className="language-toggle">
            <button 
              onClick={() => setLanguage('sw')} 
              className={`lang-btn ${language === 'sw' ? 'active' : ''}`}
            >
              🇹🇿 SW
            </button>
            <button 
              onClick={() => setLanguage('en')} 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            >
              🇬🇧 EN
            </button>
          </div>
          
          <div className="navbar-auth-buttons">            <button
              className="login-btn"
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
            >
              {t('login')}
            </button>
            <button
              className="register-btn"
              onClick={() => {
                navigate("/register");
                closeMenu();
              }}
            >
              {t('register')}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
