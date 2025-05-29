import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { useAuth } from '../../contexts/AuthContext';
import { categories, services } from '../../data/mockData';

const Register: React.FC = () => {
  const [userType, setUserType] = useState<'user' | 'provider'>('user');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    selectedServices: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.category) newErrors.category = 'Please select a category';
    if (formData.selectedServices.length === 0) newErrors.selectedServices = 'Please select at least one service';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when it's changed
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    const selectedServices = [...formData.selectedServices];
    
    if (selectedServices.includes(serviceId)) {
      const index = selectedServices.indexOf(serviceId);
      selectedServices.splice(index, 1);
    } else {
      selectedServices.push(serviceId);
    }
    
    setFormData({ ...formData, selectedServices });
    
    // Clear error for selectedServices when it's changed
    if (errors.selectedServices && selectedServices.length > 0) {
      const newErrors = { ...errors };
      delete newErrors.selectedServices;
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === 'provider' && !validateStep2()) {
      return;
    }
    
    try {
      await register(formData, userType);
      navigate(userType === 'user' ? '/user/dashboard' : '/provider/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-teal-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
          <p className="text-gray-600 mt-2">Join QUICKASSIST to {userType === 'user' ? 'find services' : 'offer your services'}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              type="button"
              className={`flex-1 py-2 ${
                userType === 'user'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setUserType('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`flex-1 py-2 ${
                userType === 'provider'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setUserType('provider')}
            >
              Service Provider
            </button>
          </div>
        </div>
        
        {userType === 'provider' && (
          <div className="mb-6">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
                <div style={{ width: step === 1 ? '50%' : '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600 transition-all duration-300"></div>
              </div>
              <div className="flex justify-between">
                <div className={`text-xs ${step >= 1 ? 'text-teal-600 font-medium' : 'text-gray-500'}`}>Personal Info</div>
                <div className={`text-xs ${step >= 2 ? 'text-teal-600 font-medium' : 'text-gray-500'}`}>Service Details</div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={userType === 'provider' && step === 1 ? undefined : handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
              
              {userType === 'provider' ? (
                <Button
                  type="button"
                  variant="primary"
                  className="w-full mt-4"
                  onClick={handleNext}
                >
                  Next: Service Details
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-4"
                  isLoading={isLoading}
                >
                  Register as User
                </Button>
              )}
            </>
          )}
          
          {/* Step 2: Service Provider Details */}
          {userType === 'provider' && step === 2 && (
            <>
              <Select
                label="Service Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                options={[
                  { value: '', label: 'Select a category' },
                  ...categories.map(cat => ({
                    value: cat.id,
                    label: cat.name,
                  })),
                ]}
              />
              
              {formData.category && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Select Services
                    {errors.selectedServices && (
                      <span className="ml-2 text-sm text-red-600">{errors.selectedServices}</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    {services
                      .filter(service => service.categoryId === formData.category)
                      .map(service => (
                        <div key={service.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={service.id}
                            checked={formData.selectedServices.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <label htmlFor={service.id} className="ml-2 block text-gray-700">
                            {service.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={isLoading}
                >
                  Register as Provider
                </Button>
              </div>
            </>
          )}
        </form>
        
        <p className="text-center mt-8 text-sm text-gray-600">
          Already have an account?{' '}
          <span
            className="text-teal-600 hover:text-teal-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </Layout>
  );
};

export default Register;