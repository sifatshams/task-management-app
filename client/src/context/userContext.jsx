import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { API_PATHS } from '../utils/api_path';
import axiosInstance from '../utils/axios_instance';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // clear user session
  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  // update user state and token
  const updateUser = useCallback((userData) => {
    setUser(userData);
    if (userData?.token) {
      localStorage.setItem('token', userData.token);
    }
    setLoading(false);
  }, []);

  // fetch user profile on initial load
  useEffect(() => {
    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data?.user || response.data);
      } catch (error) {
        console.error('auth error:', error?.message || error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clearUser]);

  // memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      updateUser,
      clearUser,
    }),
    [user, loading, updateUser, clearUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// custom hook to access user context safely
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;
