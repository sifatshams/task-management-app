import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

export const useUserAuth = () => {
  const { user, loading, clearUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    if (!user) {
      clearUser();
      navigate('/login');
    }
  }, [user, loading, clearUser, navigate]);
};
