import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Car, Scissors } from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (category.id) {
      case 'home':
        return <Home size={32} />;
      case 'road':
        return <Car size={32} />;
      case 'personal':
        return <Scissors size={32} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => navigate(`/categories/${category.id}`)}
    >
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-4">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
        <p className="text-gray-600">{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;