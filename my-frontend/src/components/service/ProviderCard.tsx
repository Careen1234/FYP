import React from 'react';
import { ServiceProvider } from '../../types';
import { Star, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

interface ProviderCardProps {
  provider: ServiceProvider;
  onSelect: (provider: ServiceProvider) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex items-center mb-4">
          {provider.avatar ? (
            <img 
              src={provider.avatar} 
              alt={provider.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold mr-4">
              {provider.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
              <span className="text-sm">{provider.rating} ({provider.completedJobs} jobs)</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Services:</h4>
          <div className="flex flex-wrap gap-2">
            {provider.services.map(service => (
              <span 
                key={service.id}
                className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700"
              >
                {service.name}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${provider.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-sm text-gray-600">{provider.available ? 'Available' : 'Unavailable'}</span>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            disabled={!provider.available}
            onClick={() => onSelect(provider)}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;