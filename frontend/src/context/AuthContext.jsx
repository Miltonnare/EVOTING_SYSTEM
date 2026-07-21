import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiClient('/auth/me');
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        addToast('Logged in successfully', 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        addToast('Registered successfully!', 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      addToast('Logged out', 'info');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
