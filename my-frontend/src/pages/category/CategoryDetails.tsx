import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { categories, services, mockProviders } from '../../data/mockData';
import { Category, Service, ServiceProvider } from '../../types';
import ServiceCard from '../../components/service/ServiceCard';
import ProviderCard from '../../components/service/ProviderCard';
import { useAuth } from '../../contexts/AuthContext';

const CategoryDetails: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryServices, setCategoryServices] = useState<Service[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (categoryId) {
      const foundCategory = categories.find(cat => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        const filteredServices = services.filter(service => service.categoryId === categoryId);
        setCategoryServices(filteredServices);
        
        const filteredProviders = mockProviders.filter(
          provider => provider.category.id === categoryId && provider.available
        );
        setServiceProviders(filteredProviders);
      }
    }
  }, [categoryId]);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  const handleSelectProvider = (provider: ServiceProvider) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // In a real app, we would navigate to a booking page or open a modal
    // For this demo, we'll just show an alert
    alert(`Service requested! ${provider.name} will be notified about your request.`);
  };

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Category not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {categoryServices.map(service => (
                <div 
                  key={service.id}
                  className={`border-b border-gray-100 last:border-0 p-4 cursor-pointer transition-colors ${
                    selectedService?.id === service.id ? 'bg-teal-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectService(service)}
                >
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="text-teal-600 mt-1">${service.price}/hr</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              {selectedService 
                ? `Service Providers for ${selectedService.name}`
                : 'Available Service Providers'
              }
            </h2>
            
            {serviceProviders.length > 0 ? (
              <div className="space-y-6">
                {serviceProviders
                  .filter(provider => 
                    !selectedService || provider.services.some(s => s.id === selectedService.id)
                  )
                  .map(provider => (
                    <ProviderCard 
                      key={provider.id} 
                      provider={provider}
                      onSelect={handleSelectProvider}
                    />
                  ))
                }
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No service providers available for this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryDetails;