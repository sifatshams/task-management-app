import { createContext, useEffect, useState } from 'react';
import { API_PATHS } from '../utils/api_path';
import axiosInstance from '../utils/axios_instance';

export const UserContext = createContext();

// provider
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // new state to track loading

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    // fetch user
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error('User not authenticated!', error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // update user
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token); // save token
    setLoading(false);
  };

  // clear user
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
