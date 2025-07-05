import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = sessionStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    setAuth(data);
    sessionStorage.setItem('auth', JSON.stringify(data));
  };

  const logout = () => {
    setAuth(null);
    sessionStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
