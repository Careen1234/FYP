import React from 'react';
import { Service } from '../../types';
import Button from '../common/Button';

interface ServiceCardProps {
  service: Service;
  onRequest?: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onRequest }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-3">{service.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-[#147c3c]">{formatPrice(service.price)}/hr</div>
          {onRequest && (
            <Button 
              variant="primary"
              size="sm"
              onClick={() => onRequest(service)}
            >
              Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;