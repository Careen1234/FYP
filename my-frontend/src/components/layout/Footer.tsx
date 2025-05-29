import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">QUICKASSIST</h3>
            <p className="text-sm">
              Connecting you with reliable service providers in your area.
              Get the help you need, when you need it.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="text-sm space-y-2">
              <li>Home Services</li>
              <li>Road Assistance</li>
              <li>Personal Care</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm">Email: info@quickassist.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center">
          &copy; {new Date().getFullYear()} QUICKASSIST. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;