import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'client' | 'provider' | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const type = searchParams.get('type') as 'client' | 'provider' | null;
    
    if (mode === 'register') {
      setIsLogin(false);
      if (type === 'client' || type === 'provider') {
        setUserType(type);
      }
    } else {
      setIsLogin(true);
      setUserType(null);
    }
  }, [searchParams]);

  return (
    <div>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm 
          onSwitchToLogin={() => setIsLogin(true)} 
          initialUserType={userType}
        />
      )}
    </div>
  );
};

export default AuthPage; 