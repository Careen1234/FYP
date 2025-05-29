import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'user' | 'provider'>('user');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = await login(email, password, userType);
    
    if (success) {
      navigate(userType === 'user' ? '/user/dashboard' : '/provider/dashboard');
    } else {
      setError('Invalid credentials. For demo, use mock data emails.');
    }
  };

  // For demo purposes, we'll use mock data
  const handleDemoLogin = async (type: 'user' | 'provider') => {
    setUserType(type);
    const email = type === 'user' ? 'john@example.com' : 'alice@example.com';
    setEmail(email);
    setPassword('password');
    
    const success = await login(email, 'password', type);
    
    if (success) {
      navigate(type === 'user' ? '/user/dashboard' : '/provider/dashboard');
    } else {
      setError('Demo login failed');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-teal-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Log in to QUICKASSIST</h1>
          <p className="text-gray-600 mt-2">Access your account to find or provide services</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
          
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <span className="text-teal-600 hover:text-teal-500 cursor-pointer">
                Forgot password?
              </span>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Log in
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or log in with demo accounts</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('user')}
            >
              Demo User
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('provider')}
            >
              Demo Provider
            </Button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-sm text-gray-600">
          Don't have an account?{' '}
          <span
            className="text-teal-600 hover:text-teal-500 cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </div>
    </Layout>
  );
};

export default Login;