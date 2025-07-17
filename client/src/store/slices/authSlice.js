import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk para el login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (data.ok) {
        return data.data;
      } else {
        return rejectWithValue(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      return rejectWithValue('Error de conexión. Por favor, intenta más tarde.');
    }
  }
);

// Async thunk para el registro
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userData,
          role: 'BUYER'
        })
      });
      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        if (data.ok) {
          return data;
        } else {
          return rejectWithValue(data.error || 'Error al registrar usuario');
        }
      } catch (error) {
        return rejectWithValue('Error en la respuesta del servidor');
      }
    } catch (error) {
      return rejectWithValue('Error de conexión. Por favor, intenta más tarde.');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  loginError: '',
  error: null,
  message: { type: '', text: '' },
  formData: {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  },
  errors: {
    email: '',
    password: ''
  },
  touched: {
    email: false,
    password: false
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginError = '';
      state.message = { text: '', type: '' };
    },
    clearMessage: (state) => {
      state.message = { type: '', text: '' };
    },
    clearLoginError: (state) => {
      state.loginError = '';
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    updateErrors: (state, action) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    updateTouched: (state, action) => {
      state.touched = { ...state.touched, ...action.payload };
    },
    clearErrors: (state) => {
      state.errors = { email: '', password: '' };
    },
    clearForm: (state) => {
      state.formData = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
      };
      state.errors = { email: '', password: '' };
      state.touched = { email: false, password: false };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.access_token || action.payload.token;
        state.isAuthenticated = true;
        state.loginError = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginError = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = { type: '', text: '' };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.message = { type: 'success', text: '¡Registro exitoso! Serás redirigido a la página de inicio de sesión.' };
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = { type: 'error', text: action.payload };
      });
  }
});

export const {
  logout,
  clearMessage,
  clearLoginError,
  updateFormData,
  updateErrors,
  updateTouched,
  clearErrors,
  clearForm
} = authSlice.actions;

export default authSlice.reducer; 