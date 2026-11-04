import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (error) {
          console.warn('Auth validation failed, falling back to cached user or clearing token', error);
          // If 401, clear credentials
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, roleHint = null) => {
    try {
      const response = await authService.login(email, password);
      // Support both { token, user } and { access_token, user }
      const accessToken = response.token || response.access_token;
      const rawRole = (response.user?.role || roleHint || 'CUSTOMER').toUpperCase();
      const userData = response.user
        ? { ...response.user, role: (response.user.role || rawRole).toUpperCase() }
        : {
            id: response.id || 'usr_1',
            email,
            name: response.name || email.split('@')[0],
            role: rawRole,
          };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      // Demo fallback if backend is unreachable during frontend standalone testing
      if (!error.response || error.code === 'ERR_NETWORK') {
        const demoRole = roleHint || (email.includes('admin') ? 'admin' : email.includes('provider') ? 'provider' : email.includes('tech') ? 'technician' : 'customer');
        const fallbackUser = {
          id: 'demo_' + Date.now(),
          email,
          name: email.split('@')[0].toUpperCase(),
          role: demoRole,
          phone: '+1 234 567 8900',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
        const demoToken = 'mock_jwt_' + btoa(email);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setToken(demoToken);
        setUser(fallbackUser);
        return { success: true, user: fallbackUser, isDemo: true };
      }
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      const accessToken = response.token || response.access_token || 'mock_registered_token';
      const rawRole = (response.user?.role || data.role || 'CUSTOMER').toUpperCase();
      const userData = response.user
        ? { ...response.user, role: (response.user.role || rawRole).toUpperCase() }
        : {
            id: response.id || 'usr_' + Date.now(),
            email: data.email,
            name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            role: rawRole,
            phone: data.phone || '',
          };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        const fallbackUser = {
          id: 'usr_' + Date.now(),
          email: data.email,
          name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
          role: data.role || 'customer',
          phone: data.phone || '',
        };
        const demoToken = 'mock_jwt_' + btoa(data.email);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setToken(demoToken);
        setUser(fallbackUser);
        return { success: true, user: fallbackUser, isDemo: true };
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateUserState = (newUserData) => {
    const updated = { ...user, ...newUserData };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUserState,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
