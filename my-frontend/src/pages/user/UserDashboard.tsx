import React, { useState } from 'react';
import { Home, Car, Scissors, History, Settings } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { categories, serviceRequests } from '../../data/mockData';
import CategoryCard from '../../components/service/CategoryCard';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  
  // Mock data for service requests
  const userRequests = serviceRequests.filter(req => req.userId === user?.id);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl font-semibold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'services'
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('services')}
                >
                  <Home size={20} />
                  <span>Browse Services</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'requests'
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('requests')}
                >
                  <History size={20} />
                  <span>My Requests</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {activeTab === 'services' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Browse Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {categories.map(category => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'requests' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Service Requests</h2>
                {userRequests.length > 0 ? (
                  <div className="space-y-4">
                    {userRequests.map(request => {
                      const serviceId = request.serviceId;
                      const service = services.find(s => s.serviceId === serviceId);
                      const provider = providers.find(p => p.id === request.providerId);
                      
                      return (
                        <div key={request.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{service?.name || 'Unknown Service'}</h3>
                              <p className="text-gray-600">{provider?.name || 'Unknown Provider'}</p>
                              <div className="mt-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  request.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : request.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : request.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {new Date(request.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {request.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <History size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests yet</h3>
                    <p className="text-gray-600">Browse our categories and request a service to get started.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md"
                        defaultValue={user?.name}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-md"
                        defaultValue={user?.email}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-md"
                        defaultValue={user?.phone}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Change Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="New password"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-teal-600 text-white rounded-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;