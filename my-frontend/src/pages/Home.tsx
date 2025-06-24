import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, ThumbsUp, Users, Clock, Shield, Home as HomeIcon, Car, Scissors } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/layout/Footer';
import './Home.css';
// Import hero images
import hero1 from '../assets/hero1.jpg';
import hero2 from '../assets/hero2.jpg';
import hero3 from '../assets/hero3.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Hero slider state and logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    {
      src: hero1,
      alt: 'Professional Home Services'
    },
    {
      src: hero2, 
      alt: 'Roadside Assistance'
    },
    {
      src: hero3,
      alt: 'Personal Care Services'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const elementsToObserve = document.querySelectorAll('.scroll-fade-in, .scroll-slide-up');
    elementsToObserve.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>      {/* Hero Section with Image Slider */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image.src})` }}
            >
              <div className="hero-overlay"></div>
            </div>
          ))}
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title fade-in-up">{t('heroTitle')}</h1>
          <p className="hero-subtitle fade-in-up" style={{ animationDelay: '0.3s' }}>
            {t('heroSubtitle')}
          </p>
          <div className="hero-buttons fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button 
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              {t('getStarted')}
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('exploreServices')}
            </button>
          </div>
        </div>
        
        {/* Slider indicators */}
        <div className="hero-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title scroll-fade-in">{t('howItWorksTitle')}</h2>
          <div className="steps-grid">
            <div className="step-card scroll-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="step-icon">
                <Search size={32} />
              </div>
              <h3 className="step-title">{t('findServicesTitle')}</h3>
              <p className="step-description">{t('findServicesDesc')}</p>
            </div>
            <div className="step-card scroll-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="step-icon">
                <CheckCircle size={32} />
              </div>
              <h3 className="step-title">{t('bookProviderTitle')}</h3>
              <p className="step-description">{t('bookProviderDesc')}</p>
            </div>
            <div className="step-card scroll-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="step-icon">
                <ThumbsUp size={32} />
              </div>
              <h3 className="step-title">{t('getDoneTitle')}</h3>
              <p className="step-description">{t('getDoneDesc')}</p>
            </div>
          </div>
        </div>
      </section>{/* Service Categories Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="section-title">{t('servicesTitle')}</h2>
          <p className="section-subtitle">{t('servicesSubtitle')}</p>
          <div className="services-grid">
            
            {/* Home Services */}
            <div className="service-category-card">
              <div className="service-icon home-services">
                <HomeIcon size={40} />
              </div>
              <h3 className="service-title">{t('homeServicesTitle')}</h3>              <ul className="service-list">
                {(t('homeServicesList') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button 
                className="service-btn"
                onClick={() => navigate('/categories/home')}
              >
                {t('bookHomeService')}
              </button>
            </div>

            {/* Personal Care */}
            <div className="service-category-card">
              <div className="service-icon personal-care">
                <Scissors size={40} />
              </div>
              <h3 className="service-title">{t('personalCareTitle')}</h3>              <ul className="service-list">
                {(t('personalCareList') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button 
                className="service-btn"
                onClick={() => navigate('/categories/personal')}
              >
                {t('bookPersonalCare')}
              </button>
            </div>

            {/* Roadside Assistance */}
            <div className="service-category-card">
              <div className="service-icon roadside">
                <Car size={40} />
              </div>
              <h3 className="service-title">{t('roadsideTitle')}</h3>              <ul className="service-list">
                {(t('roadsideList') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button 
                className="service-btn"
                onClick={() => navigate('/categories/roadside')}
              >
                {t('getRoadHelp')}
              </button>
            </div>

          </div>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button 
              className="btn-primary"
              onClick={() => navigate('/services')}
            >
              {t('viewAllServices')}
            </button>
          </div>
        </div>
      </section>      {/* Why Choose Us Section */}
      <section id="why-us" className="how-it-works" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title scroll-fade-in">{t('whyChooseTitle')}</h2>
          <div className="steps-grid">
            <div className="step-card scroll-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="step-icon">
                <Shield size={32} />
              </div>
              <h3 className="step-title">{t('verifiedTitle')}</h3>
              <p className="step-description">{t('verifiedDesc')}</p>
            </div>
            <div className="step-card scroll-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="step-icon">
                <Clock size={32} />
              </div>
              <h3 className="step-title">{t('quickResponseTitle')}</h3>
              <p className="step-description">{t('quickResponseDesc')}</p>
            </div>
            <div className="step-card scroll-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="step-icon">
                <Users size={32} />
              </div>
              <h3 className="step-title">{t('communityTrustedTitle')}</h3>
              <p className="step-description">{t('communityTrustedDesc')}</p>
            </div>
          </div>
        </div>
      </section>{/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t('testimonialsTitle')}</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">A</div>
                <div className="testimonial-info">
                  <h4>Amina Mwalimu</h4>
                  <div className="testimonial-stars">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">"{t('testimonial1')}"</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">J</div>
                <div className="testimonial-info">
                  <h4>John Mbwana</h4>
                  <div className="testimonial-stars">
                    {'★'.repeat(4)}{'☆'.repeat(1)}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">"{t('testimonial2')}"</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">F</div>
                <div className="testimonial-info">
                  <h4>Fatuma Hassan</h4>
                  <div className="testimonial-stars">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">"{t('testimonial3')}"</p>
            </div>
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section id="cta" className="cta-section">
        <div className="container">
          <h2 className="cta-title">{t('ctaTitle')}</h2>
          <p className="cta-description">
            {t('ctaDescription')}
          </p>
          <button 
            className="btn-primary"            onClick={() => navigate('/register')}
          >
            {t('signUpFree')}
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;