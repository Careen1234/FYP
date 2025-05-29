import { Category, Service, ServiceProvider, User } from '../types';

export const categories: Category[] = [
  {
    id: 'home',
    name: 'Home Service',
    description: 'Get help with various home maintenance tasks',
    icon: 'home',
  },
  {
    id: 'road',
    name: 'Road Assistance',
    description: 'Get help with vehicle repairs and maintenance',
    icon: 'car',
  },
  {
    id: 'personal',
    name: 'Personal Care',
    description: 'Beauty and personal care services',
    icon: 'scissors',
  },
];

export const services: Service[] = [
  // Home services
  {
    id: 'gardening',
    name: 'Gardening',
    description: 'Lawn maintenance, planting, and garden care',
    price: 25000,
    categoryId: 'home',
  },
  {
    id: 'house-cleaning',
    name: 'House Cleaning',
    description: 'General house cleaning and organization',
    price: 30000,
    categoryId: 'home',
  },
  {
    id: 'cloth-washing',
    name: 'Cloth Washing',
    description: 'Laundry services and ironing',
    price: 20000,
    categoryId: 'home',
  },
  {
    id: 'car-washing',
    name: 'Car Washing',
    description: 'Interior and exterior car cleaning',
    price: 35000,
    categoryId: 'home',
  },
  {
    id: 'carpet-cleaning',
    name: 'Carpet Cleaning',
    description: 'Deep cleaning of carpets and rugs',
    price: 40000,
    categoryId: 'home',
  },
  
  // Road assistance
  {
    id: 'car-repair',
    name: 'Car Repair',
    description: 'General car repairs and maintenance',
    price: 50000,
    categoryId: 'road',
  },
  {
    id: 'car-fixer',
    name: 'Car Fixer',
    description: 'On-the-spot car fixes and emergency repairs',
    price: 45000,
    categoryId: 'road',
  },
  
  // Personal care
  {
    id: 'hair-dressing',
    name: 'Hair Dressing',
    description: 'Haircuts, styling, and treatments',
    price: 35000,
    categoryId: 'personal',
  },
  {
    id: 'nail-making',
    name: 'Nail Services',
    description: 'Manicures, pedicures, and nail art',
    price: 30000,
    categoryId: 'personal',
  },
  {
    id: 'men-saloon',
    name: 'Men\'s Salon',
    description: 'Haircuts, shaving, and men\'s grooming',
    price: 25000,
    categoryId: 'personal',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    type: 'user',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
];

export const mockProviders: ServiceProvider[] = [
  {
    id: 'provider1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '987-654-3210',
    type: 'provider',
    category: categories[0],
    services: [services[0], services[1]],
    available: true,
    rating: 4.8,
    completedJobs: 125,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'provider2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '555-123-4567',
    type: 'provider',
    category: categories[1],
    services: [services[5], services[6]],
    available: true,
    rating: 4.5,
    completedJobs: 87,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'provider3',
    name: 'Carol Wilson',
    email: 'carol@example.com',
    phone: '555-987-6543',
    type: 'provider',
    category: categories[2],
    services: [services[7], services[8]],
    available: false,
    rating: 4.9,
    completedJobs: 203,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
];

export const serviceRequests = [
  {
    id: 'req1',
    userId: 'user1',
    providerId: 'provider1',
    serviceId: 'gardening',
    status: 'pending',
    date: '2025-04-15T10:00:00',
    location: '123 Main St',
    notes: 'Please bring gardening tools',
  },
  {
    id: 'req2',
    userId: 'user1',
    providerId: 'provider2',
    serviceId: 'car-repair',
    status: 'completed',
    date: '2025-04-10T14:30:00',
    location: '456 Oak Ave',
  },
];