
import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Company } from '../../types';
import * as api from '../api/mockApi'; 
import { ROUTE_PATHS } from '../../constants';

interface AuthContextType {
  currentUser: User | null;
  currentCompany: Company | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setCompany: (company: Company) => void;
  refreshCompany: () => Promise<void>;
  completeSubscription: (plan: string, paymentDetails: any) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        try {
          const company = await api.getCompanyByUserId(user.id);
          setCurrentCompany(company);
        } catch (error) {
          setCurrentCompany(null);
        }
      } else {
        setCurrentCompany(null);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setCurrentUser(null);
      setCurrentCompany(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const loginUser = async (email: string, pass: string) => {
    const user = await api.login(email, pass);
    setCurrentUser(user);
    try {
      const company = await api.getCompanyByUserId(user.id);
      setCurrentCompany(company);
      if (company.isSubscribed) {
        navigate(ROUTE_PATHS.DASHBOARD);
      } else {
        navigate(ROUTE_PATHS.SUBSCRIPTION);
      }
    } catch {
      setCurrentCompany(null);
      navigate(ROUTE_PATHS.CREATE_COMPANY); 
    }
  };
  
  const registerUser = async (name: string, email: string, pass: string) => {
    const user = await api.register(name, email, pass);
    setCurrentUser(user);
    setCurrentCompany(null); 
    navigate(ROUTE_PATHS.CREATE_COMPANY);
  };

  const logoutUser = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentCompany(null);
    navigate(ROUTE_PATHS.LOGIN);
  };
  
  const setCompanyContext = (company: Company) => {
    setCurrentCompany(company);
  };

  const refreshCompanyData = async () => {
    if (currentUser) {
      setIsLoading(true);
      try {
        const company = await api.getCompanyByUserId(currentUser.id);
        setCurrentCompany(company);
      } catch (error) {
        console.error("Error refreshing company data:", error);
        setCurrentCompany(null); 
      } finally {
        setIsLoading(false);
      }
    }
  };

  const completeSubscriptionContext = async (plan: string, paymentDetails: any) => {
    if (!currentCompany) throw new Error("No company to subscribe.");
    setIsLoading(true);
    try {
      const updatedCompany = await api.subscribeCompany(currentCompany.id, plan, paymentDetails);
      setCurrentCompany(updatedCompany);
      navigate(ROUTE_PATHS.DASHBOARD);
    } catch (error) {
      console.error("Error completing subscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      currentCompany, 
      isLoading, 
      login: loginUser, 
      register: registerUser, 
      logout: logoutUser, 
      setCompany: setCompanyContext, 
      refreshCompany: refreshCompanyData,
      completeSubscription: completeSubscriptionContext
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};