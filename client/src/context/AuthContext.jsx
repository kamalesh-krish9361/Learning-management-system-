import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auralms_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.auth.getMe();
        if (res.success) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res.success) {
      localStorage.setItem('auralms_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success) {
      localStorage.setItem('auralms_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('auralms_token');
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (role) => {
    const email = `${role.toLowerCase()}@auralms.com`;
    return login(email, 'password123');
  };

  const updateProfile = async (updates) => {
    const res = await api.auth.updateProfile(updates);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const toggleWishlist = async (courseId) => {
    if (!user) return false;
    try {
      const res = await api.auth.toggleWishlist(courseId);
      if (res.success) {
        setUser(res.user);
        return true;
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
        updateProfile,
        toggleWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
