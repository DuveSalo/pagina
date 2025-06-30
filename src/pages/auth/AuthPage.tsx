
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import { ROUTE_PATHS } from '../../../constants';

const AuthPage: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(mode === 'login' ? 'user@example.com' : '');
  const [password, setPassword] = useState(mode === 'login' ? 'password' : '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError((err as Error).message || 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const pageTitle = mode === 'login' ? 'Log in' : 'Start your free trial';
  const submitText = mode === 'login' ? 'Log in' : 'Start free trial';
  const switchLink = mode === 'login' 
    ? { to: ROUTE_PATHS.REGISTER, text: "¿No tienes cuenta? Regístrate" }
    : { to: ROUTE_PATHS.LOGIN, text: "¿Ya tienes cuenta? Inicia Sesión" };

  return (
    <AuthLayout title={pageTitle}>
      <form onSubmit={handleSubmit} className="space-y-3 px-4 py-3">
        {mode === 'register' && (
          <Input 
            label="Name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name" 
            isAuthPage 
            required 
          />
        )}
        <Input 
          label="Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          autoComplete="email" 
          isAuthPage 
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password" 
          autoComplete={mode === 'login' ? "current-password" : "new-password"} 
          isAuthPage 
          required 
        />
        {error && <p className="text-sm text-red-500 text-center py-2">{error}</p>}
        <Button type="submit" isLoading={isLoading} variant="authPrimary" size="auth" className="w-full !mt-6">
          {submitText}
        </Button>
      </form>
      {mode === 'register' && (
         <p className="text-auth-textMuted text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
            By signing up, you agree to our <a href="#" className="underline hover:text-auth-buttonPrimaryBg">Terms of Service</a> and <a href="#" className="underline hover:text-auth-buttonPrimaryBg">Privacy Policy</a>
         </p>
      )}
      <p className="mt-4 text-center text-sm text-auth-textMuted">
        <Link to={switchLink.to} className="font-medium text-auth-buttonPrimaryBg hover:underline">
          {switchLink.text}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default AuthPage;