import React from 'react';
import './Services.css';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Cleaning',
    description: 'Professional home cleaning services for your entire house.',
    icon: '🧹'
  },
  {
    id: 2,
    title: 'Plumbing',
    description: 'Expert plumbing services for repairs and installations.',
    icon: '🔧'
  },
  {
    id: 3,
    title: 'Electrical',
    description: 'Certified electricians for all your electrical needs.',
    icon: '⚡'
  },
  {
    id: 4,
    title: 'Painting',
    description: 'Professional painting services for interior and exterior.',
    icon: '🎨'
  },
  {
    id: 5,
    title: 'Gardening',
    description: 'Landscaping and garden maintenance services.',
    icon: '🌿'
  },
  {
    id: 6,
    title: 'Carpentry',
    description: 'Custom woodwork and furniture repairs.',
    icon: '🪚'
  }
];

const Services: React.FC = () => {
  return (
    <section className="services">
      <h2>Our Services</h2>
      <p className="services-subtitle">Professional solutions for all your home needs</p>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <button className="book-service-btn">Book Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services; 