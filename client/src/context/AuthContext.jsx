import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      authService.getMe()
        .then(({ data }) => setUser(data.user))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('adminToken', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const updateUser = (patch) => setUser(u => ({ ...u, ...patch }));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};
