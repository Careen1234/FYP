import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div 
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            QUICKASSIST
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span 
                  className="cursor-pointer hover:text-teal-200 transition-colors" 
                  onClick={() => navigate(user?.type === 'provider' ? '/provider/dashboard' : '/user/dashboard')}
                >
                  Dashboard
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-teal-400 flex items-center justify-center text-teal-800 font-semibold">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="ml-2">{user?.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-teal-200 hover:text-white"
                  >
                    <LogOut size={18} className="mr-1" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <span 
                  className="cursor-pointer hover:text-teal-200 transition-colors" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </span>
                <span 
                  className="cursor-pointer hover:text-teal-200 transition-colors"
                  onClick={() => navigate('/register')}
                >
                  Register
                </span>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-teal-700 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 pb-2 border-b border-teal-600">
                  <div className="h-8 w-8 rounded-full bg-teal-400 flex items-center justify-center text-teal-800 font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                  <span>{user?.name}</span>
                </div>
                <span 
                  className="cursor-pointer hover:text-teal-200 transition-colors" 
                  onClick={() => {
                    navigate(user?.type === 'provider' ? '/provider/dashboard' : '/user/dashboard');
                    setIsOpen(false);
                  }}
                >
                  Dashboard
                </span>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-teal-200 hover:text-white"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <span 
                  className="cursor-pointer hover:text-teal-200 transition-colors" 
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                >
                  Login
                </span>
                <span 
                  className="cursor-pointer hover:text-teal-200 transition-colors"
                  onClick={() => {
                    navigate('/register');
                    setIsOpen(false);
                  }}
                >
                  Register
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;