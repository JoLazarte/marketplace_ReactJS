import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { loginUser, registerUser, logout, clearMessage, clearLoginError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const isLoading = useSelector(state => state.auth.isLoading);
  const loginError = useSelector(state => state.auth.loginError);
  const message = useSelector(state => state.auth.message);
  const token = useSelector(state => state.auth.token);

  const handleLogin = useCallback(async (username, password) => {
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const handleRegister = useCallback(async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const clearMessageData = useCallback(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const clearLoginErrorData = useCallback(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  // Funciones auxiliares para compatibilidad con el código existente
  const role = user?.role || null;

  const canViewCart = useCallback(() => {
    return true; // Por ahora permitimos que todos vean el carrito
  }, []);

  const isAdmin = useCallback(() => {
    return user?.role === 'ADMIN';
  }, [user?.role]);

  const canEditProducts = useCallback(() => {
    return user?.role === 'ADMIN';
  }, [user?.role]);

  const isBuyer = useCallback(() => {
    return user?.role === 'BUYER';
  }, [user?.role]);

  const canAddFavourite = useCallback(() => {
    return user?.role === 'BUYER';
  }, [user?.role]);

  return {
    user,
    isAuthenticated,
    isLoading,
    loginError,
    message,
    token,
    role,
    canViewCart,
    isAdmin,
    canEditProducts,
    isBuyer,
    canAddFavourite,
    handleLogin,
    handleRegister,
    handleLogout,
    clearMessageData,
    clearLoginErrorData
  };
}; 