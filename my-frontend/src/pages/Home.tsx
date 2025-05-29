import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, ThumbsUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import CategoryCard from '../components/service/CategoryCard';
import { categories } from '../data/mockData';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Quick Help, When You Need It</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with skilled service providers in your area for home services, 
            road assistance, personal care, and more.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white/10"
              onClick={() => navigate('/categories')}
            >
              Explore Services
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mx-auto mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Services</h3>
              <p className="text-gray-600">Browse through various categories and find the service you need.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 mx-auto mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book a Provider</h3>
              <p className="text-gray-600">Choose a trusted service provider and schedule your service.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <ThumbsUp size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get it Done</h3>
              <p className="text-gray-600">Relax while your service is completed by a professional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Service Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              variant="primary"
              onClick={() => navigate('/categories')}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold mr-3">
                  S
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"Found an amazing house cleaner through QUICKASSIST. The booking process was so simple, and the service was excellent!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold mr-3">
                  M
                </div>
                <div>
                  <h4 className="font-semibold">Michael Stevens</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(4)}{'☆'.repeat(1)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"Got stranded with a flat tire and used QUICKASSIST to find a nearby mechanic. He arrived in 20 minutes. Lifesaver!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold mr-3">
                  J
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer Williams</h4>
                  <div className="flex text-yellow-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"As a hairstylist, QUICKASSIST has helped me find new clients in my area. The platform is easy to use and has been great for my business."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join QUICKASSIST today and connect with reliable service providers or offer your services to people in need.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/register')}
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;