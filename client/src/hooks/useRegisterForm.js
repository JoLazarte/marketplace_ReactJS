import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useRegisterForm = () => {
  const { message, clearMessageData } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Limpiar mensajes al montar el componente
  useEffect(() => {
    clearMessageData();
  }, []); // Removí clearMessageData de las dependencias

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'El nombre de usuario es requerido';
        if (value.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
        return '';
      
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return '';
      
      case 'firstName':
        if (!value) return 'El nombre es requerido';
        return '';
      
      case 'lastName':
        if (!value) return 'El apellido es requerido';
        return '';
      
      case 'email':
        if (!value) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'El email no es válido';
        return '';
      
      default:
        return '';
    }
  };

  const handleFormChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar el campo si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched]);

  const handleFieldBlur = useCallback((name, value) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const clearFormData = useCallback(() => {
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: ''
    });
    setErrors({});
    setTouched({});
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  return {
    formData,
    errors,
    touched,
    message,
    handleFormChange,
    handleFieldBlur,
    clearFormData,
    validateForm
  };
}; 