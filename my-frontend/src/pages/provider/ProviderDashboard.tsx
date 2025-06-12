import React, { useState } from 'react';
import { Home, Clock, Settings, DollarSign, Eye, EyeOff, Activity } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { serviceRequests } from '../../data/mockData';
import Button from '../../components/common/Button';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const provider = user;
  const [activeTab, setActiveTab] = useState('overview');
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Mock data for service requests for this provider
  const providerRequests = serviceRequests.filter(req => req.providerId === provider?.id);
  
  // Stats for the overview
  const stats = {
    pendingRequests: providerRequests.filter(req => req.status === 'pending').length,
    completedJobs: providerRequests.filter(req => req.status === 'completed').length,
    totalEarnings: providerRequests
      .filter(req => req.status === 'completed')
      .reduce((total, req) => {
        // In a real app, we'd calculate based on actual service prices
        return total + 50; // Mock value
      }, 0),
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-6">
                {provider?.avatar ? (
                  <img 
                    src={provider.avatar} 
                    alt={provider.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl font-semibold">
                    {provider?.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold">{provider?.name}</h2>
                  <p className="text-gray-600">{provider?.email}</p>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="relative inline-block w-10 mr-2 align-middle">
                  <input 
                    type="checkbox" 
                    id="toggle-availability" 
                    className="sr-only peer"
                    checked={isAvailable}
                    onChange={() => setIsAvailable(!isAvailable)}
                  />
                  <div className="block bg-gray-300 w-10 h-6 rounded-full peer-checked:bg-green-500"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4"></div>
                </div>
                <label 
                  htmlFor="toggle-availability" 
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  {isAvailable ? (
                    <>
                      <Eye size={16} className="mr-1 text-green-500" /> Available
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} className="mr-1 text-gray-500" /> Unavailable
                    </>
                  )}
                </label>
              </div>
              
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Activity size={20} />
                  <span>Overview</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'requests'
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('requests')}
                >
                  <Clock size={20} />
                  <span>Service Requests</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'services'
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('services')}
                >
                  <Home size={20} />
                  <span>My Services</span>
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
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="rounded-full p-3 bg-blue-100 text-blue-600 mr-4">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                        <p className="text-2xl font-semibold">{stats.pendingRequests}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="rounded-full p-3 bg-green-100 text-green-600 mr-4">
                        <Home size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                        <p className="text-2xl font-semibold">{stats.completedJobs}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="rounded-full p-3 bg-yellow-100 text-yellow-600 mr-4">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                        <p className="text-2xl font-semibold">${stats.totalEarnings}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  {providerRequests.length > 0 ? (
                    <div className="space-y-4">
                      {providerRequests.slice(0, 3).map(request => (
                        <div key={request.id} className="flex justify-between items-center border-b border-gray-100 pb-4">
                          <div>
                            <p className="font-medium">{request.serviceId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(request.date).toLocaleDateString()} at {new Date(request.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
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
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'requests' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Service Requests</h2>
                {providerRequests.length > 0 ? (
                  <div className="space-y-4">
                    {providerRequests.map(request => (
                      <div key={request.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <h3 className="font-semibold text-lg capitalize">
                              {request.serviceId.split('-').join(' ')}
                            </h3>
                            <p className="text-gray-600">
                              {new Date(request.date).toLocaleDateString()} at {new Date(request.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Location: {request.location}
                            </p>
                            {request.notes && (
                              <p className="text-sm text-gray-500 mt-1">
                                Notes: {request.notes}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
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
                            {request.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button size="sm" variant="primary">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline">
                                  Decline
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests yet</h3>
                    <p className="text-gray-600">Once customers request your services, they will appear here.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'services' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Services</h2>
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Service Settings</h3>
                    <p className="text-gray-600">Manage your services and pricing</p>
                  </div>
                  
                  <div className="p-6">
                    {provider && 'services' in provider && (provider as any).services.length > 0 ? (
                      <div className="space-y-6">
                        {(provider as any).services.map((service: any) => (
                          <div key={service.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                              <div>
                                <h4 className="font-semibold">{service.name}</h4>
                                <p className="text-gray-600">{service.description}</p>
                              </div>
                              <div className="flex items-center mt-4 md:mt-0">
                                <div className="flex items-center mr-6">
                                  <DollarSign size={16} className="text-gray-500 mr-1" />
                                  <input
                                    type="number"
                                    defaultValue={service.price}
                                    min="1"
                                    className="w-20 p-1 border rounded"
                                  />
                                </div>
                                <Button size="sm" variant="outline">Update</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No services set up yet.</p>
                        <Button variant="primary" className="mt-4">
                          Add New Service
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
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
                        defaultValue={provider?.name}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-md"
                        defaultValue={provider?.email}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-md"
                        defaultValue={provider?.phone}
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
                      <Button
                        type="button"
                        variant="primary"
                      >
                        Save Changes
                      </Button>
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

export default ProviderDashboard;