// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo session in localStorage
    const stored = localStorage.getItem('slicktrace_demo_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setUserProfile({
        uid: parsed.uid,
        name: parsed.displayName || 'Demo Analyst',
        email: parsed.email,
        role: parsed.role || 'admin',
        organization: 'INCOIS / Coast Guard',
        status: 'active',
      });
    }
    setLoading(false);
  }, []);

  const login = (userData, profileData) => {
    setUser(userData);
    setUserProfile(profileData);
    localStorage.setItem('slicktrace_demo_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('slicktrace_demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
